"use client";

import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { profileSchema, ProfileFormValues } from "../schemas/profile.schemas";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import Image from "next/image";
import { useProfile } from "../hooks/useProfile";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const PSEUDO_MAX = 20;
const PASSWORD_MAX = 72;

interface ProfileFormProps {
  isOpen: boolean;
}

export default function ProfileForm({ isOpen }: ProfileFormProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  // 🎯 Récupère le profil synchrone depuis Redux
  const { profile, isLoading, updateProfile } = useProfile();

  const formik = useFormik<ProfileFormValues>({
    initialValues: {
      pseudo: profile?.pseudo || "", // Instantané !
      password: "********",
    },
    enableReinitialize: true, // Crucial pour suivre les updates après le PUT
    validationSchema: toFormikValidationSchema(profileSchema),
    onSubmit: async (values) => {
      const updateData: Partial<ProfileFormValues> = {};

      if (values.pseudo !== profile?.pseudo) {
        updateData.pseudo = values.pseudo;
      }

      if (
        isEditingPassword &&
        values.password &&
        values.password !== "********" &&
        values.password.trim() !== ""
      ) {
        updateData.password = values.password;
      }

      if (Object.keys(updateData).length > 0) {
        const result = await updateProfile(updateData);
        if (result?.ok) {
          setIsEditingPassword(false);
          formik.setFieldValue("password", "********");
        }
      }
    },
  });

  // 🎯 3. On nettoie les anciens useEffect de resynchronisation manuelle qui devenus obsolètes
  useEffect(() => {
    setMounted(true);
  }, []);

  // Si la modal se ferme, on réinitialise l'état d'édition du mot de passe
  useEffect(() => {
    if (!isOpen) {
      setIsEditingPassword(false);
    }
  }, [isOpen]);

  if (!mounted) return null;
  const isDark = theme === "dark";

  const handleCancelUsername = () => {
    if (profile) formik.setFieldValue("pseudo", profile.pseudo);
  };

  const handleStartEditPassword = () => {
    formik.setFieldValue("password", "");
    setIsEditingPassword(true);
  };

  const handleCancelPassword = () => {
    formik.setFieldValue("password", "********");
    setIsEditingPassword(false);
  };

  const isEditingUsername = formik.values.pseudo !== profile?.pseudo;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header Profil */}
      <div className="flex items-center gap-4 mb-2">
        <div className="w-20 h-20 rounded-full overflow-hidden p-1 bg-gray-100 dark:bg-simpson-dark">
          <Image
            src="/defaultAvatar.webp"
            alt="Avatar"
            width={70}
            height={70}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="flex flex-col">
          {/* 🎯 Affichage sécurisé pendant le chargement */}
          <span className="text-title font-bold text-text">
            {isLoading && !profile
              ? "Chargement..."
              : profile?.pseudo || "Utilisateur"}
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-medium font-semibold text-simpson-dark dark:text-simpson-yellow">
              {isLoading && !profile
                ? "..."
                : profile?.money?.toLocaleString() || 0}
            </span>
            <Image
              src="/donuts.webp"
              alt="Donut Icon"
              width={18}
              height={18}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* INPUT 1 : PSEUDO */}
      <div className="flex flex-col gap-1.5 mb-1">
        <div className="flex justify-between items-center">
          <label htmlFor="pseudo" className="text-body font-medium text-text">
            Nom d'utilisateur
          </label>
          {isEditingUsername && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancelUsername}
                className="text-xs font-semibold text-text/50 hover:underline cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => formik.handleSubmit()}
                className="text-xs font-semibold text-simpson-lightblue hover:underline cursor-pointer"
              >
                Valider
              </button>
            </div>
          )}
        </div>
        <div
          className={`h-12 border rounded-xl flex items-center px-4 gap-3 transition-all bg-white dark:bg-simpson-darklight ${
            formik.touched.pseudo && formik.errors.pseudo
              ? "border-red-500"
              : "border-gray-300 dark:border-simpson-dark focus-within:border-simpson-lightblue focus-within:dark:border-simpson-lightblue"
          }`}
        >
          <FaUser className="w-4 h-4 text-text/40 shrink-0" />
          <input
            id="pseudo"
            type="text"
            maxLength={PSEUDO_MAX}
            disabled={isLoading}
            className="w-full h-full border-none outline-none text-medium text-text bg-transparent"
            placeholder="Chargement du pseudo..."
            {...formik.getFieldProps("pseudo")}
          />
        </div>
        <div className="flex justify-start items-center gap-2 h-5 mt-0.5">
          <span
            className={`text-xs shrink-0 ${formik.values.pseudo.length >= PSEUDO_MAX ? "text-red-500" : "text-text/40"}`}
          >
            {formik.values.pseudo.length}/{PSEUDO_MAX}
          </span>
          {formik.touched.pseudo && formik.errors.pseudo && (
            <p className="text-red-500 text-xs truncate">
              {formik.errors.pseudo}
            </p>
          )}
        </div>
      </div>

      {/* INPUT 2 : EMAIL (Lecture seule) */}
      <div className="flex flex-col gap-1.5 mb-1">
        <label className="text-body font-medium text-text">Email</label>
        <div className="h-12 border border-gray-300 dark:border-simpson-dark rounded-xl flex items-center px-4 gap-3 bg-white/60 dark:bg-simpson-darklight/60 opacity-60 cursor-not-allowed select-none">
          <FaEnvelope className="w-4 h-4 text-text/30 shrink-0" />
          <input
            type="text"
            /* 🎯 On affiche directement la valeur du profil ou un texte d'attente */
            value={
              isLoading && !profile
                ? "Chargement de l'email..."
                : profile?.email || ""
            }
            readOnly
            className="w-full h-full border-none outline-none text-medium text-text/70 bg-transparent cursor-not-allowed"
          />
        </div>
        <div className="h-5 mt-0.5" />
      </div>

      {/* INPUT 3 : MOT DE PASSE (Inchangé) */}
      <div className="flex flex-col gap-1.5 mb-1">
        <div className="flex justify-between items-center">
          <label htmlFor="password" className="text-body font-medium text-text">
            Mot de passe
          </label>
          {isEditingPassword ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancelPassword}
                className="text-xs font-semibold text-text/50 hover:underline cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => formik.handleSubmit()}
                className="text-xs font-semibold text-simpson-lightblue hover:underline cursor-pointer"
              >
                Valider
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleStartEditPassword}
              className="text-body font-semibold text-simpson-lightblue hover:underline cursor-pointer"
            >
              Modifier
            </button>
          )}
        </div>
        <div
          className={`h-12 border rounded-xl flex items-center px-4 gap-3 transition-all bg-white dark:bg-simpson-darklight ${
            formik.touched.password && formik.errors.password
              ? "border-red-500"
              : "border-gray-300 dark:border-simpson-dark focus-within:border-simpson-lightblue focus-within:dark:border-simpson-lightblue"
          }`}
        >
          <FaLock className="w-4 h-4 text-text/40 shrink-0" />
          <input
            id="password"
            type={isEditingPassword ? "text" : "password"}
            readOnly={!isEditingPassword}
            maxLength={PASSWORD_MAX}
            disabled={isLoading}
            className={`w-full h-full border-none outline-none text-medium bg-transparent ${
              isEditingPassword
                ? "text-text"
                : "text-text/50 tracking-widest font-mono"
            }`}
            placeholder={isEditingPassword ? "Nouveau mot de passe" : ""}
            {...formik.getFieldProps("password")}
          />
        </div>
        <div className="flex justify-start items-center gap-2 h-5 mt-0.5">
          {isEditingPassword && (
            <span
              className={`text-xs shrink-0 ${(formik.values.password || "").length >= PASSWORD_MAX ? "text-red-500" : "text-text/40"}`}
            >
              {(formik.values.password || "").length}/{PASSWORD_MAX}
            </span>
          )}
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-xs truncate">
              {formik.errors.password}
            </p>
          )}
        </div>
      </div>

      {/* TOGGLE THEME INTERNE (Inchangé) */}
      <div className="flex justify-between items-center mt-2 pt-4 border-t border-gray-300 dark:border-simpson-dark">
        <span className="text-body font-medium text-text">Thème sombre :</span>
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="group relative w-13 h-7 rounded-full p-0.5 transition-all duration-300 outline-none cursor-pointer bg-[#252532] border border-[#32303e] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
          aria-label="Changer de thème"
        >
          <div
            className={`relative w-full h-full flex items-center justify-between ${isDark ? "pl-0 pr-1.5" : "pl-0.5 pr-1"}`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-linear-to-b from-[#3b3a4e] to-[#272733] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.5)] transition-transform duration-300 z-10 ${isDark ? "translate-x-6" : "translate-x-0"}`}
            />
            <div
              className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${isDark ? "border-simpson-lightblue bg-simpson-lightblue/20 shadow-[0_0_5px] shadow-simpson-lightblue -translate-x-6" : "border-simpson-orange bg-simpson-orange/20 shadow-[0_0_5px] shadow-simpson-orange translate-x-0"}`}
            />
          </div>
        </button>
      </div>
    </div>
  );
}

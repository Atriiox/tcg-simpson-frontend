"use client";

import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { profileSchema, ProfileFormValues } from "../schemas/profile.schemas";
import { FaUser, FaEnvelope, FaLock, FaSignOutAlt } from "react-icons/fa";
import Image from "next/image";
import { useProfile } from "../hooks/useProfile";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setAuth, toggleTheme } from "@/reducers/user";
import { RootState } from "@/store/store";

const PSEUDO_MAX = 20;
const PASSWORD_MAX = 72;

interface ProfileFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileForm({ isOpen, onClose }: ProfileFormProps) {
  const [mounted, setMounted] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const { profile, isLoading, updateProfile } = useProfile();

  const isDark = useSelector((state: RootState) => state.user.isDarkMode);

  const formik = useFormik<ProfileFormValues>({
    initialValues: {
      pseudo: profile?.pseudo || "",
      password: "********",
    },
    enableReinitialize: true,
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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setIsEditingPassword(false);
    }
  }, [isOpen]);

  if (!mounted) return null;

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

  const handleLogout = () => {
    onClose();
    localStorage.removeItem("token");
    dispatch(
      setAuth({
        token: null,
        pseudo: null,
        email: null,
        money: null,
        theme: false,
      }),
    );
    router.push("/");
  };

  const isEditingUsername = formik.values.pseudo !== profile?.pseudo;

  const stats = profile?.stats || {
    legendary: 0,
    legendaryTotal: 4,
    rare: 0,
    rareTotal: 12,
    common: 0,
    commonTotal: 24,
    uniqueCards: 0,
    totalCards: 0,
  };

  return (
    <div className="w-full md:w-[760px] grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[85vh] overflow-y-auto p-2 text-black dark:text-white selection:bg-simpson-orange/20">
      
      {/* ================= COLONNE GAUCHE : IDENTITÉ & STATS ================= */}
      <div className="flex flex-col gap-6 md:pr-2">
        {/* Header Profil */}
        <div className="flex items-center gap-5 pb-2">
          <div className="w-18 h-18 rounded-full overflow-hidden shrink-0">
            <Image
              src="/defaultAvatar.webp"
              alt="Avatar"
              width={72}
              height={72}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xl font-black tracking-tight truncate">
              {isLoading && !profile?.pseudo ? "Chargement..." : profile?.pseudo || "Joueur"}
            </span>
            {/* Donuts agrandis et mis en valeur */}
            <div className="flex items-center gap-2 mt-1.5 bg-black/[0.05] dark:bg-white/[0.08] px-3 py-1 rounded-full w-fit">
              <span className="text-sm font-black text-simpson-orange dark:text-simpson-yellow">
                {isLoading && !profile?.money ? "..." : profile?.money?.toLocaleString() || 0}
              </span>
              <Image
                src="/donuts1.webp"
                alt="Donut"
                width={20}
                height={20}
                className="object-contain w-5 h-5 shrink-0"
              />
            </div>
          </div>
        </div>

        {/* Bloc Stats */}
        <div className="flex flex-col gap-4 bg-black/[0.02] dark:bg-white/[0.02] rounded-2xl p-4 border border-black/[0.05] dark:border-white/[0.05]">
          <h4 className="text-xs font-bold text-black dark:text-white">
            Statistiques de collection
          </h4>

          {/* Raretés */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-sm bg-white dark:bg-simpson-darklight/40 px-3 py-2 rounded-xl border border-black/[0.03] dark:border-white/[0.02]">
              <span className="font-bold text-amber-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Légendaire
              </span>
              <span className="font-extrabold text-xs">
                {stats.legendary} <span className="opacity-40 font-normal">/ {stats.legendaryTotal}</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-sm bg-white dark:bg-simpson-darklight/40 px-3 py-2 rounded-xl border border-black/[0.03] dark:border-white/[0.02]">
              <span className="font-bold text-blue-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Rare
              </span>
              <span className="font-extrabold text-xs">
                {stats.rare} <span className="opacity-40 font-normal">/ {stats.rareTotal}</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-sm bg-white dark:bg-simpson-darklight/40 px-3 py-2 rounded-xl border border-black/[0.03] dark:border-white/[0.02]">
              <span className="font-bold opacity-70 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500" />
                Commune
              </span>
              <span className="font-extrabold text-xs">
                {stats.common} <span className="opacity-40 font-normal">/ {stats.commonTotal}</span>
              </span>
            </div>
          </div>

          <div className="h-[1px] bg-black/[0.05] dark:bg-white/[0.05] my-1" />

          {/* Totaux Globaux */}
          <div className="grid grid-cols-2 gap-4 px-1 py-0.5">
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-black/60 dark:text-white/60 block truncate">Cartes uniques</span>
              <span className="text-sm font-black">{stats.uniqueCards} <span className="text-xs font-normal opacity-40">/ 40</span></span>
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-black/60 dark:text-white/60 block truncate">Total de cartes</span>
              <span className="text-sm font-black">{stats.totalCards}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= COLONNE DROITE : COMPTE & CONFIGURATION ================= */}
      <div className="flex flex-col gap-5 border-t md:border-t-0 md:border-l border-black/[0.05] dark:border-white/[0.05] pt-6 md:pt-0 md:pl-6 justify-between">
        <div className="space-y-4">
          
          {/* NOM D'UTILISATEUR */}
          <div className="flex flex-col gap-1.5">
            <div className="px-0.5">
              <label htmlFor="pseudo" className="text-xs font-bold text-black dark:text-white">
                Nom d'utilisateur
              </label>
            </div>
            <div className={`h-11 rounded-xl flex items-center px-3.5 gap-3 transition-all bg-black/[0.03] dark:bg-white/[0.03] border ${formik.touched.pseudo && formik.errors.pseudo ? "border-red-500/50" : "border-transparent focus-within:border-simpson-lightblue/40 focus-within:bg-transparent"}`}>
              <FaUser className="w-3.5 h-3.5 opacity-40 shrink-0" />
              <input
                id="pseudo"
                type="text"
                maxLength={PSEUDO_MAX}
                disabled={isLoading}
                className="w-full h-full border-none outline-none text-sm bg-transparent font-semibold"
                placeholder="Pseudo"
                {...formik.getFieldProps("pseudo")}
              />
            </div>
            {/* Hauteur fixe (h-5) pour éliminer le décalage à la saisie */}
            <div className="flex justify-between items-center px-1 text-xs h-5">
              <div className="min-w-0 flex-1">
                {formik.touched.pseudo && formik.errors.pseudo ? (
                  <p className="text-red-500 text-[11px] truncate">{formik.errors.pseudo}</p>
                ) : (
                  /* Compteur fixé à gauche */
                  <span className="text-[10px] font-bold opacity-40">
                    {formik.values.pseudo.length}/{PSEUDO_MAX}
                  </span>
                )}
              </div>
              
              {/* Actions fixées à droite */}
              {isEditingUsername && (
                <div className="flex gap-3 font-bold shrink-0">
                  <button type="button" onClick={handleCancelUsername} className="opacity-50 hover:opacity-100 cursor-pointer transition-opacity">
                    Annuler
                  </button>
                  <button type="button" onClick={() => formik.handleSubmit()} className="text-simpson-lightblue hover:opacity-80 cursor-pointer">
                    Enregistrer
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* EMAIL (READ ONLY) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-black dark:text-white px-0.5">
              Adresse email
            </label>
            <div className="h-11 rounded-xl flex items-center px-3.5 gap-3 bg-black/[0.01] dark:bg-white/[0.01] border border-black/[0.03] dark:border-white/[0.03] opacity-40 cursor-not-allowed select-none">
              <FaEnvelope className="w-3.5 h-3.5 shrink-0" />
              <input
                type="text"
                value={isLoading && !profile?.email ? "Chargement..." : profile?.email || ""}
                readOnly
                className="w-full h-full border-none outline-none text-sm bg-transparent cursor-not-allowed font-medium"
              />
            </div>
          </div>

          {/* MOT DE PASSE */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center px-0.5">
              <label htmlFor="password" className="text-xs font-bold text-black dark:text-white">
                Mot de passe
              </label>
              {isEditingPassword ? (
                <div className="flex gap-3 text-xs font-bold">
                  <button type="button" onClick={handleCancelPassword} className="opacity-50 hover:opacity-100 cursor-pointer transition-opacity">
                    Annuler
                  </button>
                  <button type="button" onClick={() => formik.handleSubmit()} className="text-simpson-lightblue hover:opacity-80 cursor-pointer">
                    Enregistrer
                  </button>
                </div>
              ) : (
                <button type="button" onClick={handleStartEditPassword} className="text-xs font-bold text-simpson-lightblue opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
                  Modifier
                </button>
              )}
            </div>
            <div className={`h-11 rounded-xl flex items-center px-3.5 gap-3 transition-all bg-black/[0.03] dark:bg-white/[0.03] border ${formik.touched.password && formik.errors.password ? "border-red-500/50" : "border-transparent focus-within:border-simpson-lightblue/40 focus-within:bg-transparent"}`}>
              <FaLock className="w-3.5 h-3.5 opacity-40 shrink-0" />
              <input
                id="password"
                type={isEditingPassword ? "text" : "password"}
                readOnly={!isEditingPassword}
                maxLength={PASSWORD_MAX}
                disabled={isLoading}
                className={`w-full h-full border-none outline-none text-sm bg-transparent font-semibold ${
                  !isEditingPassword ? "opacity-40 tracking-widest font-mono text-xs" : ""
                }`}
                placeholder={isEditingPassword ? "Nouveau mot de passe" : ""}
                {...formik.getFieldProps("password")}
              />
            </div>
            <div className="h-4 px-1 text-xs">
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-[11px] truncate">{formik.errors.password}</p>
              )}
            </div>
          </div>

          {/* INTERRUPTEUR THÈME SOMBRE CUSTOM */}
          <div className="flex justify-between items-center pt-2 px-0.5">
            <span className="text-xs font-bold text-black dark:text-white">Thème sombre</span>
            <button
              type="button"
              onClick={() => dispatch(toggleTheme())}
              className="group relative w-13 h-7 rounded-full p-0.5 transition-all duration-300 outline-none cursor-pointer bg-[#252532] border border-[#32303e] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
              aria-label="Changer de thème"
            >
              <div className={`relative w-full h-full flex items-center justify-between ${isDark ? "pl-0 pr-1.5" : "pl-0.5 pr-1"}`}>
                <div className={`w-5 h-5 rounded-full bg-linear-to-b from-[#3b3a4e] to-[#272733] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.5)] transition-transform duration-300 z-10 ${isDark ? "translate-x-6" : "translate-x-0"}`} />
                <div className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${isDark ? "border-simpson-lightblue bg-simpson-lightblue/20 shadow-[0_0_5px] shadow-simpson-lightblue -translate-x-6" : "border-simpson-orange bg-simpson-orange/20 shadow-[0_0_5px] shadow-simpson-orange translate-x-0"}`} />
              </div>
            </button>
          </div>
        </div>

        {/* BOUTON DÉCONNEXION */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full h-11 mt-4 flex items-center justify-center gap-2 text-red-500/90 hover:text-red-500 font-bold rounded-xl bg-red-500/[0.04] hover:bg-red-500/[0.08] border border-red-500/10 transition-all cursor-pointer text-xs tracking-wider"
        >
          <FaSignOutAlt className="w-3.5 h-3.5" />
          Se déconnecter
        </button>
      </div>

    </div>
  );
}
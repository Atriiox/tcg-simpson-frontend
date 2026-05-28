"use client";

import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { FormikProps } from "formik";
import { ProfileFormValues } from "../schemas/profile.schemas";

const PSEUDO_MAX = 20;
const PASSWORD_MAX = 72;

interface ProfileFieldsProps {
  formik: FormikProps<ProfileFormValues>;
  profile: { pseudo: string | null; email: string | null } | null;
  isLoading: boolean;
  isEditingPassword: boolean;
  onStartEditPassword: () => void;
  onCancelPassword: () => void;
  onSave: () => void;
}

export default function ProfileFields({
  formik,
  profile,
  isLoading,
  isEditingPassword,
  onStartEditPassword,
  onCancelPassword,
  onSave,
}: ProfileFieldsProps) {
  const isEditingUsername =
    formik.values.pseudo !== profile?.pseudo &&
    formik.values.pseudo.trim() !== "";

  return (
    <div className="space-y-4">
      {/* PSEUDO */}
      <div className="flex flex-col gap-1.5">
        <div className="px-0.5">
          <label htmlFor="pseudo" className="text-xs font-bold text-black dark:text-white">
            Nom d'utilisateur
          </label>
        </div>
        <div className={`h-11 rounded-xl flex items-center px-3.5 gap-3 transition-all bg-black/3 dark:bg-white/3 border ${formik.touched.pseudo && formik.errors.pseudo ? "border-red-500/50" : "border-transparent focus-within:border-simpson-lightblue/40 focus-within:bg-transparent"}`}>
          <FaUser className="w-3.5 h-3.5 opacity-40 shrink-0" />
          <input
            id="pseudo"
            type="text"
            maxLength={PSEUDO_MAX}
            disabled={isLoading}
            className="w-full h-full border-none outline-none text-sm bg-transparent font-semibold cursor-text"
            placeholder="Pseudo"
            {...formik.getFieldProps("pseudo")}
          />
        </div>
        <div className="flex justify-between items-center px-1 text-xs h-5">
          <div className="min-w-0 flex-1">
            {formik.touched.pseudo && formik.errors.pseudo ? (
              <p className="text-red-500 text-[11px] truncate">{formik.errors.pseudo}</p>
            ) : (
              <span className="text-[10px] font-bold opacity-40">{(formik.values.pseudo || "").length}/{PSEUDO_MAX}</span>
            )}
          </div>
          {isEditingUsername && (
            <div className="flex gap-3 font-bold shrink-0">
              <button type="button" onClick={() => formik.setFieldValue("pseudo", profile?.pseudo)} className="opacity-50 hover:opacity-100 cursor-pointer transition-opacity">
                Annuler
              </button>
              <button type="button" onClick={onSave} className="text-simpson-lightblue hover:opacity-80 cursor-pointer">
                Enregistrer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* EMAIL */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-black dark:text-white px-0.5">Adresse email</label>
        <div className="h-11 rounded-xl flex items-center px-3.5 gap-3 bg-black/1 dark:bg-white/1 border border-black/3 dark:border-white/3 opacity-40 cursor-not-allowed select-none">
          <FaEnvelope className="w-3.5 h-3.5 shrink-0" />
          <input
            type="text"
            value={isLoading && !profile?.email ? "Chargement..." : profile?.email || ""}
            readOnly
            className="w-full h-full border-none outline-none text-sm bg-transparent cursor-not-allowed font-medium"
          />
        </div>
      </div>

      {/* PASSWORD */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center px-0.5">
          <label htmlFor="password" className="text-xs font-bold text-black dark:text-white">
            Mot de passe
          </label>
          {isEditingPassword ? (
            <div className="flex gap-3 text-xs font-bold">
              <button type="button" onClick={onCancelPassword} className="opacity-50 hover:opacity-100 cursor-pointer transition-opacity">
                Annuler
              </button>
              <button type="button" onClick={onSave} className="text-simpson-lightblue hover:opacity-80 cursor-pointer">
                Enregistrer
              </button>
            </div>
          ) : (
            <button type="button" onClick={onStartEditPassword} className="text-xs font-bold text-simpson-lightblue opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
              Modifier
            </button>
          )}
        </div>
        <div className={`h-11 rounded-xl flex items-center px-3.5 gap-3 transition-all bg-black/3 dark:bg-white/3 border ${formik.touched.password && formik.errors.password ? "border-red-500/50" : "border-transparent focus-within:border-simpson-lightblue/40 focus-within:bg-transparent"}`}>
          <FaLock className="w-3.5 h-3.5 opacity-40 shrink-0" />
          <input
            id="password"
            type={isEditingPassword ? "text" : "password"}
            readOnly={!isEditingPassword}
            maxLength={PASSWORD_MAX}
            disabled={isLoading}
            className={`w-full h-full border-none outline-none text-sm bg-transparent font-semibold cursor-text ${!isEditingPassword ? "opacity-40 tracking-widest font-mono text-xs" : ""}`}
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
    </div>
  );
}

"use client";

import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { profileSchema, ProfileFormValues } from "../schemas/profile.schemas";
import { useProfile } from "../hooks/useProfile";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAuth } from "@/reducers/user";
import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";
import ProfileFields from "./ProfileFields";
import ProfileSettings from "./ProfileSettings";

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Profile({ isOpen, onClose }: ProfileProps) {
  const [mounted, setMounted] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const { profile, isLoading, updateProfile } = useProfile();

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

      if (isEditingPassword && values.password && values.password !== "********" && values.password.trim() !== "") {
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

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!isOpen) setIsEditingPassword(false);
  }, [isOpen]);

  if (!mounted) return null;

  const handleLogout = () => {
    onClose();
    localStorage.removeItem("token");
    dispatch(setAuth({ token: null, pseudo: null, avatar: null, email: null, money: null, theme: false, countdownEnds: null }));
    router.push("/");
  };

const stats = profile?.stats || { bySerie: [], uniqueCards: 0, totalCards: 0 };

  return (
    <div className="relative pointer-events-auto w-full md:w-190 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[85vh] overflow-y-auto p-2 text-black dark:text-white selection:bg-simpson-orange/20">
      {/* COLONNE GAUCHE */}
      <div className="flex flex-col gap-6 md:pr-2">
        <ProfileHeader
          pseudo={profile?.pseudo ?? null}
          email={profile?.email ?? null}
          money={profile?.money ?? null}
          avatar={profile?.avatar ?? null}
          isLoading={isLoading}
        />
        <ProfileStats stats={stats} />
      </div>

      {/* COLONNE DROITE */}
      <div className="relative flex flex-col gap-5 border-t md:border-t-0 md:border-l border-black/5 dark:border-white/5 pt-6 md:pt-0 md:pl-6 justify-between">
        <ProfileFields
          formik={formik}
          profile={profile ? { pseudo: profile.pseudo, email: profile.email } : null}
          isLoading={isLoading}
          isEditingPassword={isEditingPassword}
          onStartEditPassword={() => {
            formik.setFieldValue("password", "");
            setIsEditingPassword(true);
          }}
          onCancelPassword={() => {
            formik.setFieldValue("password", "********");
            formik.setFieldTouched("password", false);
            setIsEditingPassword(false);
          }}
          onSave={() => formik.handleSubmit()}
        />
        <ProfileSettings onLogout={handleLogout} />
      </div>
    </div>
  );
}

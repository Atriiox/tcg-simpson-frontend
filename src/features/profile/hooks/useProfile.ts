"use client";

import { useState, useEffect, useCallback } from "react";

export interface UserProfile {
  pseudo: string;
  email: string;
  avatar: string;
  money: number;
  myCollection: string[];
  deck: string[];
  darkMode: boolean;
}

export const useProfile = (isOpen: boolean) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/users/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la récupération du profil");
      }

      const data = await res.json();
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = async (updates: {
    pseudo?: string;
    password?: string;
  }) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de mise à jour");

      setProfile(data);
      return { ok: true };
    } catch (err: any) {
      setError(err.message);
      return { ok: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen, fetchProfile]);

  return { profile, isLoading, error, updateProfile };
};

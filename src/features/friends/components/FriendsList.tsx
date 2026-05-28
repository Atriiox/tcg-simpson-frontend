"use client";

import { useEffect, useRef, useState } from "react";
import { useFriends } from "../hooks/useFriends";
import { useFormik } from "formik";
import Image from "next/image";
import { BiTransfer, BiTrash } from "react-icons/bi";
import { GiSwordsEmblem } from "react-icons/gi";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

// Nombre total de cartes du TCG
const TOTAL_CARDS_SET = 40;

interface FriendFormValues {
  pseudo: string;
}

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all duration-200 bg-simpson-gray/5 dark:bg-white/5 hover:bg-simpson-orange/10 dark:hover:bg-simpson-yellow/10 text-simpson-dark dark:text-simpson-white hover:text-simpson-orange dark:hover:text-simpson-yellow cursor-pointer"
    >
      {icon}
      {label}
    </button>
  );
}

export default function FriendsList() {
  const {
    friends,
    setNewFriendPseudo,
    suggestions,
    setSuggestions,
    handleAddFriend,
    handleRemoveFriend,
    loadFriends,
    isLoading,
    error,
  } = useFriends();

  const [friendToRemove, setFriendToRemove] = useState<string | null>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  const formik = useFormik<FriendFormValues>({
    initialValues: { pseudo: "" },
    onSubmit: async (values, { setFieldError, setSubmitting, resetForm }) => {
      try {
        await handleAddFriend(values.pseudo);
        resetForm();
        setSuggestions([]);
        setNewFriendPseudo("");
        loadFriends();
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === "USER_NOT_FOUND")
            setFieldError("pseudo", "Ce joueur n'existe pas");
          else if (err.message === "CANT_ADD_SELF")
            setFieldError("pseudo", "Tu ne peux pas t'ajouter toi-même");
          else setFieldError("pseudo", "Une erreur est survenue");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const confirmRemove = async () => {
    if (friendToRemove) {
      await handleRemoveFriend(friendToRemove);
      setFriendToRemove(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(e.target as Node)
      )
        setSuggestions([]);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setSuggestions]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-transparent h-full min-h-[50vh]">
        <div className="text-center space-y-2 animate-pulse">
          <div className="w-8 h-8 border-4 border-simpson-orange border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-medium text-simpson-gray font-medium">
            Synchronisation de la liste d'amis...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-transparent p-6 h-full min-h-[50vh]">
        <div className="flex flex-col items-center gap-3 bg-white/40 dark:bg-simpson-darklight/40 backdrop-blur-md px-6 py-4 rounded-2xl border border-red-500/20 dark:border-red-500/10 shadow-lg text-center max-w-sm animate-fadeIn">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </div>
          <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-bold tracking-wide uppercase">
            Erreur de connexion
          </p>
          <p className="text-[11px] sm:text-xs text-simpson-gray dark:text-simpson-white/60 font-medium leading-relaxed">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 p-6 md:p-10 font-main text-simpson-dark dark:text-simpson-white select-none overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-simpson-gray/10 dark:border-white/10 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-simpson-orange dark:text-simpson-yellow">
              Liste d'amis
            </h1>
            <p className="text-sm font-medium text-simpson-gray mt-1">
              Gère ta liste d'amis et prépare tes futurs duels
            </p>
          </div>

          <div ref={autocompleteRef} className="relative w-full md:w-auto">
            <form
              onSubmit={formik.handleSubmit}
              className="flex gap-2 w-full md:w-auto items-center"
            >
              <input
                id="pseudo"
                name="pseudo"
                type="text"
                placeholder="Rechercher un pseudo"
                value={formik.values.pseudo}
                onChange={(e) => {
                  formik.handleChange(e);
                  setNewFriendPseudo(e.target.value);
                }}
                disabled={formik.isSubmitting}
                className={`w-full md:w-64 bg-white dark:bg-simpson-darklight border px-4 py-2 rounded-xl text-sm transition-colors font-medium placeholder:text-simpson-gray/50 ${
                  formik.errors.pseudo
                    ? "border-red-500"
                    : "border-simpson-gray/20 dark:border-white/5"
                }`}
              />
              <Button
                type="submit"
                disabled={formik.isSubmitting}
                className="px-5 py-2 rounded-xl text-sm font-bold cursor-pointer h-10"
              >
                {formik.isSubmitting ? "..." : "Ajouter"}
              </Button>
            </form>
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-12 bg-white dark:bg-simpson-darklight border border-simpson-gray/20 dark:border-white/10 rounded-xl shadow-lg z-50 overflow-hidden">
                {suggestions.map((s) => (
                  <button
                    key={s.pseudo}
                    type="button"
                    onClick={() => {
                      setSuggestions([]);
                      formik.setFieldValue("pseudo", s.pseudo);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-simpson-gray/5 cursor-pointer"
                  >
                    <span className="text-sm font-semibold">{s.pseudo}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full pt-2">
          {friends.length > 0 ? (
            friends.map((friend, i) => (
              <div
                key={i}
                className="flex flex-row items-center gap-4 w-full bg-white/60 dark:bg-simpson-darklight/60 backdrop-blur-md p-4 rounded-xl border border-white/40 dark:border-white/10 shadow-md transition-all duration-200 hover:shadow-lg group relative"
              >
                <button
                  onClick={() => setFriendToRemove(friend.pseudo)}
                  className="absolute top-3 right-3 text-simpson-gray hover:text-red-500 transition-colors cursor-pointer p-1 rounded-lg hover:bg-red-500/5"
                >
                  <BiTrash size={16} />
                </button>

                <div className="shrink-0">
                  <div className="w-16 h-16 rounded-full relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={friend.avatar || "/defaultAvatar.webp"}
                      alt={friend.pseudo}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-between flex-1 min-w-0 pr-6">
                  <div className="text-left">
                    <h3 className="text-base font-bold text-simpson-dark dark:text-simpson-white truncate">
                      {friend.pseudo}
                    </h3>

                    <div className="flex flex-col gap-1.5 mt-1">
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        En ligne
                      </span>

                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-simpson-gray dark:text-white/70 bg-simpson-gray/5 dark:bg-black/10 px-2 py-0.5 rounded-md w-fit mt-0.5">
                        <span>Collection :</span>
                        <strong className="text-simpson-dark dark:text-white font-extrabold text-sm">
                          {friend.uniqueCardsCount || 0}
                        </strong>
                        <span className="text-[10px] opacity-60">
                          / {TOTAL_CARDS_SET}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3 pt-3 border-t border-simpson-gray/10 dark:border-white/5">
                    <ActionButton
                      icon={<GiSwordsEmblem size={14} />}
                      label="Duel"
                      onClick={() => {}}
                    />
                    <ActionButton
                      icon={<BiTransfer size={14} />}
                      label="Échange"
                      onClick={() => {}}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-3 text-center py-12 bg-white/40 dark:bg-simpson-darklight/40 backdrop-blur-md rounded-2xl border border-simpson-gray/10 dark:border-white/5 w-full">
              <p className="text-sm font-medium text-simpson-gray">
                Ta liste d'amis est bien vide
              </p>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={!!friendToRemove} onClose={() => setFriendToRemove(null)}>
        <div className="flex flex-col gap-6 p-5 max-w-xl w-full mx-auto font-main">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-simpson-dark dark:text-simpson-white">
              Supprimer un ami
            </h3>
            <p className="text-sm text-simpson-gray leading-relaxed">
              Tu es sur le point de retirer{" "}
              <span className="font-bold text-simpson-orange dark:text-simpson-yellow">
                {friendToRemove}
              </span>{" "}
              de ta liste. Cette action supprimera tous les accès aux duels et
              échanges directs avec ce joueur.
            </p>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <Button
              onClick={() => setFriendToRemove(null)}
              className="flex-1 py-2 text-xs bg-transparent border border-simpson-gray/20 dark:border-white/10 text-simpson-gray! hover:bg-simpson-gray/5 shadow-none"
            >
              Annuler
            </Button>
            <Button
              onClick={confirmRemove}
              className="flex-1 py-2 text-xs bg-red-500 hover:bg-red-600 text-white font-bold"
            >
              Confirmer la suppression
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

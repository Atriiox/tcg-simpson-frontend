"use client";

import { useEffect, useRef, useState } from "react";
import { useFriends } from "../hooks/useFriends";
import { useFormik } from "formik";
import Image from "next/image";
import { BiTransfer, BiUserCircle, BiTrash } from "react-icons/bi";
import { GiSwordsEmblem } from "react-icons/gi";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

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
      className="flex items-center justify-center gap-2 py-2 px-2 rounded-xl text-xs font-semibold transition-all duration-200 bg-simpson-gray/5 dark:bg-white/5 hover:bg-simpson-orange/10 dark:hover:bg-simpson-yellow/10 text-simpson-dark dark:text-simpson-white hover:text-simpson-orange dark:hover:text-simpson-yellow cursor-pointer"
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
                className={`w-full md:w-64 bg-white dark:bg-simpson-darklight border px-4 py-2.5 rounded-xl text-sm transition-colors font-medium placeholder:text-simpson-gray/50 ${
                  formik.errors.pseudo
                    ? "border-red-500"
                    : "border-simpson-gray/20 dark:border-white/5"
                }`}
              />
              <Button
                type="submit"
                disabled={formik.isSubmitting}
                className="px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer h-10"
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

        {friends.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {friends.map((friend, i) => (
              <div
                key={i}
                className="bg-white dark:bg-simpson-darklight border border-simpson-gray/5 rounded-2xl p-5 shadow-xs relative"
              >
                <button
                  onClick={() => setFriendToRemove(friend.pseudo)}
                  className="absolute top-4 right-4 text-simpson-gray hover:text-red-500 transition-colors cursor-pointer"
                >
                  <BiTrash size={18} />
                </button>
                <div className="flex items-center gap-4 mb-5 mt-2">
                  <div className="w-14 h-14 rounded-full bg-simpson-gray/10 relative overflow-hidden">
                    <Image
                      src={friend.avatar || "/defaultAvatar.webp"}
                      alt={friend.pseudo}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{friend.pseudo}</h3>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{" "}
                      En ligne
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <ActionButton
                    icon={<GiSwordsEmblem size={16} />}
                    label="Duel"
                    onClick={() => {}}
                  />
                  <ActionButton
                    icon={<BiTransfer size={16} />}
                    label="Échange"
                    onClick={() => {}}
                  />
                  <ActionButton
                    icon={<BiUserCircle size={16} />}
                    label="Profil"
                    onClick={() => {}}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-simpson-darklight rounded-3xl">
            <p className="text-sm font-medium text-simpson-gray">
              Ta liste d'amis est bien vide
            </p>
          </div>
        )}
      </div>

      <Modal isOpen={!!friendToRemove} onClose={() => setFriendToRemove(null)}>
        <div className="flex flex-col gap-8 p-6">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-simpson-dark dark:text-simpson-white">
              Supprimer un ami
            </h3>
            <p className="text-base text-simpson-gray leading-relaxed">
              Tu es sur le point de retirer{" "}
              <span className="font-semibold text-simpson-orange dark:text-simpson-yellow">
                {friendToRemove}
              </span>{" "}
              de ta liste. Cette action supprimera tous les accès aux duels et
              échanges directs avec ce joueur.
            </p>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
            <Button
              onClick={() => setFriendToRemove(null)}
              className="flex-1 py-4 text-sm bg-transparent border border-simpson-gray/20 dark:border-white/10 !text-simpson-gray hover:bg-simpson-gray/5 shadow-none"
            >
              Annuler
            </Button>
            <Button
              onClick={confirmRemove}
              className="flex-1 py-4 text-sm bg-red-500 hover:bg-red-600 text-white font-bold"
            >
              Confirmer la suppression
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
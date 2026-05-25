"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { env } from "@/config/env";
import { RootState } from "@/store/store";

interface Friend {
  pseudo: string;
  avatar: string;
}

export function useFriends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [newFriendPseudo, setNewFriendPseudo] = useState("");
  const [suggestions, setSuggestions] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { token } = useSelector((state: RootState) => state.user);

  const loadFriends = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/me/friends`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setFriends(data);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des amis :", err);
    }
  };

  useEffect(() => {
    loadFriends();
  }, [token]);

  useEffect(() => {
    const searchPseudos = async () => {
      if (newFriendPseudo.trim().length < 1 || !token) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(
          `${env.NEXT_PUBLIC_API_URL}/users/search?q=${encodeURIComponent(newFriendPseudo.trim())}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
        }
      } catch (err) {
        console.error("Erreur autocomplétion :", err);
      }
    };

    const delayDebounce = setTimeout(() => {
      searchPseudos();
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [newFriendPseudo, token]);

  const handleAddFriend = async (pseudoToSubmit: string) => {
    if (!token) return;

    let res: Response;
    try {
      res = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/me/friends`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pseudo: pseudoToSubmit.trim() }),
      });
    } catch {
      throw new Error("NETWORK_ERROR");
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "UNKNOWN_ERROR");
    }
  };

  const handleRemoveFriend = async (pseudo: string) => {
    if (!token) return;

    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/users/me/friends/${encodeURIComponent(pseudo.trim())}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "UNKNOWN_ERROR");
      }


      await loadFriends();
    } catch (err) {
      console.error("Erreur lors de la suppression de l'ami :", err);
    }
  };

  const filteredFriends = friends.filter((friend) =>
    friend.pseudo.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return {
    friends: filteredFriends,
    hasTotalFriends: friends.length > 0,
    newFriendPseudo,
    setNewFriendPseudo,
    suggestions,
    setSuggestions,
    searchQuery,
    setSearchQuery,
    handleAddFriend,
    handleRemoveFriend, 
    loadFriends,
  };
}
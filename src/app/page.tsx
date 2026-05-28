"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import HomeComponant from "../features/auth/components/Home";

export default function Home() {
  const router = useRouter();
  
  // 1. On crée un état pour savoir si le composant est monté côté client
  const [isMounted, setIsMounted] = useState(false);
  
  const user = useSelector((state: any) => state.user);

  // 2. Ce useEffect s'exécute UNIQUEMENT sur le client après le premier rendu
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 3. Ce useEffect gère la redirection si l'utilisateur est connecté
  useEffect(() => {
    if (isMounted && user && user.token) {
      router.push("/collection");
    }
  }, [user, router, isMounted]);

  // 4. Pendant que le serveur génère la page ou avant que le client ne soit prêt,
  // on affiche un état neutre (ou une version vide) pour éviter le mismatch
  if (!isMounted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-simpson-dark">
        <p className="text-xl font-bold animate-pulse text-yellow-400">
          Chargement de Springfield...
        </p>
      </div>
    );
  }

  // 5. Si le composant est monté et que le token est présent, on affiche aussi le chargement
  // le temps que la redirection de Next.js s'effectue
  if (user && user.token) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-simpson-dark">
        <p className="text-xl font-bold animate-pulse text-yellow-400">
          Redirection vers la collection...
        </p>
      </div>
    );
  }

  // 6. Sinon, l'utilisateur n'est pas connecté, on montre le formulaire
  return <HomeComponant />;
}
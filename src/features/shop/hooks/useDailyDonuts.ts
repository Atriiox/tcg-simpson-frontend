"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMoney } from "./useMoney";
import { setAuth } from "@/reducers/user"; // Import de ton action Redux
import { env } from "@/config/env";

export const useDailyDonuts = (onSuccessCallback?: () => void) => {
  const dispatch = useDispatch();
  const { money: userDonuts, updateMoney } = useMoney();
  
  const user = useSelector((state: any) => state.user);
  const countdownEnds = user.countdownEnds;

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Gestion du compte à rebours basé sur la valeur du Store Redux
  useEffect(() => {
    if (!countdownEnds) {
      setIsReady(true);
      setTimeLeft(0);
      return;
    }

    const calculateTimeLeft = () => {
      const targetTime = new Date(countdownEnds).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft(0);
        setIsReady(true);
        return true;
      } else {
        setTimeLeft(difference);
        setIsReady(false);
        return false;
      }
    };

    const isFinished = calculateTimeLeft();
    if (isFinished) return;

    const interval = setInterval(() => {
      const finished = calculateTimeLeft();
      if (finished) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [countdownEnds]);

  const getFormattedTime = (): string => {
    if (timeLeft <= 0) return "00:00:00";
    const seconds = Math.floor((timeLeft / 1000) % 60);
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0"),
    ].join(":");
  };

 const claimDailyDonuts = async () => {
    if (!isReady || isClaiming) return;

    setIsClaiming(true);
    const newBalance = userDonuts + 100;
    const twelveHoursFromNow = new Date(new Date().getTime() + 12 * 60 * 60 * 1000).toISOString();
    const token = localStorage.getItem("token") || user.token;

    try {
  
      const moneyResult = await updateMoney(newBalance);
      
      if (!moneyResult.ok) {
        alert("Erreur lors de la mise à jour des donuts.");
        setIsClaiming(false);
        return;
      }

     const targetUrl = `${env.NEXT_PUBLIC_API_URL}/users/me/countdownends`; 
      console.log("Appel API Update Countdown (PUT) :", targetUrl);

      const res = await fetch(targetUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ countdownends: twelveHoursFromNow }),
      });

      if (res.ok) {

        dispatch(
          setAuth({
            token: token,
            pseudo: user.pseudo,
            email: user.email,
            money: newBalance,
            countdownEnds: twelveHoursFromNow,
            theme: user.isDarkMode,
            avatar: user.avatar,
          })
        );

        if (onSuccessCallback) {
          onSuccessCallback();
        }
      } else {
        alert("Erreur lors de la mise à jour du compte à rebours sur le serveur.");
      }
    } catch (error) {
      console.error("Erreur globale lors du claim :", error);
    } finally {
      setIsClaiming(false);
    }
  };

  return {
    isReady: isMounted ? isReady : false,
    formattedTime: getFormattedTime(),
    isClaiming,
    claimDailyDonuts,
    isMounted,
  };
};
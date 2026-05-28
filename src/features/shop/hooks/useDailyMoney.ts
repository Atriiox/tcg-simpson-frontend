"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setAuth } from "@/reducers/user";
import { env } from "@/config/env";
import { DailyMoneyResponseSchema } from "../schemas/money.schema";

export const useDailyMoney = (onSuccessCallback?: () => void) => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const countdownEnds = user.countdownEnds;
  const token = user.token;

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => { setIsMounted(true); }, []);

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

    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/me/money/daily`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const parsed = DailyMoneyResponseSchema.safeParse(await res.json());
        if (!parsed.success) { setIsClaiming(false); return; }
        const data = parsed.data;
        dispatch(setAuth({
          token,
          pseudo: user.pseudo,
          email: user.email,
          avatar: user.avatar,
          money: data.money,
          countdownEnds: data.countdownEnds,
          theme: user.isDarkMode,
        }));
        onSuccessCallback?.();
      } else {
        console.error("Erreur lors du claim des donuts quotidiens");
      }
    } catch (error) {
      console.error("Erreur lors du claim :", error);
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
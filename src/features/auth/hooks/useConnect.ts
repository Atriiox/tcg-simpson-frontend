import type { ConnectFormValues } from "../schemas/connect.schema";
import { useDispatch } from "react-redux";
import { setAuth } from "@/reducers/user";
import { env } from "@/config/env";

export function useConnect() {
  const dispatch = useDispatch();

  const connect = async (values: ConnectFormValues) => {
    let res: Response;
    try {
      res = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    } catch {
      throw new Error("NETWORK_ERROR");
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    const { token, pseudo, money, theme } = data;
    dispatch(
      setAuth({
        token,
        pseudo,
        money,
        theme: typeof theme === "boolean" ? theme : false,
      }),
    );
  };

  return { connect };
}

import type { RegisterFormValues } from "../schemas/register.schema";
import { setAuth } from "@/reducers/user";
import { useDispatch } from "react-redux";
import { env } from "@/config/env";

export function useRegister() {
  const dispatch = useDispatch();

  const register = async (values: RegisterFormValues) => {
    let res: Response;
    try {
      res = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    } catch {
      throw new Error("NETWORK_ERROR");
    }

    const data = await res.json();
    console.log("data from register:", data);
    if (!res.ok) throw new Error(data.error);

    const { token, pseudo, email, money, theme, avatar } = data;
    dispatch(
      setAuth({
        token,
        pseudo,
        avatar: avatar || null,
        email: email || null,
        money,
        theme: typeof theme === "boolean" ? theme : false,
      }),
    );
  };

  return { register };
}

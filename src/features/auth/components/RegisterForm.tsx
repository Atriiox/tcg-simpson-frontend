// components/RegisterForm/RegisterForm.tsx
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { registerSchema, RegisterFormValues } from "../schemas/register.schema";
import { useRegister } from "../hooks/useRegister";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

const PSEUDO_MAX = 20;
const PASSWORD_MAX = 72;

interface Props {
  onSwitch: () => void;
}

export default function RegisterForm({ onSwitch }: Props) {
  const { register } = useRegister();
  const router = useRouter();

  const formik = useFormik<RegisterFormValues>({
    initialValues: { pseudo: "", email: "", password: "" },
    validationSchema: toFormikValidationSchema(registerSchema),
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
        await register(values);
        router.push("/collection?newUser=true");
      } catch (err) {
        if (err instanceof Error) {
          switch (err.message) {
            case "EMAIL_TAKEN":
              setFieldError("email", "Cet email est déjà utilisé");
              break;
            case "NETWORK_ERROR":
              setFieldError("email", "Erreur réseau, réessaie");
              break;
            default:
              setFieldError("email", "Une erreur est survenue");
          }
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="p-2 w-full md:w-sm m-auto" data-testid="register-form">
      <Image
        src="/poisson1.webp"
        alt="poisson authentification"
        width={100}
        height={100}
        className="mx-auto block mb-2"
      />

      <span className="text-title text-text mb-4 w-full flex justify-center">
        Créer un compte
      </span>

      {/* Pseudo */}
      <div className="flex flex-col gap-1.5 mb-1">
        <label htmlFor="pseudo" className="text-body font-medium text-text">
          Pseudo
        </label>
        <div
          className={`flex items-center border rounded-lg px-3 bg-white dark:bg-simpson-darklight ${
            formik.touched.pseudo && formik.errors.pseudo
              ? "border-red-500"
              : "border-gray-300 dark:border-simpson-dark"
          }`}
        >
          <input
            id="pseudo"
            type="text"
            placeholder="Entre ton pseudo"
            maxLength={PSEUDO_MAX}
            className="flex-1 border-none bg-transparent outline-none py-2.5 text-medium text-text placeholder-text/40"
            data-testid="register-pseudo-input"
            {...formik.getFieldProps("pseudo")}
          />
        </div>

        <div className="flex justify-start items-center gap-2 h-5 mt-0.5">
          <span
            className={`text-xs shrink-0 ${formik.values.pseudo.length >= PSEUDO_MAX ? "text-red-500" : "text-text/40"}`}
          >
            {formik.values.pseudo.length}/{PSEUDO_MAX}
          </span>
          {formik.touched.pseudo && formik.errors.pseudo && (
            <p
              className="text-red-500 text-xs truncate"
              data-testid="register-pseudo-error"
            >
              {formik.errors.pseudo}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5 mb-1">
        <label htmlFor="email" className="text-body font-medium text-text">
          Email
        </label>
        <div
          className={`flex items-center border rounded-lg px-3 bg-white dark:bg-simpson-darklight ${
            formik.touched.email && formik.errors.email
              ? "border-red-500"
              : "border-gray-300 dark:border-simpson-dark"
          }`}
        >
          <input
            id="email"
            type="text"
            placeholder="Entre ton email"
            maxLength={254}
            className="flex-1 border-none bg-transparent outline-none py-2.5 text-medium text-text placeholder-text/40"
            data-testid="register-email-input"
            {...formik.getFieldProps("email")}
          />
        </div>

        <div className="h-5 mt-0.5 flex items-center">
          {formik.touched.email && formik.errors.email && (
            <p
              className="text-red-500 text-xs truncate"
              data-testid="register-email-error"
            >
              {formik.errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5 mb-2">
        <label htmlFor="password" className="text-body font-medium text-text">
          Mot de passe
        </label>
        <div
          className={`flex items-center border rounded-lg px-3 bg-white dark:bg-simpson-darklight ${
            formik.touched.password && formik.errors.password
              ? "border-red-500"
              : "border-gray-300 dark:border-simpson-dark"
          }`}
        >
          <input
            id="password"
            type="password"
            placeholder="Entre ton mot de passe"
            maxLength={PASSWORD_MAX}
            className="flex-1 border-none bg-transparent outline-none py-2.5 text-medium text-text placeholder-text/40"
            data-testid="register-password-input"
            {...formik.getFieldProps("password")}
          />
        </div>

        <div className="flex justify-start items-center gap-2 h-5 mt-0.5">
          <span
            className={`text-xs shrink-0 ${formik.values.password.length >= PASSWORD_MAX ? "text-red-500" : "text-text/40"}`}
          >
            {formik.values.password.length}/{PASSWORD_MAX}
          </span>
          {formik.touched.password && formik.errors.password && (
            <p
              className="text-red-500 text-xs truncate"
              data-testid="register-password-error"
            >
              {formik.errors.password}
            </p>
          )}
        </div>
      </div>

      {/* Submit */}
      <Button
        onClick={() => formik.handleSubmit()}
        disabled={formik.isSubmitting}
        className="w-full py-2.5 mb-4"
        type="submit"
        data-testid="register-submit-button"
      >
        {formik.isSubmitting ? "Inscription..." : "S'inscrire"}
      </Button>

      {/* Switch */}
      <p className="text-center text-body text-text/60">
        Déjà un compte ?{" "}
        <button
          onClick={onSwitch}
          className="text-simpson-lightblue font-semibold hover:underline cursor-pointer"
          type="button"
          data-testid="register-switch-button"
        >
          Se connecter
        </button>
      </p>
    </div>
  );
}
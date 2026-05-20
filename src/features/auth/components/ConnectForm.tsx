import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { connectSchema, ConnectFormValues } from "../schemas/connect.schema";
import { useConnect } from "../hooks/useConnect";
import { useRouter } from 'next/navigation';
import Button from "@/components/ui/Button";
import Image from "next/image";

const PASSWORD_MAX = 72;

interface Props {
  onSwitch: () => void;
}

export default function SignIn({ onSwitch }: Props) {
  const { connect } = useConnect();
  const router = useRouter();

  const formik = useFormik<ConnectFormValues>({
    initialValues: { email: "", password: "" },
    validationSchema: toFormikValidationSchema(connectSchema),
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
                await connect(values);
                router.push('/collection');
      } catch (err) {
        if (err instanceof Error) {
          switch (err.message) {
            case "CREDENTIALS_UNKNOWN":
              setFieldError("email", "These credentials are unknown");
              break;
            case "WRONG_CREDENTIALS":
              setFieldError("email", "These credentials are unknown");
              break;
            default:
              setFieldError("email", "Something went wrong");
          }
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="p-2 max-w-xs w-full m-auto">
      <Image
        src="/poisson1.webp"
        alt="poisson authentification"
        width={100}
        height={100}
        className="mx-auto block mb-2"
      />

      <h2 className="text-title text-text mb-4 flex justify-center">Connexion</h2>

      {/* Email */}
      <div className="flex flex-col gap-1.5 mb-3">
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
            {...formik.getFieldProps("email")}
          />
        </div>
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-body mt-1">{formik.errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5 mb-4">
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
            {...formik.getFieldProps("password")}
          />
        </div>
        <div className="flex justify-start items-center gap-2">
          <span
            className={`text-xs ${formik.values.password.length >= PASSWORD_MAX ? "text-red-500" : "text-text/40"}`}
          >
            {formik.values.password.length}/{PASSWORD_MAX}
          </span>
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-body">{formik.errors.password}</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <Button
        onClick={() => formik.handleSubmit()}
        disabled={formik.isSubmitting}
        className="w-full py-2.5 mt-8 bg-simpson-orange text-white rounded-lg text-medium font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        {formik.isSubmitting ? "Connexion..." : "Se connecter"}
      </Button>

      {/* Switch */}
      <p className="text-center text-body text-text/60">
        Pas de compte ?{" "}
        <button
          onClick={onSwitch}
          className="text-simpson-lightblue font-semibold hover:underline cursor-pointer"
        >
          S'inscrire
        </button>
      </p>
    </div>
  );
}

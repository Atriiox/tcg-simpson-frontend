import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { connectSchema, ConnectFormValues } from '../schemas/connect.schema';
import { useConnect } from '../hooks/useConnect';
import Button from "@/components/ui/Button";

interface Props {
  onSwitch: () => void;
}


export default function SignIn({ onSwitch }: Props) {
const { connect } = useConnect();

  const formik = useFormik<ConnectFormValues>({
    initialValues: { email: '', password: '' },
    validationSchema: toFormikValidationSchema(connectSchema),
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
        const { token } = await connect(values);
        console.log('token:', token);
        // redirect ou stockage token ici
      } catch (err) {
        if (err instanceof Error) {
          switch (err.message) {
            case 'CREDENTIALS_UNKNOWN':
              setFieldError('email', 'These credentials are unknown');
              break;
            case 'WRONG_CREDENTIALS':
              setFieldError('email', 'These credentials are unknown');
              break;
            default:
              setFieldError('email', 'Something went wrong');
          }
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="p-8 w-full">

        {/* Email */}
        <div className="mb-5">
          <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1.5">
            Email
          </label>
          <div className={`flex items-center border rounded-lg px-3 bg-gray-50 ${
            formik.touched.email && formik.errors.email ? 'border-red-400' : 'border-gray-300'
          }`}>
            <input
              id="email"
              type="text"
              placeholder="Enter your Email"
              className="flex-1 border-none bg-transparent outline-none py-2.5 text-sm text-gray-900 placeholder-gray-400"
              {...formik.getFieldProps('email')}
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-5">
          <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-1.5">
            Password
          </label>
          <div className={`flex items-center border rounded-lg px-3 bg-gray-50 ${
            formik.touched.password && formik.errors.password ? 'border-red-400' : 'border-gray-300'
          }`}>
            <input
              id="password"
              type="password"
              placeholder="Enter your Password"
              className="flex-1 border-none bg-transparent outline-none py-2.5 text-sm text-gray-900 placeholder-gray-400"
              {...formik.getFieldProps('password')}
            />
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          onClick={() => formik.handleSubmit()}
          disabled={formik.isSubmitting}
          className="w-full py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {formik.isSubmitting ? 'Connexion...' : 'Se connecter'}
        </Button>
 <p className="text-center text-sm text-gray-500 mt-4">
          Pas de compte ?{' '}
          <button onClick={onSwitch} className="text-blue-600 font-medium hover:underline">
            S'inscrire
          </button>
        </p>
      </div>  );
}
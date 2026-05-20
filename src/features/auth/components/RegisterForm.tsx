import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { registerSchema, RegisterFormValues } from '../schemas/register.schema';
import { useRegister } from '../hooks/useRegister';

interface Props {
  onSwitch: () => void;
}

export default function RegisterForm({ onSwitch }: Props) {
  const { register } = useRegister();

  const formik = useFormik<RegisterFormValues>({
    initialValues: { pseudo: '', email: '', password: '' },
    validationSchema: toFormikValidationSchema(registerSchema),
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
        const { token } = await register(values);
        console.log('token:', token);
        // redirect ou stockage token ici
      } catch (err) {
        if (err instanceof Error) {
          switch (err.message) {
            case 'EMAIL_TAKEN':
              setFieldError('email', 'This email is already taken');
              break;
            case 'NETWORK_ERROR':
              setFieldError('email', 'Network error, please try again');
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
        {/* Pseudo */}
        <div className="mb-5">
          <label htmlFor="pseudo" className="block text-sm font-medium text-gray-800 mb-1.5">
            Pseudo
          </label>
          <div className={`flex items-center border rounded-lg px-3 bg-gray-50 ${
            formik.touched.pseudo && formik.errors.pseudo ? 'border-red-400' : 'border-gray-300'
          }`}>
            <input
              id="pseudo"
              type="text"
              placeholder="Enter your pseudo"
              className="flex-1 border-none bg-transparent outline-none py-2.5 text-sm text-gray-900 placeholder-gray-400"
              {...formik.getFieldProps('pseudo')}
            />
          </div>
          {formik.touched.pseudo && formik.errors.pseudo && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.pseudo}</p>
          )}
        </div>

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
        <button
          onClick={() => formik.handleSubmit()}
          disabled={formik.isSubmitting}
          className="w-full py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {formik.isSubmitting ? 'Signing up...' : 'Sign Up'}
        </button>
 <p className="text-center text-sm text-gray-500 mt-4">
          Déjà un compte ?{' '}
          <button onClick={onSwitch} className="text-blue-600 font-medium hover:underline">
            Se connecter
          </button>
        </p>
      </div>  );
}
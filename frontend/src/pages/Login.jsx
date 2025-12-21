import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { apiRequest } from '../api'
import toast from 'react-hot-toast'
const CardShell = ({ children }) => (
  <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center px-2 sm:px-4 lg:px-8"><div className="grid w-full max-w-4xl gap-4 sm:gap-6 lg:gap-8 rounded-2xl sm:rounded-3xl bg-slate-950/30 p-3 sm:p-4 lg:p-6 text-slate-50 shadow-2xl shadow-slate-900/60 ring-1 ring-white/15 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
  {children}
</div>
 </div>)

const FloatingInput = ({ field, form: { touched, errors }, ...props }) => {

const hasError = touched[field.name] && errors[field.name]

const hasValue = field.value && field.value.length > 0

return (

<div className="space-y-1">

  <div

    className={`relative rounded-2xl border bg-white/5 px-4 py-3 text-left shadow-sm transition-all duration-200 ${

      hasError 

        ? 'border-red-400/50 ring-1 ring-red-200/30' 

        : 'border-white/10 focus-within:border-teal-300/70 focus-within:ring-1 focus-within:ring-teal-300/30 hover:border-white/20'

    }`}

  >

    <label

      htmlFor={field.name}

      className={`pointer-events-none absolute left-4 text-[11px] text-slate-400 transition-all ${

        hasValue || field.value

          ? 'top-2 translate-y-0 text-[10px]'

          : 'top-1/2 -translate-y-1/2 text-[13px]'

      }`}

    >

      {props.label}

    </label>

    <input

      {...field}

      {...props}

      id={field.name}

      className="mt-3 w-full border-0 bg-transparent p-0 text-sm text-white outline-none placeholder:text-transparent placeholder:text-sm"

    />

  </div>

  <ErrorMessage name={field.name}>

    {msg => <p className="text-xs text-red-400 mt-1">{msg}</p>}

  </ErrorMessage>

</div>

)

}

const SocialButton = ({ provider, onClick }) => {

const isGoogle = provider === 'Google'

return (

<button

  type="button"

  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"

  onClick={onClick}

>

  <span

    className={`flex h-4 w-4 items-center justify-center rounded-sm text-[10px] ${

      isGoogle ? 'bg-slate-100' : 'bg-slate-900 text-slate-50'

    }`}

  >

    {isGoogle ? 'G' : ''}

  </span>

  <span>{provider}</span>

</button>

)

}

const LoginPage = ({ onNavigateSignup, onNavigateLanding, onLoginSuccess }) => {

const [formError, setFormError] = useState('')

const navigate = useNavigate()

const initialValues = {

email: "",

password: "",

rememberMe: false,

};

const loginSchema = Yup.object().shape({

email: Yup.string().email("Invalid email").required("Email is required"),

  password: Yup.string()

    .min(6, "Password Cannot be less than 6 characters")

    .required("Password is required"),

});



const formik = useFormik({

  initialValues: initialValues,

  validationSchema: loginSchema,

  onSubmit: async (values) => {

    try {

      console.log('Submitting login form with values:', values);

      const data = {

        email: values?.email,

        password: values?.password

      }

      console.log('Making API request to users/login with data:', data);

      const response = await apiRequest('POST', 'users/login', data);

      console.log('Login API response received:', response);

      if (response?.data) {

        // Session cookie is automatically set by the server

        toast.success(response?.data.message || 'Login successful!');

        formik.resetForm();

        

        // Navigate based on user role after a short delay

        setTimeout(() => {

          // Check if user is admin and navigate accordingly

          const userRole = response?.data?.user?.role;

          if (userRole === 'admin') {

            navigate('/admin');

          } else {

            navigate('/dashboard');

          }

        }, 1000);

      }

    } catch (error) {
  console.error('Login error:', error);

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    'Login failed';

  toast.error(errorMessage);
    }

  },

});

async function continueWithGoogle() {

window.location.href = `${import.meta.env.PROD ? 'https://expense-tracker-production-72a7.up.railway.app/' : 'http://localhost:4000'}/api/users/auth/google`;

}

return (

<CardShell>

  <div className="space-y-3 sm:space-y-4">

    <button

      type="button"

      className="mb-2 inline-flex items-center gap-1 text-xs sm:text-sm text-slate-300 hover:text-white transition-colors"

      onClick={onNavigateLanding}

    >

      <span>←</span>

      Back to home

    </button>

    <div className="space-y-1">

      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Welcome back</h2>

      <p className="text-xs sm:text-sm text-slate-300">

        Log in to view your latest insights, budgets, and AI predictions.

      </p>

    </div>

    <div className="mt-3 rounded-2xl bg-slate-950/50 p-4 ring-1 ring-white/10">

      <p className="text-xs font-medium text-slate-200">Today&apos;s snapshot</p>

      <p className="mt-1 text-2xl font-semibold text-emerald-400">₹3,450 under budget</p>

      <p className="mt-1 text-[11px] text-slate-400">

        Keep this streak going — your next month looks healthy based on current trends.

      </p>

    </div>

  </div>



  <div className="flex items-center justify-center px-1 sm:px-2">

    <div className="w-full max-w-sm sm:max-w-md rounded-2xl bg-white/95 p-3 sm:p-4 lg:p-5 text-slate-900 shadow-xl shadow-slate-900/30 ring-1 ring-slate-200">

      {formError && (

        <div className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600 ring-1 ring-red-200">

          {formError}

        </div>

      )}



      <h3 className="mb-2 text-base sm:text-lg font-semibold tracking-tight text-slate-900">Login</h3>

      <p className="mb-2 sm:mb-3 text-xs text-slate-500">Enter your credentials or continue with Google.</p>



      <form className="space-y-3 sm:space-y-4" onSubmit={formik.handleSubmit} noValidate>

        <div className="space-y-4">

          <div className="space-y-1">

            <label htmlFor="email" className="block text-xs text-slate-400">Email address</label>

            <input

              id="email"

              name="email"

              type="email"

              className="mt-1 w-full rounded-xl border border-slate-300 bg-white/10 px-4 py-2 text-sm text-slate-900 focus:border-teal-400 focus:ring-2 focus:ring-teal-200"

              onChange={formik.handleChange}

              onBlur={formik.handleBlur}

              value={formik.values.email}

              autoComplete="email"

            />

            {formik.touched.email && formik.errors.email && (

              <p className="text-xs text-red-400 mt-1">{formik.errors.email}</p>

            )}

          </div>

          <div className="space-y-1">

            <label htmlFor="password" className="block text-xs text-slate-400">Password</label>

            <input

              id="password"

              name="password"

              type="password"

              className="mt-1 w-full rounded-xl border border-slate-300 bg-white/10 px-4 py-2 text-sm text-slate-900 focus:border-teal-400 focus:ring-2 focus:ring-teal-200"

              onChange={formik.handleChange}

              onBlur={formik.handleBlur}

              value={formik.values.password}

              autoComplete="current-password"

            />

            {formik.touched.password && formik.errors.password && (

              <p className="text-xs text-red-400 mt-1">{formik.errors.password}</p>

            )}

          </div>

          <div className="flex items-center justify-between pt-1">

            <div className="flex items-center">

              <input

                id="rememberMe"

                name="rememberMe"

                type="checkbox"

                className="h-4 w-4 rounded border-slate-300/50 bg-slate-800/50 text-teal-400 focus:ring-teal-400"

                onChange={formik.handleChange}

                checked={formik.values.rememberMe}

              />

              <label htmlFor="rememberMe" className="ml-2 block text-xs text-slate-300">Remember me</label>

            </div>

            <Link

              to="/forgot-password"

              className="text-xs font-medium text-teal-400 hover:text-teal-300 transition-colors"

            >

              Forgot password?

            </Link>

          </div>

          <div className="pt-2">

            <button

              type="submit"

              disabled={formik.isSubmitting}

              className="w-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-teal-500/20 transition-all hover:shadow-xl hover:shadow-teal-500/30 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-70 disabled:cursor-not-allowed"

            >

              {formik.isSubmitting ? 'Signing in...' : 'Sign in'}

            </button>

          </div>

          {formError && (

            <div className="rounded-xl bg-red-500/10 p-3 text-center">

              <p className="text-xs font-medium text-red-300">{formError}</p>

            </div>

          )}

          <div className="relative mt-6">

            <div className="absolute inset-0 flex items-center" aria-hidden="true">

              <div className="w-full border-t border-white/10" />

            </div>

            <div className="relative flex justify-center text-sm font-medium leading-6">

              <span className="bg-slate-900/80 px-2 text-xs text-slate-400">Or continue with</span>

            </div>

          </div>

          <div className="mt-4">

            <SocialButton provider="Google" onClick={continueWithGoogle} />

          </div>

          <p className="mt-6 text-center text-sm text-slate-400">

            Don&apos;t have an account?{' '}

           <Link to="/signup">

              <button

                type="button"

                onClick={onNavigateSignup}

                className="font-semibold text-teal-400 hover:text-teal-300 transition-colors"

              >

                Sign up

              </button>

            </Link>

          </p>

          <p className="mt-2 text-center text-sm text-slate-400">

            <Link

              to="/forgot-password"

              className="font-semibold text-blue-400 hover:text-blue-300 transition-colors"

            >

              Forgot your password?

            </Link>

          </p>

        </div>

      </form>

    </div>

  </div>

</CardShell>

)

}

export default LoginPage


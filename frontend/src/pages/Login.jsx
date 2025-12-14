import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate, Link } from 'react-router-dom'
import { apiRequest } from '../api'
import toast from 'react-hot-toast'
import { ErrorMessage } from 'formik'

const CardShell = ({ children }) => (
  <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center px-2 sm:px-4 lg:px-8">
    <div className="grid w-full max-w-4xl gap-4 sm:gap-6 lg:gap-8 rounded-2xl sm:rounded-3xl bg-slate-950/30 p-3 sm:p-4 lg:p-6 text-slate-50 shadow-2xl shadow-slate-900/60 ring-1 ring-white/15 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      {children}
    </div>
  </div>
)

const FloatingInput = ({ field, form: { touched, errors }, ...props }) => {
  const hasError = touched[field.name] && errors[field.name]
  const hasValue = field.value && field.value.length > 0

  return (
    <div className="space-y-1">
      <div
        className={`relative rounded-2xl border bg-white/5 px-4 py-3 transition-all ${
          hasError
            ? 'border-red-400/50 ring-1 ring-red-200/30'
            : 'border-white/10 focus-within:border-teal-300/70 focus-within:ring-1 focus-within:ring-teal-300/30'
        }`}
      >
        <label
          htmlFor={field.name}
          className={`pointer-events-none absolute left-4 text-[11px] text-slate-400 transition-all ${
            hasValue ? 'top-2 text-[10px]' : 'top-1/2 -translate-y-1/2 text-[13px]'
          }`}
        >
          {props.label}
        </label>
        <input
          {...field}
          {...props}
          id={field.name}
          className="mt-3 w-full bg-transparent text-sm text-white outline-none"
        />
      </div>

      <ErrorMessage name={field.name}>
        {(msg) => <p className="text-xs text-red-400 mt-1">{msg}</p>}
      </ErrorMessage>
    </div>
  )
}

const SocialButton = ({ provider, onClick }) => (
  <button
    type="button"
    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
    onClick={onClick}
  >
    <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-slate-100 text-[10px]">
      G
    </span>
    <span>{provider}</span>
  </button>
)

const LoginPage = ({ onNavigateSignup, onNavigateLanding }) => {
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string()
        .min(6, 'Password cannot be less than 6 characters')
        .required('Password is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await apiRequest('POST', 'users/login', {
          email: values.email,
          password: values.password,
        })

        toast.success(response?.data?.message || 'Login successful!')
        resetForm()

        setTimeout(() => {
          const role = response?.data?.user?.role
          navigate(role === 'admin' ? '/admin' : '/dashboard')
        }, 1000)
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          'Login failed'

        toast.error(message)
      }
    },
  })

  const continueWithGoogle = () => {
    window.location.href = `${
      import.meta.env.PROD
        ? 'https://expense-tracker-production-2bb8.up.railway.app'
        : 'http://localhost:4000'
    }/api/users/auth/google`
  }

  return (
    <CardShell>
      <div>
        <button onClick={onNavigateLanding} className="text-sm text-slate-300">
          ← Back to home
        </button>
      </div>

      <div className="bg-white p-5 rounded-2xl">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="w-full border p-2 rounded"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-xs text-red-500">{formik.errors.email}</p>
          )}

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className="w-full border p-2 rounded"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-xs text-red-500">{formik.errors.password}</p>
          )}

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-teal-500 text-white py-2 rounded"
          >
            {formik.isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>

          <SocialButton provider="Google" onClick={continueWithGoogle} />

          <p className="text-center text-sm">
            Don’t have an account?{' '}
            <Link to="/signup" onClick={onNavigateSignup} className="text-teal-500">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </CardShell>
  )
}

export default LoginPage

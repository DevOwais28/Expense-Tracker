import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../api'
import toast from 'react-hot-toast'

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
        className={`relative rounded-2xl border bg-white/5 px-4 py-3 text-left shadow-sm transition-all duration-200 ${
          hasError
            ? 'border-red-400/50 ring-1 ring-red-200/30'
            : 'border-white/10 focus-within:border-teal-300/70 focus-within:ring-1 focus-within:ring-teal-300/30 hover:border-white/20'
        }`}
      >
        <label
          htmlFor={field.name}
          className={`pointer-events-none absolute left-4 text-[11px] text-slate-400 transition-all ${
            hasValue
              ? 'top-2 translate-y-0 text-[10px]'
              : 'top-1/2 -translate-y-1/2 text-[13px]'
          }`}
        >
          {props.label}
        </label>

        {/* ✅ FIXED TEXT COLOR HERE */}
        <input
          {...field}
          {...props}
          id={field.name}
          className="
            mt-3 w-full border-0 bg-transparent p-0
            text-sm text-slate-900 outline-none
            placeholder:text-transparent placeholder:text-sm
          "
        />
      </div>

      <ErrorMessage name={field.name}>
        {msg => <p className="mt-1 text-xs text-red-400">{msg}</p>}
      </ErrorMessage>
    </div>
  )
}

const SocialButton = ({ provider, onClick }) => {
  const isGoogle = provider === 'Google'

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
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

const SignupPage = ({ onNavigateLogin, onNavigateLanding }) => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  }

  const signupSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
  })

  async function continueWithGoogle() {
    window.location.href = `${
      import.meta.env.PROD
        ? 'https://expense-tracker-production-d7b0.up.railway.app'
        : 'http://localhost:4000'
    }/api/users/auth/google`
  }

  return (
    <CardShell>
      <div className="space-y-3 sm:space-y-4">
        <button
          type="button"
          className="mb-2 inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white"
          onClick={onNavigateLanding}
        >
          ← Back to home
        </button>

        <h2 className="text-xl font-bold text-white">Create an account</h2>
        <p className="text-xs text-slate-300">
          Get started with your free trial.
        </p>
      </div>

      <div className="flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl">
          <Formik
            initialValues={initialValues}
            validationSchema={signupSchema}
            onSubmit={async values => {
              setLoading(true)
              try {
                const res = await apiRequest('POST', 'users/signup', values)
                toast.success(res.data.message)
                setTimeout(() => navigate('/login'), 1200)
              } catch (err) {
                toast.error(err.message || 'Signup failed')
              } finally {
                setLoading(false)
              }
            }}
          >
            {() => (
              <Form className="space-y-3">
                <Field name="name" label="Name" component={FloatingInput} />
                <Field name="email" label="Email" component={FloatingInput} />
                <Field name="password" type="password" label="Password" component={FloatingInput} />
                <Field name="confirmPassword" type="password" label="Confirm Password" component={FloatingInput} />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </Form>
            )}
          </Formik>

          <div className="my-4 flex items-center gap-2 text-xs text-slate-400">
            <div className="h-px flex-1 bg-slate-200" />
            Or continue with
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <SocialButton provider="Google" onClick={continueWithGoogle} />

          <p className="mt-4 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <button onClick={onNavigateLogin} className="font-medium text-indigo-600">
              Login
            </button>
          </p>
        </div>
      </div>
    </CardShell>
  )
}

export default SignupPage




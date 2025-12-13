import { Formik, Form, Field, ErrorMessage,useFormik } from 'formik'
import * as Yup from 'yup'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../api'
import toast from 'react-hot-toast'

const CardShell = ({ children }) => (
  <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center px-4 sm:px-6 lg:px-8">
    <div className="grid w-full max-w-4xl gap-6 sm:gap-8 rounded-2xl sm:rounded-3xl bg-slate-950/30 p-4 sm:p-5 lg:p-8 text-slate-50 shadow-2xl shadow-slate-900/60 ring-1 ring-white/15 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
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
  const isGoogle = provider === "Google";

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-sm text-[10px] ${
          isGoogle ? "bg-slate-100" : "bg-slate-900 text-slate-50"
        }`}
      >
        {isGoogle ? "G" : ""}
      </span>
      <span>{provider}</span>
    </button>
  );
};


const SignupPage = ({ onNavigateLogin, onNavigateLanding }) => {
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
    const initialValues = {
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  };
  const signupSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password Cannot be less than 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  // Remove the useFormik hook since we're using Formik component
  async function continueWithGoogle() {
    window.location.href = `${import.meta.env.VITE_API_URL || 'https://expense-tracker-production-2bb8.up.railway.app'}/api/users/auth/google`;
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
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Create an account</h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Get started with your 14-day free trial. No credit card required.
          </p>
        </div>
        <ul className="mt-2 space-y-1 text-xs text-slate-300/90">
          <li className="flex items-start gap-2">
            <span className="h-4 w-4 rounded-full bg-emerald-500/80 text-[10px] font-semibold text-slate-900 flex items-center justify-center flex-shrink-0 mt-0.5">
              ✓
            </span>
            <span className="text-xs sm:text-xs">Smart categorization of every expense</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="h-4 w-4 rounded-full bg-emerald-500/80 text-[10px] font-semibold text-slate-900 flex items-center justify-center flex-shrink-0 mt-0.5">
              ✓
            </span>
            <span className="text-xs sm:text-xs">AI-powered forecast for next month</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="h-4 w-4 rounded-full bg-emerald-500/80 text-[10px] font-semibold text-slate-900 flex items-center justify-center flex-shrink-0 mt-0.5">
              ✓
            </span>
            <span className="text-xs sm:text-xs">Secure, private, and encrypted by default</span>
          </li>
        </ul>
      </div>

      <div className="flex items-center justify-center px-2">
        <div className="w-full max-w-md rounded-2xl bg-white/95 p-4 sm:p-5 text-slate-900 shadow-xl shadow-slate-900/30 ring-1 ring-slate-200">
          {formError && (
            <div className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600 ring-1 ring-red-200">
              {formError}
            </div>
          )}

          <h3 className="mb-1 text-lg sm:text-lg font-semibold tracking-tight text-slate-900">Sign up</h3>
          <p className="mb-3 sm:mb-4 text-xs text-slate-500">Enter your details or continue with Google/Apple.</p>

          <Formik
            initialValues={initialValues}
            validationSchema={signupSchema}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                console.log('Submitting signup form with values:', values);
                const data = {
                  email: values?.email,
                  password: values?.password,
                  name: values?.name
                }
                console.log('Making API request to users/signup with data:', data);
                const response = await apiRequest('POST', 'users/signup', data);
                console.log('API response received:', response);
                
                // Show success message
                toast.success(response?.data?.message || 'Account created successfully!');
                
                // Navigate to login after a short delay
                setTimeout(() => {
                  navigate('/login');
                }, 1500);
                
              } catch (error) {
                console.error('Signup error:', error);
                // Show error message
                toast.error(error.message || 'Failed to create account');
              } finally {
                setLoading(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-3" noValidate>
                <Field name="name" type="text" label="Name" component={FloatingInput} />
                <Field name="email" type="email" label="Email" component={FloatingInput} />
                <Field name="password" type="password" label="Password" component={FloatingInput} />
                <Field name="confirmPassword" type="password" label="Confirm password" component={FloatingInput} />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-1 w-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-700/40 transition hover:translate-y-px hover:shadow-lg hover:shadow-indigo-700/60 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Create Account'}
                </button>
              </Form>
            )}
          </Formik>
            <div className="my-4 flex items-center gap-2 text-[11px] text-slate-400">
            <div className="h-px flex-1 bg-slate-200" />
            <span>Or continue with</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="mt-4">
            <SocialButton provider="Google" onClick={()=>continueWithGoogle()}/>
          </div>

          <p className="mt-3 sm:mt-4 text-center text-[11px] text-slate-500">
            Already have an account?{' '}
            <button
              type="button"
              className="font-medium text-indigo-600 hover:text-indigo-700"
              onClick={onNavigateLogin}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </CardShell>
  )
}

export default SignupPage


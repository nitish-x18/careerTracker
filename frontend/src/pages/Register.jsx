import {
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  ShieldCheck,
  User,
  Check,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!form.terms) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    try {
      setIsSubmitting(true);

      await registerUser(form.name, form.email, form.password);

      setSuccess("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1000);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7ff] px-4 py-5 text-slate-900">
      <div className="fixed left-0 top-0 h-1 w-full bg-blue-600" />

      <div className="mx-auto flex min-h-[calc(100vh-40px)] w-full max-w-[560px] flex-col">
        <div className="my-auto">
          <div className="rounded-2xl bg-white px-7 py-8 shadow-sm ring-1 ring-slate-200 sm:px-9">
            {/* Logo */}
            <div className="mb-6 flex items-center justify-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <ArrowRight
                  size={25}
                  strokeWidth={2.5}
                  className="-rotate-45"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[23px] font-bold tracking-tight">
                  Career<span className="text-indigo-600">Track</span>
                </span>

                <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold tracking-wide text-indigo-600">
                  BETA
                </span>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-7 text-center">
              <h1 className="text-[29px] font-bold tracking-tight text-slate-900">
                Create your account
              </h1>

              <p className="mx-auto mt-2 max-w-sm text-[15px] leading-6 text-slate-500">
                Start managing your applications and internships
                systematically.
              </p>
            </div>

            {/* Social buttons */}
            <div className="space-y-3">
              <button
                type="button"
                disabled
                title="Google registration is not available yet"
                className="flex h-11 w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-slate-100 bg-white text-sm font-medium text-slate-700 shadow-sm opacity-80"
              >
                <span className="text-lg font-bold text-blue-600">G</span>
                Continue with Google
              </button>

              <button
                type="button"
                disabled
                title="Institution registration is not available yet"
                className="flex h-11 w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-slate-100 bg-white text-sm font-medium text-slate-700 shadow-sm opacity-80"
              >
                <GraduationCap size={19} className="text-sky-600" />
                Sign up with .edu institution
              </button>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />

              <span className="text-xs font-bold tracking-wide text-slate-400">
                OR MANUAL REGISTRATION
              </span>

              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full name */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-slate-800"
                  >
                    Full Name
                  </label>

                  <span className="text-sm text-slate-400">
                    Candidate
                  </span>
                </div>

                <div className="relative">
                  <User
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Alex Morgan"
                    autoComplete="name"
                    className="h-11 w-full rounded-xl bg-indigo-50 pl-11 pr-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-slate-800"
                  >
                    Email Address
                  </label>

                  <span className="text-sm font-medium text-sky-600">
                    Auto-detects university
                  </span>
                </div>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="alex.morgan@university.edu"
                    autoComplete="email"
                    className="h-11 w-full rounded-xl bg-indigo-50 pl-11 pr-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-800"
                  >
                    Password
                  </label>

                  <span className="font-mono text-sm text-slate-400">
                    Min 8 characters
                  </span>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="h-11 w-full rounded-xl bg-indigo-50 pl-11 pr-11 text-sm text-slate-800 outline-none placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-200"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>

                {/* Password strength visual */}
                <div className="mt-2 flex gap-2">
                  <div className="h-1 flex-1 rounded-full bg-indigo-100" />
                  <div className="h-1 flex-1 rounded-full bg-indigo-100" />
                  <div className="h-1 flex-1 rounded-full bg-indigo-100" />
                  <div className="h-1 flex-1 rounded-full bg-indigo-100" />
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <ShieldCheck
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="h-11 w-full rounded-xl bg-indigo-50 pl-11 pr-11 text-sm text-slate-800 outline-none placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-200"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-5 text-slate-600">
                <input
                  type="checkbox"
                  name="terms"
                  checked={form.terms}
                  onChange={handleChange}
                  className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 accent-indigo-600"
                />

                <span>
                  I agree to CareerTrack's{" "}
                  <button
                    type="button"
                    onClick={() =>
                      setError("Terms of Service page is not available yet.")
                    }
                    className="font-medium text-indigo-600 underline"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onClick={() =>
                      setError("Privacy Policy page is not available yet.")
                    }
                    className="font-medium text-indigo-600 underline"
                  >
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>

              {/* Create account */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}

                {!isSubmitting && <ArrowRight size={18} />}
              </button>
            </form>

            {/* Login */}
            <div className="-mx-7 mt-7 border-t bg-indigo-50 px-7 py-4 text-center sm:-mx-9 sm:px-9">
              <span className="text-sm text-slate-600">
                Already have an account?{" "}
              </span>

              <Link
                to="/login"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Log in ↗
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs font-medium text-slate-400">
            <span className="flex items-center gap-1.5">
              <Check size={13} />
              Encrypted & Private
            </span>

            <span>•</span>

            <span>⚡ Linear-speed Kanban</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
import {
  ArrowRight,
  ArrowUpRight,
  Eye,
  EyeOff,
  Info,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDemoAccount = () => {
    setForm((prev) => ({
      ...prev,
      email: "demo@careertrack.app",
      password: "",
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setIsSubmitting(true);

      await loginUser(form.email, form.password);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7ff] px-4 py-5 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-40px)] w-full max-w-[520px] flex-col">
        {/* Top blue line */}
        <div className="fixed left-0 top-0 h-1 w-full bg-blue-600" />

        {/* Login card */}
        <div className="my-auto">
          <div className="rounded-2xl bg-white px-7 py-8 shadow-sm ring-1 ring-slate-200 sm:px-9">
            {/* Logo */}
            <div className="mb-7 flex items-center justify-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <ArrowUpRight size={25} strokeWidth={2.5} />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[23px] font-bold tracking-tight">
                  CareerTrack
                </span>

                <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600">
                  V2.4
                </span>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-7 text-center">
              <h1 className="text-[29px] font-bold tracking-tight text-slate-900">
                Welcome back
              </h1>

              <p className="mx-auto mt-2 max-w-sm text-[15px] leading-5 text-slate-500">
                Enter your credentials to access your application pipeline.
              </p>
            </div>

            

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Email address
                </label>

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
                    placeholder="student@university.edu"
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

                  <button
                    type="button"
                    onClick={() =>
                      setError("Forgot password is not available yet.")
                    }
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Forgot password?
                  </button>
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
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="h-11 w-full rounded-xl bg-indigo-50 pl-11 pr-11 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-200"
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
              </div>

              {/* Remember me */}
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                  className="h-5 w-5 rounded border-slate-300 accent-indigo-600"
                />

                <span>Remember me for 30 days</span>
              </label>

              {/* Login */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Logging in..." : "Log In"}

                {!isSubmitting && <ArrowRight size={18} />}
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-sm text-slate-400">OR</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Google */}
            <button
              type="button"
              disabled
              title="Google login is not available yet"
              className="flex h-11 w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl bg-indigo-50 text-sm font-medium text-slate-800 opacity-90"
            >
              <span className="text-lg font-bold text-blue-600">G</span>
              Continue with Google
            </button>

            {/* Register */}
            <p className="mt-7 text-center text-sm text-slate-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between px-2 text-xs font-medium text-slate-400">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sky-400" />
              All systems operational
            </span>

            <span className="flex items-center gap-3">
              <span>Privacy</span>
              <span>·</span>
              <span>Terms</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
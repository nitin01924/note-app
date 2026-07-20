import { useState } from "react";
import { loginWithGoogle, registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Mail, NotebookPen, UserRound } from "lucide-react";
import Button from "../components/Button";
import Input from "../components/Input";
import { toast } from "react-toastify";
import GoogleLoginButton from "../components/GoogleLoginButton";

function Register({ onAuthSuccess }) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      if (!name || !email || !password) {
        toast.error("Please fill all fields");
        return;
      }
      if (password.length < 8) {
        toast.error("Password must be at least 8 characters long");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      const res = await registerUser({ name, email, password });

      if (res) {
        toast.success("User registered");
        setTimeout(() => {
          toast.success("Check your email to verify");
        }, 1200);
      }

      onAuthSuccess(res.token);
      navigate("/notes");
    } catch (error) {
      toast.error(error.message || "Unable to register");

      if (error.message?.includes("User already exists")) {
        toast.error("Try to login instead.");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async (credential) => {
    try {
      setLoading(true);

      // The shared Google endpoint creates a first-time user and logs in an
      // existing one, then returns the same JWT used by local authentication.
      const res = await loginWithGoogle(credential);
      onAuthSuccess(res.token);
      navigate("/notes");
    } catch (error) {
      toast.error(error.message || "Unable to continue with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell flex min-h-screen items-center justify-center px-4 py-10 text-slate-950 dark:text-white">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-slate-200 bg-white/78 shadow-2xl shadow-slate-200/60 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/76 dark:shadow-black/30 lg:grid-cols-[0.9fr_1fr]">
        <div className="p-6 sm:p-10">
          <div className="mb-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-600 text-white">
              <NotebookPen size={24} />
            </div>
            <h2 className="text-2xl font-bold">Create account</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Start a clean note workspace in a minute.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              icon={UserRound}
            />

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon={Mail}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              showToggle
            />
            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setconfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              showToggle
            />

            <Button type="submit" loading={loading} icon={ArrowRight} className="w-full">
              Register
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            or
            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>

          <GoogleLoginButton
            onCredential={handleGoogleRegister}
            disabled={loading}
          />

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="focus-ring rounded-md font-semibold text-cyan-700 hover:text-cyan-900 dark:text-cyan-300 dark:hover:text-cyan-200"
            >
              Login
            </button>
          </p>
        </div>

        <div className="hidden flex-col justify-between bg-slate-950 p-10 text-white lg:flex">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
              Simple, focused, private
            </p>
            <h1 className="mt-4 max-w-sm text-4xl font-bold tracking-tight">
              Turn quick thoughts into an organized collection.
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
              Create, edit, search, and keep notes ready whenever you need
              them.
            </p>
          </div>

          <div className="grid gap-3">
            {["Fast capture", "Live search", "Clean dark mode"].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
export default Register;

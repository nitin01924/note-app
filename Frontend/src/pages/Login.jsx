import { useState } from "react";
import { loginUser, resendVerification } from "../services/api";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Mail, NotebookPen, ShieldCheck } from "lucide-react";
import Button from "../components/Button";
import Input from "../components/Input";
import { toast } from "react-toastify";

function Login({ onAuthSuccess }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);

  const handleResend = async () => {
    try {
      const res = await resendVerification(email);
      toast.success(res.message);
    } catch {
      toast.error("Failed to resend email");
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      setShowResend(false);

      if (!email || !password) {
        toast.error("Please fill the fields first");
        return;
      }

      const res = await loginUser({ email, password });

      onAuthSuccess(res.token);
      navigate("/notes");
    } catch (error) {
      const message = error.message || "Unable to login";
      toast.error(message);

      if (message.toLowerCase().includes("verify")) {
        setShowResend(true);
      }

      if (message.toLowerCase().includes("not found")) {
        navigate("/register");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell flex min-h-screen items-center justify-center px-4 py-6 text-slate-950 dark:text-white sm:py-10">
      <section className="grid w-full max-w-md overflow-hidden rounded-lg border border-slate-200 bg-white/78 shadow-2xl shadow-slate-200/60 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/76 dark:shadow-black/30 lg:max-w-5xl lg:grid-cols-[1fr_0.9fr]">
        <div className="flex flex-col justify-between gap-0 bg-slate-950 p-5 text-white sm:gap-10 sm:p-10">
          <div>
            <div className="flex items-center gap-3 sm:mb-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-500 text-slate-950">
                <NotebookPen size={23} />
              </span>
              <span className="text-lg font-bold">Notes</span>
            </div>
            <h1 className="mt-4 text-xl font-bold sm:hidden">
              Welcome back.
            </h1>
            <h1 className="hidden max-w-md text-3xl font-bold tracking-tight sm:block sm:text-4xl">
              Welcome back to your personal note space.
            </h1>
            <p className="mt-4 hidden max-w-md text-sm leading-6 text-slate-300 sm:block">
              Pick up where you left off, search faster, and keep your daily
              thoughts organized.
            </p>
          </div>

          <div className="hidden gap-3 text-sm text-slate-300 sm:grid sm:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <ShieldCheck className="mb-3 text-cyan-300" size={20} />
              Secure login
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <Mail className="mb-3 text-cyan-300" size={20} />
              Email verification
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Login</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Enter your details to open your notes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Enter your password"
              showToggle
            />

            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="focus-ring rounded-md text-sm font-semibold text-cyan-700 transition hover:text-cyan-900 dark:text-cyan-300 dark:hover:text-cyan-200"
            >
              Forgot Password?
            </button>

            <Button type="submit" loading={loading} icon={ArrowRight} className="w-full">
              Login
            </Button>
          </form>

          {showResend && (
            <Button
              variant="secondary"
              onClick={handleResend}
              className="mt-4 w-full"
              icon={Mail}
            >
              Resend Verification Email
            </Button>
          )}

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="focus-ring rounded-md font-semibold text-cyan-700 hover:text-cyan-900 dark:text-cyan-300 dark:hover:text-cyan-200"
            >
              Register
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;

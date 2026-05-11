import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import { useI18n } from "../contexts/I18nContext";

export default function Login() {
  const { t } = useI18n();
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const next = loc.state?.from || "/account";
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login(form.email, form.password);
    setLoading(false);
    if (res.ok) {
      toast.success(res.user.name || res.user.email);
      nav(res.user.role === "admin" ? "/admin" : next);
    } else {
      setError(res.error);
    }
  };

  return (
    <div data-testid="login-page" className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="hidden md:block bg-zinc-900 text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="relative">
          <div className="label-eyebrow text-zinc-400 mb-3">{t("login.eyebrow_left")}</div>
          <h1 className="text-4xl font-black tracking-tight">
            {t("login.headline_left")}<br />{t("login.headline_left2")}
          </h1>
          <p className="text-zinc-400 mt-6 text-sm leading-relaxed">{t("login.desc_left")}</p>
          <div className="mt-12 font-mono text-xs space-y-2 border-l border-zinc-700 pl-6">
            <div className="text-zinc-500">{t("login.demo_label")}</div>
            <div>email: demo@xiaoya-ai.com</div>
            <div>pass:  Demo@123456</div>
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="border border-zinc-200 p-8 md:p-12 space-y-5" data-testid="login-form">
        <div className="label-eyebrow">{t("login.eyebrow")}</div>
        <h2 className="text-3xl font-black tracking-tight">{t("login.title")}</h2>
        <p className="text-sm text-zinc-600">
          {t("login.no_account")} <Link to="/register" className="text-blue-600 hover:underline">{t("login.signup")}</Link>
        </p>

        {error && (
          <div data-testid="login-error" className="border border-red-300 bg-red-50 text-red-700 text-sm p-3">
            {error}
          </div>
        )}

        <div>
          <Label htmlFor="email" className="label-eyebrow">{t("common.email")}</Label>
          <Input
            id="email"
            type="email"
            data-testid="login-email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="rounded-none border-zinc-300 mt-2 h-11"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <Label htmlFor="password" className="label-eyebrow">{t("common.password")}</Label>
          <Input
            id="password"
            type="password"
            data-testid="login-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="rounded-none border-zinc-300 mt-2 h-11"
            placeholder="••••••••"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          data-testid="login-submit"
          className="rounded-none bg-zinc-900 hover:bg-blue-600 text-white w-full h-12"
        >
          {loading ? t("login.submitting") : (<><LogIn className="w-4 h-4 mr-2" /> {t("login.submit")}</>)}
        </Button>
      </form>
    </div>
  );
}

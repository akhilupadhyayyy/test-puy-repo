import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { useI18n } from "../contexts/I18nContext";

export default function Register() {
  const { t } = useI18n();
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", telegram_username: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await register(form);
    setLoading(false);
    if (res.ok) {
      toast.success(t("register.title"));
      nav("/account");
    } else {
      setError(res.error);
    }
  };

  return (
    <div data-testid="register-page" className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="hidden md:block bg-zinc-900 text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="relative">
          <div className="label-eyebrow text-zinc-400 mb-3">{t("register.eyebrow_left")}</div>
          <h1 className="text-4xl font-black tracking-tight">
            {t("register.headline1")}<br />
            <span className="bg-blue-600 px-2 inline-block">¥20</span> {t("register.headline2")}
          </h1>
          <p className="text-zinc-400 mt-6 text-sm leading-relaxed">{t("register.desc")}</p>
          <ul className="mt-8 space-y-2 text-sm text-zinc-400 font-mono">
            <li>{t("register.bullet1")}</li>
            <li>{t("register.bullet2")}</li>
            <li>{t("register.bullet3")}</li>
            <li>{t("register.bullet4")}</li>
          </ul>
        </div>
      </div>

      <form onSubmit={submit} className="border border-zinc-200 p-8 md:p-12 space-y-5" data-testid="register-form">
        <div className="label-eyebrow">{t("register.eyebrow")}</div>
        <h2 className="text-3xl font-black tracking-tight">{t("register.title")}</h2>
        <p className="text-sm text-zinc-600">
          {t("register.has_account")} <Link to="/login" className="text-blue-600 hover:underline">{t("register.login")}</Link>
        </p>

        {error && (
          <div data-testid="register-error" className="border border-red-300 bg-red-50 text-red-700 text-sm p-3">
            {error}
          </div>
        )}

        <div>
          <Label className="label-eyebrow">{t("register.name_opt")}</Label>
          <Input
            data-testid="reg-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-none border-zinc-300 mt-2 h-11"
          />
        </div>
        <div>
          <Label className="label-eyebrow">{t("common.email")}</Label>
          <Input
            type="email"
            required
            data-testid="reg-email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-none border-zinc-300 mt-2 h-11"
          />
        </div>
        <div>
          <Label className="label-eyebrow">{t("register.password_hint")}</Label>
          <Input
            type="password"
            required
            minLength={6}
            data-testid="reg-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="rounded-none border-zinc-300 mt-2 h-11"
          />
        </div>
        <div>
          <Label className="label-eyebrow">{t("register.tg_label")}</Label>
          <Input
            data-testid="reg-telegram"
            placeholder="@your_username"
            value={form.telegram_username}
            onChange={(e) => setForm({ ...form, telegram_username: e.target.value })}
            className="rounded-none border-zinc-300 mt-2 h-11"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          data-testid="register-submit"
          className="rounded-none bg-zinc-900 hover:bg-blue-600 text-white w-full h-12"
        >
          {loading ? t("register.submitting") : (<><UserPlus className="w-4 h-4 mr-2" /> {t("register.submit")}</>)}
        </Button>
      </form>
    </div>
  );
}

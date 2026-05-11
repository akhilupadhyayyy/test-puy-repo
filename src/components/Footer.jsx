import { Link } from "react-router-dom";
import { Bot, Sparkles, ShieldCheck, Zap, MessageCircle, Mail } from "lucide-react";
import { useI18n } from "../contexts/I18nContext";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer data-testid="site-footer" className="border-t border-zinc-200 bg-zinc-50 mt-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-900 text-white grid place-items-center font-black">
              小雅
            </div>
            <div>
              <div className="font-black">{t("brand.name")}</div>
              <div className="text-[10px] font-mono tracking-widest text-zinc-500">
                {t("brand.tagline")}
              </div>
            </div>
          </div>
          <p className="text-sm text-zinc-600 leading-relaxed">{t("footer.summary")}</p>
          <div className="flex gap-3 text-xs font-mono tracking-widest text-zinc-500 pt-2">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-blue-600" /> SECURE
            </span>
            <span className="inline-flex items-center gap-1">
              <Zap className="w-3 h-3 text-blue-600" /> INSTANT
            </span>
            <span className="inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" /> 24/7
            </span>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="label-eyebrow mb-4">{t("footer.shop")}</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/store" className="hover:text-blue-600">{t("nav.store")}</Link></li>
            <li><Link to="/categories/ai-tools" className="hover:text-blue-600">{t("nav.ai-tools")}</Link></li>
            <li><Link to="/categories/software" className="hover:text-blue-600">{t("nav.software")}</Link></li>
            <li><Link to="/categories/premium" className="hover:text-blue-600">{t("nav.premium")}</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <div className="label-eyebrow mb-4">{t("footer.help")}</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/how-it-works" className="hover:text-blue-600">{t("nav.how")}</Link></li>
            <li><Link to="/support" className="hover:text-blue-600">{t("nav.support")}</Link></li>
            <li><Link to="/account" className="hover:text-blue-600">{t("nav.account")}</Link></li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <div className="label-eyebrow mb-4">{t("footer.contact")}</div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-600" /> Telegram: @xiaoya_ai
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" /> support@xiaoya-ai.com
            </li>
            <li className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-blue-600" /> {t("footer.support_24")}
            </li>
          </ul>
          <div className="mt-6 text-xs font-mono tracking-widest text-zinc-500">
            {t("footer.payments")}
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-zinc-500">
          <div>© {new Date().getFullYear()} {t("brand.name")}. {t("footer.copyright")}</div>
          <div className="font-mono tracking-widest">v1.1.0 · BUILD ∎</div>
        </div>
      </div>
    </footer>
  );
}

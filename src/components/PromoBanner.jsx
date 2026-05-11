import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useI18n } from "../contexts/I18nContext";

export default function PromoBanner() {
  const { t } = useI18n();
  return (
    <section
      data-testid="promo-banner"
      className="bg-zinc-900 text-zinc-100 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex items-center gap-4 text-xs font-mono tracking-widest">
        <span className="bg-blue-600 text-white px-2 py-1 inline-flex items-center gap-1 shrink-0">
          <Sparkles className="w-3 h-3" /> {t("promo.flash")}
        </span>
        <div className="flex-1 overflow-hidden">
          <div className="marquee whitespace-nowrap">
            <span>{t("promo.text")}</span>
            <span>{t("promo.text")}</span>
          </div>
        </div>
        <Link
          to="/store"
          className="hidden sm:inline-block bg-white text-zinc-900 px-3 py-1 hover:bg-blue-500 hover:text-white shrink-0"
        >
          {t("promo.cta")}
        </Link>
      </div>
    </section>
  );
}

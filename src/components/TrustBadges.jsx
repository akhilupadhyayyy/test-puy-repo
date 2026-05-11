import { ShieldCheck, Zap, Headphones, BadgeCheck } from "lucide-react";
import { useI18n } from "../contexts/I18nContext";

export default function TrustBadges() {
  const { t } = useI18n();
  const items = [
    { icon: ShieldCheck, title: t("trust.licensed"), desc: t("trust.licensed_d") },
    { icon: Zap, title: t("trust.instant"), desc: t("trust.instant_d") },
    { icon: Headphones, title: t("trust.support"), desc: t("trust.support_d") },
    { icon: BadgeCheck, title: t("trust.guarantee"), desc: t("trust.guarantee_d") },
  ];
  return (
    <section
      data-testid="trust-badges"
      className="border-y border-zinc-200 bg-zinc-50/50"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4">
        {items.map(({ icon: Icon, title, desc }, i) => (
          <div
            key={title}
            className={`flex items-center gap-4 py-6 px-4 ${
              i !== items.length - 1 ? "md:border-r" : ""
            } ${i < 2 ? "border-b md:border-b-0" : ""} ${i === 0 ? "border-r" : ""} ${
              i === 2 ? "border-r md:border-r" : ""
            } border-zinc-200`}
          >
            <div className="w-10 h-10 bg-white border border-zinc-200 grid place-items-center text-blue-600 shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm">{title}</div>
              <div className="text-xs text-zinc-500 truncate">{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

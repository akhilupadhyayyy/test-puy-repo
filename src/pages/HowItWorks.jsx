import { Link } from "react-router-dom";
import { ShoppingBag, Wallet, Mail, ShieldCheck, MessageCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { useI18n } from "../contexts/I18nContext";

export default function HowItWorks() {
  const { t } = useI18n();
  const STEPS = [
    { n: "01", icon: ShoppingBag, title: t("hiw.step1.t"), desc: t("hiw.step1.d") },
    { n: "02", icon: Wallet, title: t("hiw.step2.t"), desc: t("hiw.step2.d") },
    { n: "03", icon: Mail, title: t("hiw.step3.t"), desc: t("hiw.step3.d") },
    { n: "04", icon: MessageCircle, title: t("trust.support"), desc: t("trust.support_d") },
    { n: "05", icon: ShieldCheck, title: t("trust.guarantee"), desc: t("trust.guarantee_d") },
  ];

  return (
    <div data-testid="how-it-works-page" className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10">
      <div className="border-b border-zinc-200 pb-10 mb-12">
        <div className="label-eyebrow mb-2">{t("hiw.eyebrow")}</div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">{t("nav.how")}</h1>
        <p className="text-zinc-600 mt-3 max-w-2xl">{t("hiw.title")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-zinc-200">
        {STEPS.map((s, i) => (
          <div
            key={s.n}
            className={`p-8 ${
              i % 2 === 0 ? "md:border-r border-zinc-200" : ""
            } ${i < STEPS.length - 2 ? "border-b border-zinc-200" : ""}`}
          >
            <div className="flex items-start gap-5">
              <div className="font-mono text-3xl font-black text-blue-600">{s.n}</div>
              <div className="w-10 h-10 bg-zinc-900 text-white grid place-items-center shrink-0">
                <s.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-xl">{s.title}</div>
                <p className="text-sm text-zinc-600 mt-2 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-16 bg-zinc-900 text-white p-10 md:p-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="label-eyebrow text-zinc-400 mb-3">// READY?</div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              {t("hiw.title")}
            </h2>
            <p className="text-zinc-400 mt-4">{t("section.featured.subtitle")}</p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link to="/store">
                <Button className="rounded-none bg-white text-zinc-900 hover:bg-blue-600 hover:text-white h-12 px-7">
                  {t("hero.cta_store")}
                </Button>
              </Link>
              <Link to="/support">
                <Button
                  variant="outline"
                  className="rounded-none border-zinc-700 text-white bg-transparent hover:bg-white hover:text-zinc-900 h-12 px-7"
                >
                  {t("nav.support")}
                </Button>
              </Link>
            </div>
          </div>
          <div className="font-mono text-xs space-y-2 border-l border-zinc-700 pl-6">
            <div className="text-zinc-400">// SUPPORTED NETWORKS</div>
            {[
              "USDT-TRC20",
              "USDT-BEP20",
              "USDT-APTOS",
              "USDT-ERA",
              "BTC",
              "ETH",
              "LTC",
              "SOL",
              "TRX",
              "TON",
            ].map((n) => (
              <div key={n} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500" /> {n}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

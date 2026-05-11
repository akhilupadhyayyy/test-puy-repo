import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Zap, ShieldCheck, Bot, Cpu, MessageSquare } from "lucide-react";
import ProductCard from "../components/ProductCard";
import TrustBadges from "../components/TrustBadges";
import PromoBanner from "../components/PromoBanner";
import { api, formatCNY } from "../lib/api";
import { Button } from "../components/ui/button";
import { useI18n } from "../contexts/I18nContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

export default function Home() {
  const { t } = useI18n();
  const [featured, setFeatured] = useState([]);
  const [hot, setHot] = useState([]);

  const FAQ = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
  ];

  useEffect(() => {
    api.get("/products", { params: { featured: true } }).then((r) => setFeatured(r.data.slice(0, 8)));
    api.get("/products", { params: { limit: 8 } }).then((r) => setHot(r.data));
  }, []);

  return (
    <div data-testid="home-page">
      <PromoBanner />

      {/* HERO */}
      <section className="relative border-b border-zinc-200 overflow-hidden">
        <div className="absolute inset-0 grid-bg pointer-events-none opacity-60" />
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7 space-y-6 reveal">
            <div className="inline-flex items-center gap-2 border border-zinc-300 px-3 py-1.5 text-[11px] font-mono tracking-widest">
              <span className="w-1.5 h-1.5 bg-blue-600" />
              {t("hero.eyebrow")}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
              {t("hero.title1")}
              <br />
              <span className="bg-zinc-900 text-white px-3 inline-block">{t("hero.title2")}</span>
              <span className="blink ml-1" />
            </h1>
            <p className="text-base text-zinc-600 leading-relaxed max-w-xl">
              {t("hero.subtitle")}
              <span className="font-bold text-zinc-900"> {t("hero.subtitle_count")} </span>
              {t("hero.subtitle_end")}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/store" data-testid="hero-cta-store">
                <Button className="rounded-none bg-zinc-900 hover:bg-blue-600 text-white h-12 px-7 text-sm font-medium">
                  {t("hero.cta_store")} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/how-it-works" data-testid="hero-cta-how">
                <Button
                  variant="outline"
                  className="rounded-none border-zinc-900 h-12 px-7 text-sm font-medium hover:bg-zinc-900 hover:text-white"
                >
                  {t("hero.cta_how")}
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-3 max-w-md pt-6 border-t border-zinc-200">
              <Stat label={t("hero.stat_products")} value="50+" />
              <Stat label={t("hero.stat_orders")} value="12.8K+" />
              <Stat label={t("hero.stat_uptime")} value="99.9%" />
            </div>
          </div>

          <div className="md:col-span-5 relative reveal">
            <div className="relative border border-zinc-300 bg-white">
              <img
                src="https://images.unsplash.com/photo-1762279388957-c6ed514d3353?crop=entropy&cs=srgb&fm=jpg&q=85&w=900"
                alt="AI tools"
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="bg-white/90 backdrop-blur px-3 py-1.5 text-[10px] font-mono tracking-widest border border-zinc-300">
                  {t("hero.featured")}
                </span>
                <span className="bg-blue-600 text-white px-3 py-1.5 text-[10px] font-mono tracking-widest">
                  {t("hero.live")}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-zinc-900 text-white p-5 grid grid-cols-3 divide-x divide-zinc-700">
                <Mini icon={Bot} label="ChatGPT" />
                <Mini icon={Sparkles} label="Claude" />
                <Mini icon={Cpu} label="Cursor" />
              </div>
            </div>
            <div className="hidden md:block absolute -bottom-6 -left-6 bg-white border border-zinc-300 p-4 max-w-xs shadow-lg">
              <div className="text-[10px] font-mono tracking-widest text-zinc-500">
                {t("hero.latest_delivery")}
              </div>
              <div className="text-sm font-bold mt-1">订单 #XY20260218A3F2</div>
              <div className="text-xs text-zinc-600 mt-1">{t("hero.latest_order")}</div>
            </div>
          </div>
        </div>
      </section>

      <TrustBadges />

      {/* FEATURED PRODUCTS */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16 md:py-20">
        <SectionHeader
          eyebrow={t("section.featured.eyebrow")}
          title={t("section.featured.title")}
          subtitle={t("section.featured.subtitle")}
          link="/store"
          linkLabel={t("section.view_all")}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-zinc-200 [&>*]:border-r [&>*]:border-b [&>*:nth-child(4n)]:border-r-0">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="border-y border-zinc-200 bg-zinc-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <CategoryCard
            slug="ai-tools"
            title={t("nav.ai-tools")}
            desc={t("category.ai-tools.desc")}
            count="20+"
            cta={t("section.browse_cat")}
          />
          <CategoryCard
            slug="software"
            title={t("nav.software")}
            desc={t("category.software.desc")}
            count="15+"
            cta={t("section.browse_cat")}
          />
          <CategoryCard
            slug="premium"
            title={t("nav.premium")}
            desc={t("category.premium.desc")}
            count="10+"
            cta={t("section.browse_cat")}
          />
        </div>
      </section>

      {/* ALL PRODUCTS PREVIEW */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16 md:py-20">
        <SectionHeader
          eyebrow={t("section.catalog.eyebrow")}
          title={t("section.catalog.title")}
          subtitle={t("section.catalog.subtitle")}
          link="/store"
          linkLabel={t("section.view_all")}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-zinc-200 [&>*]:border-r [&>*]:border-b [&>*:nth-child(4n)]:border-r-0">
          {hot.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-zinc-200 bg-zinc-900 text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="max-w-2xl">
            <div className="label-eyebrow text-zinc-400 mb-3">{t("hiw.eyebrow")}</div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              {t("hiw.title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-12 border border-zinc-800">
            {[
              { n: "01", t: t("hiw.step1.t"), d: t("hiw.step1.d") },
              { n: "02", t: t("hiw.step2.t"), d: t("hiw.step2.d") },
              { n: "03", t: t("hiw.step3.t"), d: t("hiw.step3.d") },
            ].map((s, i) => (
              <div
                key={s.n}
                className={`p-8 ${i < 2 ? "md:border-r border-zinc-800" : ""} ${i < 2 ? "border-b md:border-b-0 border-zinc-800" : ""}`}
              >
                <div className="font-mono text-blue-500 text-xs tracking-widest">STEP {s.n}</div>
                <div className="font-bold text-2xl mt-3">{s.t}</div>
                <div className="text-zinc-400 mt-3 leading-relaxed text-sm">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <div className="label-eyebrow mb-3">{t("faq.eyebrow")}</div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            {t("faq.title")}
          </h2>
          <p className="text-zinc-600 mt-4 leading-relaxed">
            {t("faq.subtitle")}
            <Link to="/support" className="text-blue-600 hover:underline ml-1">
              {t("faq.support_link")}
            </Link>
          </p>
        </div>
        <div className="md:col-span-8 border-t border-zinc-200">
          <Accordion type="single" collapsible className="w-full" data-testid="home-faq">
            {FAQ.map((f, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border-b border-zinc-200"
              >
                <AccordionTrigger className="text-left text-base font-bold py-5 hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-zinc-600 leading-relaxed pb-5">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="px-4 first:pl-0">
      <div className="text-2xl font-black font-mono">{value}</div>
      <div className="text-[10px] tracking-widest font-mono text-zinc-500 mt-1">{label}</div>
    </div>
  );
}

function Mini({ icon: Icon, label }) {
  return (
    <div className="flex flex-col items-center gap-2 py-2">
      <Icon className="w-4 h-4 text-blue-400" />
      <span className="text-[10px] font-mono tracking-widest">{label}</span>
    </div>
  );
}

function SectionHeader({ eyebrow, title, subtitle, link, linkLabel }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
      <div>
        <div className="label-eyebrow mb-2">{eyebrow}</div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight">{title}</h2>
        {subtitle && <p className="text-zinc-600 mt-2">{subtitle}</p>}
      </div>
      {link && (
        <Link
          to={link}
          className="inline-flex items-center gap-1 text-sm font-bold hover:text-blue-600 self-start"
        >
          {linkLabel || "→"} <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

function CategoryCard({ slug, title, desc, count, cta }) {
  return (
    <Link
      to={`/categories/${slug}`}
      data-testid={`home-cat-${slug}`}
      className="bg-white border border-zinc-200 p-8 hover-lift flex items-start gap-5"
    >
      <div className="text-3xl font-black font-mono text-blue-600">{count}</div>
      <div className="flex-1">
        <div className="font-bold text-xl">{title}</div>
        <div className="text-sm text-zinc-500 mt-1">{desc}</div>
        <div className="mt-4 text-xs font-mono tracking-widest text-zinc-900 inline-flex items-center gap-1">
          {cta} <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </Link>
  );
}

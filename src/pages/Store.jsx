import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { api } from "../lib/api";
import { Input } from "../components/ui/input";
import { Search } from "lucide-react";
import { useI18n } from "../contexts/I18nContext";

export default function Store() {
  const { t } = useI18n();
  const CATS = [
    { value: "all", label: t("store.filter.all") },
    { value: "AI Tools", label: t("nav.ai-tools") },
    { value: "Software", label: t("nav.software") },
    { value: "Premium", label: t("nav.premium") },
    { value: "Gift", label: t("nav.gift") },
  ];
  const SORTS = [
    { value: "default", label: t("store.sort.default") },
    { value: "price-asc", label: t("store.sort.price_asc") },
    { value: "price-desc", label: t("store.sort.price_desc") },
  ];

  const [params, setParams] = useSearchParams();
  const initialQ = params.get("q") || "";
  const initialCat = params.get("category") || "all";
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState(initialQ);
  const [cat, setCat] = useState(initialCat);
  const [sort, setSort] = useState("default");

  useEffect(() => {
    const p = {};
    if (cat && cat !== "all") p.category = cat;
    if (q) p.q = q;
    api.get("/products", { params: p }).then((r) => setProducts(r.data));
    const sp = {};
    if (cat !== "all") sp.category = cat;
    if (q) sp.q = q;
    setParams(sp, { replace: true });
  }, [cat, q, setParams]);

  const sorted = useMemo(() => {
    const arr = [...products];
    if (sort === "price-asc") arr.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") arr.sort((a, b) => b.price - a.price);
    return arr;
  }, [products, sort]);

  return (
    <div data-testid="store-page" className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10">
      <div className="border-b border-zinc-200 pb-6 mb-8">
        <div className="label-eyebrow mb-2">{t("store.eyebrow")}</div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">{t("store.title")}</h1>
        <p className="text-zinc-600 mt-2 text-sm">{t("store.subtitle")}</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          {CATS.map((c) => (
            <button
              key={c.value}
              data-testid={`filter-cat-${c.value}`}
              onClick={() => setCat(c.value)}
              className={`text-xs font-medium tracking-wider px-4 h-9 border transition-colors ${
                cat === c.value
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "bg-white border-zinc-300 hover:border-zinc-900"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-zinc-300 focus-within:border-blue-600">
            <Search className="w-4 h-4 mx-3 text-zinc-500" />
            <Input
              data-testid="store-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("store.search.placeholder")}
              className="border-0 rounded-none focus-visible:ring-0 h-9 w-40 sm:w-56"
            />
          </div>
          <select
            data-testid="store-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-9 border border-zinc-300 px-3 text-xs font-medium bg-white focus:border-blue-600 outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {t("store.sort.label")}{s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="border border-zinc-200 p-16 text-center text-zinc-500">
          {t("store.empty")}
        </div>
      ) : (
        <div
          data-testid="store-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-zinc-200 [&>*]:border-r [&>*]:border-b [&>*:nth-child(4n)]:border-r-0"
        >
          {sorted.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

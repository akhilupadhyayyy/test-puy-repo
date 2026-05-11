import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { formatCNY } from "../lib/api";
import { Button } from "../components/ui/button";
import { Trash2, ArrowRight } from "lucide-react";
import { useI18n } from "../contexts/I18nContext";

export default function Cart() {
  const { t } = useI18n();
  const { items, setQty, remove, total, clear } = useCart();
  const nav = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="label-eyebrow mb-3">{t("cart.eyebrow")}</div>
        <h1 className="text-3xl font-black mb-3">{t("cart.empty.title")}</h1>
        <p className="text-zinc-600 mb-8">{t("cart.empty.subtitle")}</p>
        <Link to="/store">
          <Button className="rounded-none bg-zinc-900 hover:bg-blue-600 text-white h-12 px-7">
            {t("cart.empty.cta")} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div data-testid="cart-page" className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10">
      <div className="label-eyebrow mb-2">{t("cart.eyebrow")}</div>
      <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-8">{t("cart.title")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 border border-zinc-200">
          <div className="hidden md:grid grid-cols-12 px-5 py-3 border-b border-zinc-200 label-eyebrow">
            <div className="col-span-6">{t("cart.col.product")}</div>
            <div className="col-span-2 text-right">{t("common.price")}</div>
            <div className="col-span-2 text-center">{t("common.qty")}</div>
            <div className="col-span-2 text-right">{t("common.subtotal")}</div>
          </div>
          {items.map((it) => (
            <div
              key={it.product_id}
              data-testid={`cart-item-${it.handle}`}
              className="grid grid-cols-12 gap-3 p-5 border-b last:border-b-0 border-zinc-200 items-center"
            >
              <div className="col-span-12 md:col-span-6 flex gap-4 items-center">
                <img
                  src={it.image_url}
                  alt={it.title}
                  className="w-16 h-16 object-cover border border-zinc-200"
                />
                <div className="min-w-0">
                  <div className="font-bold text-sm">{it.title}</div>
                  <div className="text-[10px] font-mono tracking-widest text-zinc-500 mt-1">
                    {it.brand} · {it.plan_tier}
                  </div>
                </div>
              </div>
              <div className="col-span-4 md:col-span-2 text-left md:text-right font-mono">
                {formatCNY(it.price)}
              </div>
              <div className="col-span-4 md:col-span-2 flex justify-center">
                <div className="flex items-center border border-zinc-300">
                  <button
                    onClick={() => setQty(it.product_id, it.quantity - 1)}
                    className="w-8 h-8 hover:bg-zinc-100"
                    data-testid={`cart-dec-${it.handle}`}
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-mono text-sm">{it.quantity}</span>
                  <button
                    onClick={() => setQty(it.product_id, it.quantity + 1)}
                    className="w-8 h-8 hover:bg-zinc-100"
                    data-testid={`cart-inc-${it.handle}`}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="col-span-3 md:col-span-2 text-right font-mono font-bold">
                {formatCNY(it.price * it.quantity)}
              </div>
              <button
                onClick={() => remove(it.product_id)}
                data-testid={`cart-remove-${it.handle}`}
                className="col-span-1 text-zinc-400 hover:text-red-600 justify-self-end"
                aria-label="remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <div className="p-4 flex justify-between items-center border-t border-zinc-200">
            <button
              onClick={clear}
              data-testid="cart-clear"
              className="text-xs text-zinc-500 hover:text-red-600 underline"
            >
              {t("cart.clear")}
            </button>
            <Link to="/store" className="text-xs text-blue-600 hover:underline">
              {t("cart.continue")}
            </Link>
          </div>
        </div>

        <div className="lg:col-span-4 border border-zinc-200 bg-zinc-50 p-6 h-fit space-y-4">
          <h2 className="font-black text-xl">{t("cart.summary")}</h2>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-600">{t("cart.subtotal")}</span>
            <span className="font-mono font-bold">{formatCNY(total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-600">{t("cart.usdt_discount")}</span>
            <span className="font-mono text-blue-600">-{formatCNY(total * 0.05)}</span>
          </div>
          <div className="border-t border-zinc-300 pt-4 flex justify-between items-end">
            <span className="font-bold">{t("common.total")}</span>
            <span className="text-2xl font-black font-mono">{formatCNY(total)}</span>
          </div>
          <Button
            onClick={() => nav("/checkout")}
            data-testid="checkout-btn"
            className="rounded-none bg-blue-600 hover:bg-blue-700 text-white w-full h-12 text-sm font-medium"
          >
            {t("common.checkout")} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <div className="text-[11px] font-mono tracking-widest text-zinc-500 pt-2 leading-relaxed">
            {t("cart.note")}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { api, formatCNY, formatApiError } from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import { Copy, Check, ArrowRight } from "lucide-react";
import { useI18n } from "../contexts/I18nContext";

export default function Checkout() {
  const { t } = useI18n();
  const { items, total, clear } = useCart();
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const [wallets, setWallets] = useState([]);
  const [network, setNetwork] = useState("");
  const [contact, setContact] = useState({ email: "", telegram: "", note: "" });
  const [step, setStep] = useState(1); // 1 select, 2 pay, 3 done
  const [order, setOrder] = useState(null);
  const [tx, setTx] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) nav("/login", { state: { from: "/checkout" } });
  }, [user, authLoading, nav]);

  useEffect(() => {
    if (user) setContact((c) => ({ ...c, email: c.email || user.email, telegram: c.telegram || user.telegram_username }));
  }, [user]);

  useEffect(() => {
    api.get("/wallets").then((r) => {
      setWallets(r.data);
      if (r.data.length && !network) setNetwork(r.data[0].network);
    });
  }, [network]);

  if (items.length === 0 && step === 1) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-20 text-center text-zinc-500">
        购物车为空，<a className="text-blue-600 underline" href="/store">去逛逛</a>
      </div>
    );
  }

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
        payment_network: network,
        contact_email: contact.email,
        contact_telegram: contact.telegram,
        note: contact.note,
      };
      const { data } = await api.post("/orders", payload);
      setOrder(data);
      setStep(2);
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const submitTx = async () => {
    if (!tx.trim()) return toast.error("请填写交易哈希 TXID");
    setLoading(true);
    try {
      const { data } = await api.post(`/orders/${order.id}/submit-tx`, { tx_hash: tx.trim() });
      setOrder(data);
      clear();
      setStep(3);
      toast.success("已提交，请等待管理员核对发货");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const copyAddr = () => {
    navigator.clipboard.writeText(order.wallet_address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div data-testid="checkout-page" className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10">
      <div className="label-eyebrow mb-2">{t("checkout.eyebrow")}</div>
      <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-8">{t("checkout.title")}</h1>

      <div className="flex items-center gap-2 mb-8 text-xs font-mono tracking-widest">
        {[t("checkout.step1"), t("checkout.step2"), t("checkout.step3")].map((label, i) => {
          const idx = i + 1;
          const active = step === idx;
          const done = step > idx;
          return (
            <div key={label} className="flex items-center gap-2">
              <span
                className={`w-7 h-7 grid place-items-center border ${
                  active ? "bg-blue-600 text-white border-blue-600" :
                  done ? "bg-zinc-900 text-white border-zinc-900" :
                  "bg-white border-zinc-300 text-zinc-500"
                }`}
              >
                {idx}
              </span>
              <span className={active ? "text-zinc-900 font-bold" : "text-zinc-500"}>
                {label}
              </span>
              {idx < 3 && <span className="w-8 h-px bg-zinc-300" />}
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <form onSubmit={placeOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <section className="border border-zinc-200 p-6">
              <div className="label-eyebrow mb-4">{t("checkout.contact")}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">{t("checkout.delivery_email")}</Label>
                  <Input
                    required
                    type="email"
                    data-testid="ck-email"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    className="rounded-none border-zinc-300 mt-2 h-11"
                  />
                </div>
                <div>
                  <Label className="text-xs">{t("checkout.tg_optional")}</Label>
                  <Input
                    data-testid="ck-tg"
                    placeholder="@your_username"
                    value={contact.telegram}
                    onChange={(e) => setContact({ ...contact, telegram: e.target.value })}
                    className="rounded-none border-zinc-300 mt-2 h-11"
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label className="text-xs">{t("checkout.note_optional")}</Label>
                <Textarea
                  data-testid="ck-note"
                  rows={2}
                  value={contact.note}
                  onChange={(e) => setContact({ ...contact, note: e.target.value })}
                  className="rounded-none border-zinc-300 mt-2"
                />
              </div>
            </section>

            <section className="border border-zinc-200 p-6">
              <div className="label-eyebrow mb-4">{t("checkout.network")}</div>
              <div
                data-testid="network-warning"
                className="border border-amber-400 bg-amber-50 text-amber-900 p-3 mb-4 text-xs leading-relaxed"
              >
                <strong>⚠ </strong>{t("checkout.warning")}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {wallets.map((w) => (
                  <button
                    type="button"
                    key={w.network}
                    onClick={() => setNetwork(w.network)}
                    data-testid={`net-${w.network}`}
                    className={`text-left border p-3 transition-colors ${
                      network === w.network
                        ? "border-blue-600 bg-blue-50"
                        : "border-zinc-300 hover:border-zinc-900"
                    }`}
                  >
                    <div className="font-bold text-sm">{w.network}</div>
                    <div className="text-[10px] font-mono tracking-widest text-zinc-500 mt-1">
                      {w.coin}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:col-span-5 border border-zinc-200 bg-zinc-50 p-6 h-fit space-y-4">
            <h2 className="font-black text-xl">{t("checkout.summary")}</h2>
            <div className="space-y-2 max-h-64 overflow-auto">
              {items.map((i) => (
                <div key={i.product_id} className="flex justify-between text-sm">
                  <span className="truncate pr-3">
                    {i.title}{" "}
                    <span className="text-zinc-400 font-mono">×{i.quantity}</span>
                  </span>
                  <span className="font-mono">{formatCNY(i.price * i.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-300 pt-4 flex justify-between items-end">
              <span className="font-bold">{t("common.total")}</span>
              <span className="text-2xl font-black font-mono">{formatCNY(total)}</span>
            </div>
            <Button
              type="submit"
              disabled={loading || !network}
              data-testid="place-order-btn"
              className="rounded-none bg-blue-600 hover:bg-blue-700 text-white w-full h-12 text-sm"
            >
              {loading ? t("common.loading") : (<>{t("checkout.create_order")} <ArrowRight className="w-4 h-4 ml-2" /></>)}
            </Button>
            <div className="text-[11px] font-mono text-zinc-500 leading-relaxed">
              {t("checkout.network_note")}
            </div>
          </aside>
        </form>
      )}

      {step === 2 && order && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 border border-zinc-200 p-6 space-y-5">
            <div className="label-eyebrow">// PAY · {order.payment_network}</div>
            <h2 className="text-2xl font-black">{t("checkout.pay_title")}</h2>
            <div
              data-testid="pay-network-warning"
              className="border border-amber-400 bg-amber-50 text-amber-900 p-3 text-xs leading-relaxed"
            >
              <strong>⚠ </strong>{t("checkout.pay_warning")}{" "}
              <span className="font-mono font-bold">{order.payment_network}</span>
              {t("checkout.pay_warning2")}
            </div>
            <div className="bg-zinc-900 text-white p-5 font-mono text-xs break-all relative">
              <div className="text-zinc-400 mb-2">{order.payment_network} · {order.wallet_coin}</div>
              <div data-testid="wallet-address" className="text-base">{order.wallet_address}</div>
              <button
                onClick={copyAddr}
                data-testid="copy-address"
                className="absolute top-3 right-3 inline-flex items-center gap-1 bg-white text-zinc-900 px-3 py-1 hover:bg-blue-500 hover:text-white"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? t("common.copied") : t("common.copy")}
              </button>
            </div>
            <div className="border border-zinc-200 p-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-500">{t("checkout.order_no")}</span>
                <span className="font-mono">{order.order_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{t("checkout.due_amount")}</span>
                <span className="font-mono font-bold">{formatCNY(order.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{t("common.status")}</span>
                <span className="font-mono text-amber-600">PENDING</span>
              </div>
            </div>

            <div>
              <Label className="text-xs label-eyebrow">{t("checkout.tx_label")}</Label>
              <Input
                data-testid="tx-hash-input"
                value={tx}
                onChange={(e) => setTx(e.target.value)}
                placeholder="0x... TRX hash..."
                className="rounded-none border-zinc-300 mt-2 h-11 font-mono text-xs"
              />
              <Button
                onClick={submitTx}
                disabled={loading}
                data-testid="submit-tx-btn"
                className="rounded-none bg-blue-600 hover:bg-blue-700 text-white mt-3 h-11 px-7"
              >
                {loading ? t("common.loading") : t("checkout.tx_submit")}
              </Button>
            </div>
          </div>
          <aside className="lg:col-span-5 border border-zinc-200 bg-zinc-50 p-6 space-y-3 text-sm">
            <h3 className="font-black text-lg">{t("checkout.tips_title")}</h3>
            <ul className="space-y-2 list-disc list-inside text-zinc-700">
              <li>{t("checkout.tip1")}</li>
              <li>{t("checkout.tip2")}</li>
              <li>{t("checkout.tip3")}</li>
              <li>{t("checkout.tip4")}</li>
              <li>{t("checkout.tip5")} <span className="font-mono">@xiaoya_ai</span></li>
            </ul>
          </aside>
        </div>
      )}

      {step === 3 && order && (
        <div className="border border-zinc-200 p-10 text-center max-w-2xl mx-auto">
          <div className="w-14 h-14 bg-blue-600 text-white grid place-items-center mx-auto">
            <Check className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-black mt-5">{t("checkout.success.title")}</h2>
          <p className="text-zinc-600 mt-3 text-sm leading-relaxed">
            {t("checkout.order_no")} <span className="font-mono font-bold">{order.order_number}</span>
            <br />
            {t("checkout.success.desc")}
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Button
              onClick={() => nav("/account")}
              data-testid="go-orders"
              className="rounded-none bg-zinc-900 hover:bg-blue-600 text-white h-11 px-7"
            >
              {t("checkout.success.view")}
            </Button>
            <Button
              onClick={() => nav("/store")}
              variant="outline"
              className="rounded-none border-zinc-900 h-11 px-7 hover:bg-zinc-900 hover:text-white"
            >
              {t("common.continue_shopping")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

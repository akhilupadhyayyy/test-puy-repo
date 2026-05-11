import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api, formatCNY } from "../lib/api";
import { Button } from "../components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "../contexts/I18nContext";

export default function Account() {
  const { t } = useI18n();
  const { user, logout, loading } = useAuth();
  const nav = useNavigate();
  const [orders, setOrders] = useState([]);

  const STATUS = {
    pending: { label: t("account.status.pending"), cls: "bg-amber-50 text-amber-700 border-amber-300" },
    paid: { label: t("account.status.paid"), cls: "bg-blue-50 text-blue-700 border-blue-300" },
    delivered: { label: t("account.status.delivered"), cls: "bg-emerald-50 text-emerald-700 border-emerald-300" },
    cancelled: { label: t("account.status.cancelled"), cls: "bg-zinc-100 text-zinc-600 border-zinc-300" },
  };

  useEffect(() => {
    if (!loading && !user) nav("/login");
  }, [user, loading, nav]);

  useEffect(() => {
    if (user) api.get("/orders").then((r) => setOrders(r.data));
  }, [user]);

  if (!user) return null;

  return (
    <div data-testid="account-page" className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10">
      <div className="border-b border-zinc-200 pb-8 mb-10 flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="label-eyebrow mb-2">{t("account.eyebrow")}</div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">{user.name || user.email}</h1>
          <div className="text-sm text-zinc-500 mt-1 font-mono">
            {user.email} · {user.role.toUpperCase()}
            {user.telegram_username && ` · ${user.telegram_username}`}
          </div>
        </div>
        <div className="flex gap-3">
          {user.role === "admin" && (
            <Link to="/admin">
              <Button className="rounded-none bg-zinc-900 hover:bg-blue-600 text-white h-10">
                {t("account.go_admin")}
              </Button>
            </Link>
          )}
          <Button
            onClick={() => { logout(); nav("/"); }}
            variant="outline"
            className="rounded-none h-10"
            data-testid="account-logout"
          >
            {t("account.logout")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-zinc-200 mb-10">
        <Stat label={t("account.stat_total")} value={orders.length} />
        <Stat label={t("account.stat_delivered")} value={orders.filter((o) => o.status === "delivered").length} />
        <Stat label={t("account.stat_pending")} value={orders.filter((o) => o.status === "pending").length} />
        <Stat label={t("account.stat_spent")} value={formatCNY(orders.reduce((a, o) => a + (o.status !== "cancelled" ? o.total : 0), 0))} />
      </div>

      <h2 className="text-2xl font-black mb-5">{t("account.my_orders")}</h2>

      {orders.length === 0 ? (
        <div className="border border-zinc-200 p-10 text-center text-zinc-500">
          {t("account.empty")} <Link to="/store" className="text-blue-600 underline">{t("account.go_store")}</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const s = STATUS[o.status] || STATUS.pending;
            return (
              <div
                key={o.id}
                data-testid={`order-${o.order_number}`}
                className="border border-zinc-200 bg-white"
              >
                <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-3 bg-zinc-50 border-b border-zinc-200">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-mono font-bold">{o.order_number}</span>
                    <span className="text-zinc-400 text-xs">
                      {new Date(o.created_at).toLocaleString("zh-CN")}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 border font-mono tracking-widest ${s.cls}`}>
                    {s.label}
                  </span>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-7 space-y-2">
                    {o.items.map((it) => (
                      <div key={it.product_id} className="flex items-center gap-3 text-sm">
                        <img
                          src={it.image_url}
                          alt={it.title}
                          className="w-12 h-12 object-cover border border-zinc-200"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold truncate">{it.title}</div>
                          <div className="text-xs text-zinc-500 font-mono">
                            ×{it.quantity} · {formatCNY(it.price)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="md:col-span-3 text-sm space-y-1">
                    <div className="text-zinc-500 text-xs label-eyebrow">支付</div>
                    <div className="font-mono">{o.payment_network}</div>
                    <div className="font-mono text-xs break-all text-zinc-500">{o.wallet_address}</div>
                    {o.tx_hash && (
                      <div className="text-xs">
                        <span className="text-zinc-500">TXID:</span>{" "}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(o.tx_hash);
                            toast.success("TXID 已复制");
                          }}
                          className="font-mono break-all hover:text-blue-600 inline-flex items-center gap-1"
                        >
                          {o.tx_hash.slice(0, 16)}... <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2 flex flex-col items-end justify-between gap-3">
                    <div className="text-2xl font-black font-mono">{formatCNY(o.total)}</div>
                    {o.status === "delivered" && o.credentials && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(o.credentials);
                          toast.success("已复制账号信息");
                        }}
                        data-testid={`copy-creds-${o.order_number}`}
                        className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        复制账号 <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
                {o.status === "delivered" && o.credentials && (
                  <div className="border-t border-zinc-200 px-5 py-3 bg-emerald-50 text-sm">
                    <div className="label-eyebrow text-emerald-700 mb-1">// DELIVERED</div>
                    <pre className="font-mono text-xs whitespace-pre-wrap break-all text-zinc-800">
                      {o.credentials}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="p-5 border-r last:border-r-0 [&:nth-child(2n)]:border-r-0 md:[&:nth-child(2n)]:border-r border-zinc-200">
      <div className="text-2xl font-black font-mono">{value}</div>
      <div className="label-eyebrow mt-1">{label}</div>
    </div>
  );
}

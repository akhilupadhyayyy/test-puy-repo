import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { api, formatCNY, formatApiError } from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function Admin() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [creds, setCreds] = useState("");
  const [orderStatus, setOrderStatus] = useState("delivered");

  const refresh = async () => {
    const [o, p, c, w] = await Promise.all([
      api.get("/admin/orders"),
      api.get("/products", { params: { limit: 500 } }),
      api.get("/admin/contact"),
      api.get("/wallets"),
    ]);
    setOrders(o.data);
    setProducts(p.data);
    setContacts(c.data);
    setWallets(w.data);
  };

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) nav("/");
  }, [user, loading, nav]);

  useEffect(() => {
    if (user?.role === "admin") refresh();
  }, [user]);

  const updateOrder = async () => {
    try {
      await api.put(`/admin/orders/${editingOrder.id}`, {
        status: orderStatus,
        credentials: creds,
      });
      toast.success("订单已更新");
      setEditingOrder(null);
      setCreds("");
      refresh();
    } catch (e) {
      toast.error(formatApiError(e));
    }
  };

  const updateWallet = async (w) => {
    try {
      await api.post("/admin/wallets", w);
      toast.success(`${w.network} 钱包已更新`);
      refresh();
    } catch (e) {
      toast.error(formatApiError(e));
    }
  };

  const saveProduct = async (p) => {
    try {
      if (p._isNew) {
        await api.post("/admin/products", p);
        toast.success("商品已创建");
      } else {
        await api.put(`/admin/products/${p.handle}`, p);
        toast.success("商品已更新");
      }
      setEditingProduct(null);
      refresh();
    } catch (e) {
      toast.error(formatApiError(e));
    }
  };

  const deleteProduct = async (handle) => {
    if (!window.confirm(`删除商品 ${handle}?`)) return;
    try {
      await api.delete(`/admin/products/${handle}`);
      toast.success("已删除");
      refresh();
    } catch (e) {
      toast.error(formatApiError(e));
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div data-testid="admin-page" className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10">
      <div className="border-b border-zinc-200 pb-6 mb-8">
        <div className="label-eyebrow mb-2">// ADMIN PANEL</div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">管理后台</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-zinc-200 mb-8">
        <Stat label="商品总数" value={products.length} />
        <Stat label="订单总数" value={orders.length} />
        <Stat label="待处理" value={orders.filter((o) => o.status === "paid").length} />
        <Stat label="未读消息" value={contacts.length} />
      </div>

      <Tabs defaultValue="orders">
        <TabsList className="bg-transparent border-b border-zinc-200 rounded-none w-full justify-start gap-0 h-auto p-0">
          {[
            { v: "orders", l: "订单" },
            { v: "products", l: "商品" },
            { v: "wallets", l: "钱包" },
            { v: "contacts", l: "客服消息" },
          ].map((t) => (
            <TabsTrigger
              key={t.v}
              value={t.v}
              data-testid={`admin-tab-${t.v}`}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none px-6 py-3 font-bold"
            >
              {t.l}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="orders" className="py-6">
          {orders.length === 0 ? (
            <div className="text-center text-zinc-500 p-10">暂无订单</div>
          ) : (
            <div className="overflow-auto border border-zinc-200">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr className="text-left">
                    <Th>订单号</Th>
                    <Th>用户</Th>
                    <Th>商品</Th>
                    <Th>金额</Th>
                    <Th>支付</Th>
                    <Th>状态</Th>
                    <Th>操作</Th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-zinc-200 hover:bg-zinc-50">
                      <Td className="font-mono text-xs">{o.order_number}</Td>
                      <Td>
                        <div className="text-xs">{o.user_email}</div>
                        {o.contact_telegram && (
                          <div className="text-[10px] text-zinc-500">{o.contact_telegram}</div>
                        )}
                      </Td>
                      <Td className="text-xs">
                        {o.items.map((i) => `${i.title}×${i.quantity}`).join(", ")}
                      </Td>
                      <Td className="font-mono">{formatCNY(o.total)}</Td>
                      <Td className="text-xs">
                        <div>{o.payment_network}</div>
                        {o.tx_hash && (
                          <div className="font-mono text-[10px] text-zinc-500 truncate max-w-[120px]">
                            {o.tx_hash}
                          </div>
                        )}
                      </Td>
                      <Td>
                        <span className="font-mono text-[10px] tracking-widest border border-zinc-300 px-2 py-1">
                          {o.status.toUpperCase()}
                        </span>
                      </Td>
                      <Td>
                        <button
                          onClick={() => {
                            setEditingOrder(o);
                            setCreds(o.credentials || "");
                            setOrderStatus(o.status === "pending" ? "paid" : "delivered");
                          }}
                          data-testid={`edit-order-${o.order_number}`}
                          className="text-blue-600 text-xs hover:underline"
                        >
                          处理
                        </button>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="products" className="py-6">
          <div className="flex justify-end mb-4">
            <Button
              onClick={() =>
                setEditingProduct({
                  _isNew: true,
                  handle: "",
                  title: "",
                  description: "",
                  sku: "",
                  price: 0,
                  quantity: 100,
                  category: "AI Tools",
                  image_url: "",
                  plan_tier: "Pro",
                  brand: "",
                  duration: "1个月",
                  featured: false,
                  discount_pct: 0,
                })
              }
              data-testid="new-product-btn"
              className="rounded-none bg-zinc-900 hover:bg-blue-600 text-white h-10"
            >
              <Plus className="w-4 h-4 mr-1" /> 新建商品
            </Button>
          </div>
          <div className="overflow-auto border border-zinc-200">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr className="text-left">
                  <Th>商品</Th>
                  <Th>分类</Th>
                  <Th>价格</Th>
                  <Th>套餐</Th>
                  <Th>精选</Th>
                  <Th>操作</Th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-zinc-200 hover:bg-zinc-50">
                    <Td>
                      <div className="font-bold text-xs">{p.title}</div>
                      <div className="font-mono text-[10px] text-zinc-500">{p.handle}</div>
                    </Td>
                    <Td className="text-xs">{p.category}</Td>
                    <Td className="font-mono">{formatCNY(p.price)}</Td>
                    <Td className="text-xs">{p.plan_tier}</Td>
                    <Td className="text-xs">{p.featured ? "✓" : ""}</Td>
                    <Td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingProduct({ ...p })}
                          className="text-blue-600 hover:underline text-xs inline-flex items-center gap-1"
                          data-testid={`edit-prod-${p.handle}`}
                        >
                          <Pencil className="w-3 h-3" /> 编辑
                        </button>
                        <button
                          onClick={() => deleteProduct(p.handle)}
                          className="text-red-600 hover:underline text-xs inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> 删除
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="wallets" className="py-6 space-y-4">
          {wallets.map((w) => (
            <WalletEditor key={w.network} wallet={w} onSave={updateWallet} />
          ))}
        </TabsContent>

        <TabsContent value="contacts" className="py-6">
          {contacts.length === 0 ? (
            <div className="text-center text-zinc-500 p-10">暂无消息</div>
          ) : (
            <div className="space-y-3">
              {contacts.map((c) => (
                <div key={c.id} className="border border-zinc-200 p-4">
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span className="font-bold text-zinc-900">
                      {c.name} · {c.email}
                    </span>
                    <span className="font-mono">
                      {new Date(c.created_at).toLocaleString("zh-CN")}
                    </span>
                  </div>
                  <div className="font-bold mt-2 text-sm">{c.subject}</div>
                  <p className="text-sm text-zinc-700 mt-1">{c.message}</p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Order modal */}
      <Dialog open={!!editingOrder} onOpenChange={(o) => !o && setEditingOrder(null)}>
        <DialogContent className="rounded-none">
          <DialogHeader>
            <DialogTitle>处理订单 {editingOrder?.order_number}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs">状态</Label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                data-testid="order-status-select"
                className="w-full h-10 mt-2 border border-zinc-300 px-3 text-sm"
              >
                <option value="pending">PENDING</option>
                <option value="paid">PAID (审核中)</option>
                <option value="delivered">DELIVERED (已发货)</option>
                <option value="cancelled">CANCELLED</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">交付凭据 (账号 / 激活码)</Label>
              <Textarea
                rows={5}
                value={creds}
                onChange={(e) => setCreds(e.target.value)}
                placeholder="账号: ..&#10;密码: .."
                data-testid="order-creds-input"
                className="rounded-none border-zinc-300 mt-2 font-mono text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={updateOrder}
              data-testid="save-order-btn"
              className="rounded-none bg-blue-600 hover:bg-blue-700 text-white"
            >
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product modal */}
      <Dialog open={!!editingProduct} onOpenChange={(o) => !o && setEditingProduct(null)}>
        <DialogContent className="rounded-none max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingProduct?._isNew ? "新建" : "编辑"}商品</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="grid grid-cols-2 gap-4">
              <Field label="Handle (slug)" v={editingProduct.handle} disabled={!editingProduct._isNew}
                onChange={(v) => setEditingProduct({ ...editingProduct, handle: v })} />
              <Field label="标题" v={editingProduct.title}
                onChange={(v) => setEditingProduct({ ...editingProduct, title: v })} />
              <Field label="品牌" v={editingProduct.brand}
                onChange={(v) => setEditingProduct({ ...editingProduct, brand: v })} />
              <Field label="套餐" v={editingProduct.plan_tier}
                onChange={(v) => setEditingProduct({ ...editingProduct, plan_tier: v })} />
              <Field label="价格 (CNY)" type="number" v={editingProduct.price}
                onChange={(v) => setEditingProduct({ ...editingProduct, price: parseFloat(v) || 0 })} />
              <Field label="折扣 %" type="number" v={editingProduct.discount_pct}
                onChange={(v) => setEditingProduct({ ...editingProduct, discount_pct: parseInt(v) || 0 })} />
              <div>
                <Label className="text-xs">分类</Label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full h-10 mt-2 border border-zinc-300 px-3 text-sm"
                >
                  <option>AI Tools</option>
                  <option>Software</option>
                  <option>Premium</option>
                  <option>Gift</option>
                </select>
              </div>
              <Field label="时长" v={editingProduct.duration}
                onChange={(v) => setEditingProduct({ ...editingProduct, duration: v })} />
              <div className="col-span-2">
                <Field label="图片 URL" v={editingProduct.image_url}
                  onChange={(v) => setEditingProduct({ ...editingProduct, image_url: v })} />
              </div>
              <div className="col-span-2">
                <Label className="text-xs">描述</Label>
                <Textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="rounded-none border-zinc-300 mt-2"
                />
              </div>
              <label className="flex items-center gap-2 col-span-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!editingProduct.featured}
                  onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                />
                精选商品
              </label>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => saveProduct(editingProduct)}
              data-testid="save-product-btn"
              className="rounded-none bg-blue-600 hover:bg-blue-700 text-white"
            >
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
function Th({ children }) { return <th className="px-3 py-2 label-eyebrow whitespace-nowrap">{children}</th>; }
function Td({ children, className = "" }) { return <td className={`px-3 py-3 align-top ${className}`}>{children}</td>; }
function Field({ label, v, onChange, type = "text", disabled }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Input
        type={type}
        value={v ?? ""}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-none border-zinc-300 mt-2 h-10"
      />
    </div>
  );
}

function WalletEditor({ wallet, onSave }) {
  const [w, setW] = useState(wallet);
  return (
    <div className="border border-zinc-200 p-5 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
      <div className="md:col-span-2">
        <Label className="text-xs">网络</Label>
        <Input
          disabled
          value={w.network}
          className="rounded-none border-zinc-300 mt-2 h-10 font-mono"
        />
      </div>
      <div className="md:col-span-2">
        <Label className="text-xs">币种</Label>
        <Input
          value={w.coin}
          onChange={(e) => setW({ ...w, coin: e.target.value })}
          className="rounded-none border-zinc-300 mt-2 h-10 font-mono"
        />
      </div>
      <div className="md:col-span-7">
        <Label className="text-xs">钱包地址</Label>
        <Input
          value={w.address}
          data-testid={`wallet-${w.network}`}
          onChange={(e) => setW({ ...w, address: e.target.value })}
          className="rounded-none border-zinc-300 mt-2 h-10 font-mono text-xs"
        />
      </div>
      <Button
        onClick={() => onSave(w)}
        data-testid={`save-wallet-${w.network}`}
        className="rounded-none md:col-span-1 bg-zinc-900 hover:bg-blue-600 text-white h-10"
      >
        保存
      </Button>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, formatCNY } from "../lib/api";
import { useCart } from "../contexts/CartContext";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { toast } from "sonner";
import { Star, ShieldCheck, Zap, MessageCircle, Mail, Bot } from "lucide-react";

export default function Product() {
  const { handle } = useParams();
  const { add } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let active = true;
    api.get(`/products/${handle}`).then(async (r) => {
      if (!active) return;
      setProduct(r.data);
      const [rev, all] = await Promise.all([
        api.get("/reviews", { params: { product_id: r.data.id } }),
        api.get("/products", { params: { category: r.data.category, limit: 8 } }),
      ]);
      if (!active) return;
      setReviews(rev.data);
      setRelated(all.data.filter((p) => p.handle !== handle).slice(0, 4));
    });
    return () => {
      active = false;
    };
  }, [handle]);

  if (!product) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-32 text-center text-zinc-500">
        加载中...
      </div>
    );
  }

  const hasDiscount = product.discount_pct > 0;
  const finalPrice = hasDiscount
    ? product.price * (1 - product.discount_pct / 100)
    : product.price;

  const onAdd = () => {
    add({ ...product, price: finalPrice }, qty);
    toast.success(`已加入购物车: ${product.title} × ${qty}`);
  };

  const avg =
    reviews.length > 0
      ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0";

  return (
    <div data-testid={`product-${handle}`} className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10">
      <div className="text-xs font-mono tracking-widest text-zinc-500 mb-6">
        <Link to="/" className="hover:text-blue-600">HOME</Link> /{" "}
        <Link to="/store" className="hover:text-blue-600">STORE</Link> /{" "}
        {product.brand?.toUpperCase()} / {product.title.toUpperCase()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-6 border border-zinc-200 bg-zinc-50">
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full aspect-[4/3] object-cover"
          />
          <div className="grid grid-cols-3 border-t border-zinc-200 divide-x divide-zinc-200">
            <Mini icon={ShieldCheck} label="正版授权" />
            <Mini icon={Zap} label="5min 交付" />
            <Mini icon={Bot} label="7×24 客服" />
          </div>
        </div>

        <div className="md:col-span-6 space-y-5">
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest">
            <span className="border border-zinc-300 px-2 py-1">{product.brand?.toUpperCase()}</span>
            <span className="border border-zinc-300 px-2 py-1">{product.plan_tier}</span>
            <span className="border border-zinc-300 px-2 py-1">{product.duration}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
            {product.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i <= Math.round(avg) ? "fill-yellow-400 text-yellow-400" : "text-zinc-300"
                  }`}
                />
              ))}
            </div>
            <span className="font-bold">{avg}</span>
            <span className="text-zinc-400">({reviews.length} 条评价)</span>
            <span className="text-zinc-400">· SKU {product.sku}</span>
          </div>
          <p className="text-zinc-700 leading-relaxed">{product.description}</p>

          <div className="border-t border-b border-zinc-200 py-5 flex items-end gap-3">
            <div className="text-4xl font-black font-mono tracking-tight">
              {formatCNY(finalPrice)}
            </div>
            {hasDiscount && (
              <>
                <div className="text-sm text-zinc-400 line-through font-mono">
                  {formatCNY(product.price)}
                </div>
                <div className="bg-blue-600 text-white text-[10px] font-mono tracking-widest px-2 py-1">
                  -{product.discount_pct}%
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center border border-zinc-300">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-12 hover:bg-zinc-100 text-lg"
                data-testid="qty-decrease"
              >
                −
              </button>
              <span data-testid="qty-value" className="w-12 text-center font-mono">
                {qty}
              </span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-10 h-12 hover:bg-zinc-100 text-lg"
                data-testid="qty-increase"
              >
                +
              </button>
            </div>
            <Button
              onClick={onAdd}
              data-testid="product-add-cart"
              className="rounded-none flex-1 bg-zinc-900 hover:bg-blue-600 text-white h-12 text-sm font-medium"
            >
              加入购物车
            </Button>
            <Link to="/cart" data-testid="product-buy-now" className="flex-1">
              <Button
                onClick={onAdd}
                className="rounded-none w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-sm font-medium"
              >
                立即购买
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 border border-zinc-200">
            <InfoCell label="交付方式" value="自动邮件 / Telegram" />
            <InfoCell label="支付方式" value="USDT · ETH · SOL · LTC" />
            <InfoCell label="使用时长" value={product.duration} />
            <InfoCell label="售后保障" value="掉号免费补发" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="desc" className="mt-16">
        <TabsList className="bg-transparent border-b border-zinc-200 rounded-none w-full justify-start gap-0 h-auto p-0">
          {[
            { v: "desc", l: "商品详情" },
            { v: "delivery", l: "交付与售后" },
            { v: "reviews", l: `用户评价 (${reviews.length})` },
          ].map((t) => (
            <TabsTrigger
              key={t.v}
              value={t.v}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none px-6 py-3 font-bold"
            >
              {t.l}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="desc" className="py-8 text-zinc-700 leading-relaxed space-y-3">
          <p>
            <strong>{product.title}</strong> · 由 {product.brand} 官方推出，包含
            {product.plan_tier} 套餐的全部权益。
          </p>
          <p>{product.description}</p>
          <ul className="list-disc list-inside text-sm space-y-1 pt-2">
            <li>正版官方账号 · 100% 稳定可用</li>
            <li>支付完成 5 分钟内自动通过邮箱 / Telegram 发送账号信息</li>
            <li>掉号、封号免费补发，保障订单完整使用周期</li>
            <li>支持团购批量采购，企业可开发票</li>
          </ul>
        </TabsContent>

        <TabsContent value="delivery" className="py-8 space-y-4 text-sm">
          <div className="flex gap-3 items-start">
            <Mail className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <div className="font-bold">邮件自动发货</div>
              <p className="text-zinc-600">
                下单时填写的邮箱将在支付确认后 5 分钟内收到账号 / 激活码。
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <MessageCircle className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <div className="font-bold">Telegram 即时推送</div>
              <p className="text-zinc-600">
                绑定 Telegram 用户名可获得交易状态实时推送，下单 → 支付 → 发货全流程通知。
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <ShieldCheck className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <div className="font-bold">售后保障</div>
              <p className="text-zinc-600">
                如出现账号异常，请通过客户支持页面或 Telegram @xiaoya_ai 反馈，我们将免费补发或全额退款。
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="py-8 space-y-4">
          {reviews.length === 0 ? (
            <div className="text-zinc-500 text-sm">暂无评价。购买后可来留言~</div>
          ) : (
            reviews.map((r) => (
              <div
                key={r.id}
                className="border border-zinc-200 p-5 flex flex-col sm:flex-row sm:items-start gap-4"
              >
                <div className="w-12 h-12 bg-zinc-900 text-white grid place-items-center font-bold shrink-0">
                  {(r.user_name || "U").slice(0, 1).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="font-bold">{r.user_name}</div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-zinc-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-zinc-700 mt-1">{r.comment}</p>
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-black tracking-tight mb-6">同类推荐</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-zinc-200 [&>*]:border-r [&>*]:border-b [&>*:nth-child(4n)]:border-r-0">
            {related.map((p) => (
              <ProductCardSimple key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Mini({ icon: Icon, label }) {
  return (
    <div className="flex flex-col items-center gap-1 py-3 text-xs">
      <Icon className="w-4 h-4 text-blue-600" />
      <span className="text-zinc-700 font-medium">{label}</span>
    </div>
  );
}

function InfoCell({ label, value }) {
  return (
    <div className="border-b border-r border-zinc-200 last:border-r-0 [&:nth-child(2n)]:border-r-0 p-4">
      <div className="text-[10px] font-mono tracking-widest text-zinc-500">{label}</div>
      <div className="text-sm font-bold mt-1">{value}</div>
    </div>
  );
}

function ProductCardSimple({ product }) {
  return (
    <Link
      to={`/product/${product.handle}`}
      className="bg-white p-5 hover-lift flex flex-col gap-3"
    >
      <div className="aspect-[4/3] bg-zinc-50 overflow-hidden border border-zinc-200">
        <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
      </div>
      <div className="font-bold text-sm">{product.title}</div>
      <div className="text-blue-600 font-mono font-bold">{formatCNY(product.price)}</div>
    </Link>
  );
}

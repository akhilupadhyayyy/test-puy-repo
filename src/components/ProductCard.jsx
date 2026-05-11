import { Link } from "react-router-dom";
import { Bot, Sparkles, Cpu, Zap, Image as ImageIcon, Video, Code2, Wand2 } from "lucide-react";
import { Button } from "./ui/button";
import { formatCNY } from "../lib/api";
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner";

const BRAND_ICON = {
  ChatGPT: Bot,
  Claude: Sparkles,
  Grok: Zap,
  Gemini: Sparkles,
  Cursor: Code2,
  Sora: Video,
  Heygen: Video,
  "Kling AI": Video,
  "Krea AI": ImageIcon,
  Higgsfield: Wand2,
  "Microsoft Copilot": Cpu,
};

export default function ProductCard({ product, compact = false }) {
  const { add } = useCart();
  const Icon = BRAND_ICON[product.brand] || Bot;
  const hasDiscount = product.discount_pct > 0;
  const finalPrice = hasDiscount
    ? product.price * (1 - product.discount_pct / 100)
    : product.price;

  const onAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    add({ ...product, price: finalPrice }, 1);
    toast.success(`已加入购物车: ${product.title}`);
  };

  return (
    <Link
      to={`/product/${product.handle}`}
      data-testid={`product-card-${product.handle}`}
      className="group relative flex flex-col bg-white border border-zinc-200 hover-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-50 border-b border-zinc-200">
        <img
          src={product.image_url}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="bg-white border border-zinc-300 text-[10px] font-mono tracking-widest px-2 py-1 inline-flex items-center gap-1">
            <Icon className="w-3 h-3" /> {product.brand?.toUpperCase()}
          </span>
          {hasDiscount && (
            <span className="bg-blue-600 text-white text-[10px] font-mono tracking-widest px-2 py-1">
              -{product.discount_pct}% OFF
            </span>
          )}
          {product.featured && (
            <span className="bg-zinc-900 text-white text-[10px] font-mono tracking-widest px-2 py-1">
              ★ HOT
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col p-5 gap-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold text-base leading-snug group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
        </div>
        {!compact && (
          <p className="text-xs text-zinc-600 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-zinc-500">
          <span>{product.plan_tier}</span>
          <span className="w-1 h-1 bg-zinc-400 rounded-full" />
          <span>{product.duration}</span>
        </div>
        <div className="mt-auto pt-3 flex items-end justify-between border-t border-zinc-100">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black font-mono tracking-tight">
              {formatCNY(finalPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-zinc-400 line-through font-mono">
                {formatCNY(product.price)}
              </span>
            )}
          </div>
          <Button
            onClick={onAdd}
            data-testid={`add-cart-${product.handle}`}
            className="rounded-none bg-zinc-900 hover:bg-blue-600 text-white text-xs font-medium h-9 px-4"
          >
            加入购物车
          </Button>
        </div>
      </div>
    </Link>
  );
}

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { api } from "../lib/api";

const CATEGORY_MAP = {
  "ai-tools": { value: "AI Tools", label: "AI 工具", desc: "ChatGPT, Claude, Gemini, Grok 等顶级模型订阅" },
  software: { value: "Software", label: "软件订阅", desc: "Cursor, Copilot 等开发者必备工具" },
  premium: { value: "Premium", label: "高级账户", desc: "Sora, Heygen 等高端创作套餐" },
  gift: { value: "Gift", label: "礼品卡", desc: "数字礼品与即时交付链接" },
};

export default function Category() {
  const { slug } = useParams();
  const meta = CATEGORY_MAP[slug] || CATEGORY_MAP["ai-tools"];
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products", { params: { category: meta.value } }).then((r) => setProducts(r.data));
  }, [meta.value]);

  return (
    <div data-testid={`category-${slug}`} className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10">
      <div className="text-xs font-mono tracking-widest text-zinc-500 mb-3">
        <Link to="/" className="hover:text-blue-600">HOME</Link> / <Link to="/store" className="hover:text-blue-600">STORE</Link> / {slug.toUpperCase()}
      </div>
      <div className="border-b border-zinc-200 pb-6 mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">{meta.label}</h1>
        <p className="text-zinc-600 mt-2 text-sm">{meta.desc}</p>
      </div>

      {products.length === 0 ? (
        <div className="border border-zinc-200 p-16 text-center text-zinc-500">
          该分类暂无商品。
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-zinc-200 [&>*]:border-r [&>*]:border-b [&>*:nth-child(4n)]:border-r-0">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

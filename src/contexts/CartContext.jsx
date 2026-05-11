import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const KEY = "xy_cart_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const add = (product, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.product_id === product.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [
        ...prev,
        {
          product_id: product.id,
          handle: product.handle,
          title: product.title,
          price: product.price,
          image_url: product.image_url,
          plan_tier: product.plan_tier,
          brand: product.brand,
          quantity: qty,
        },
      ];
    });
  };

  const remove = (product_id) =>
    setItems((prev) => prev.filter((i) => i.product_id !== product_id));

  const setQty = (product_id, quantity) =>
    setItems((prev) =>
      prev.map((i) => (i.product_id === product_id ? { ...i, quantity: Math.max(1, quantity) } : i))
    );

  const clear = () => setItems([]);

  const total = useMemo(
    () => items.reduce((acc, i) => acc + Number(i.price) * Number(i.quantity), 0),
    [items]
  );
  const count = useMemo(() => items.reduce((acc, i) => acc + i.quantity, 0), [items]);

  return (
    <CartContext.Provider value={{ items, add, remove, setQty, clear, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

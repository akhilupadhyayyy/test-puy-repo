import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, Search, Menu, X, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useI18n } from "../contexts/I18nContext";
import LanguageSwitcher from "./LanguageSwitcher";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const linkKeys = [
  { to: "/", key: "nav.home" },
  { to: "/store", key: "nav.store" },
  { to: "/categories/ai-tools", key: "nav.ai-tools" },
  { to: "/categories/software", key: "nav.software" },
  { to: "/categories/premium", key: "nav.premium" },
  { to: "/how-it-works", key: "nav.how" },
  { to: "/support", key: "nav.support" },
];

export default function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { t } = useI18n();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const onSearch = (e) => {
    e.preventDefault();
    if (q.trim()) nav(`/store?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header
      data-testid="site-header"
      className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-zinc-200"
    >
      <div className="bg-zinc-900 text-zinc-100 text-[11px] font-mono tracking-widest">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-2 flex items-center justify-between">
          <span data-testid="topbar-slogan" className="truncate">
            // {t("slogan.short")}
          </span>
          <span className="hidden sm:flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-blue-400" /> {t("topbar.secure")}
          </span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" data-testid="brand-logo" className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 bg-zinc-900 text-white grid place-items-center font-black tracking-tighter">
              小雅
            </div>
            <div className="leading-tight hidden sm:block">
              <div className="font-black text-base">{t("brand.name")}</div>
              <div className="text-[10px] font-mono tracking-widest text-zinc-500">
                {t("brand.tagline")}
              </div>
            </div>
          </Link>

          <form
            onSubmit={onSearch}
            data-testid="search-form"
            className="hidden md:flex flex-1 max-w-xl items-center border border-zinc-300 focus-within:border-blue-600 transition-colors"
          >
            <Search className="w-4 h-4 mx-3 text-zinc-500" />
            <Input
              data-testid="search-input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("search.placeholder")}
              className="border-0 rounded-none focus-visible:ring-0 h-10"
            />
            <button
              type="submit"
              data-testid="search-submit"
              className="bg-zinc-900 text-white text-sm font-medium px-5 h-10 hover:bg-blue-600 transition-colors"
            >
              {t("search.submit")}
            </button>
          </form>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            {user ? (
              <>
                <Link
                  to="/account"
                  data-testid="account-link"
                  className="hidden sm:flex items-center gap-1 text-sm text-zinc-700 hover:text-blue-600 px-3 py-2"
                >
                  <User className="w-4 h-4" /> {user.name || user.email.split("@")[0]}
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    data-testid="admin-link"
                    className="hidden sm:inline-flex text-xs font-mono tracking-widest border border-zinc-900 px-2 py-1 hover:bg-zinc-900 hover:text-white"
                  >
                    ADMIN
                  </Link>
                )}
                <button
                  data-testid="logout-btn"
                  onClick={() => {
                    logout();
                    nav("/");
                  }}
                  className="hidden sm:inline-flex p-2 text-zinc-500 hover:text-zinc-900"
                  aria-label={t("nav.logout")}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <Link to="/login" data-testid="login-link">
                <Button
                  variant="ghost"
                  className="rounded-none text-sm hidden sm:inline-flex"
                >
                  {t("nav.login")}
                </Button>
              </Link>
            )}
            <Link
              to="/cart"
              data-testid="cart-link"
              className="relative inline-flex items-center justify-center w-10 h-10 border border-zinc-300 hover:border-blue-600 hover:text-blue-600"
            >
              <ShoppingCart className="w-4 h-4" />
              {count > 0 && (
                <span
                  data-testid="cart-count"
                  className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 grid place-items-center"
                >
                  {count}
                </span>
              )}
            </Link>
            <button
              data-testid="mobile-menu-btn"
              className="md:hidden p-2"
              onClick={() => setOpen((s) => !s)}
              aria-label="menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <nav
          data-testid="primary-nav"
          className="hidden md:flex items-center gap-6 h-11 border-t border-zinc-200"
        >
          {linkKeys.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              data-testid={`nav-${l.key}`}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? "text-blue-600" : "text-zinc-600 hover:text-zinc-900"
                }`
              }
            >
              {t(l.key)}
            </NavLink>
          ))}
        </nav>
      </div>

      {open && (
        <div className="md:hidden border-t border-zinc-200 bg-white">
          <div className="px-4 py-2 flex flex-col">
            {linkKeys.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-3 border-b border-zinc-100 text-sm"
                data-testid={`mobile-nav-${l.key}`}
              >
                {t(l.key)}
              </Link>
            ))}
            {!user && (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="py-3 text-sm text-blue-600 font-medium"
              >
                {t("nav.login")}
              </Link>
            )}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-mono tracking-widest"
              >
                {t("nav.admin")}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

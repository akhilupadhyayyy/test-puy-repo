import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "./ui/sonner";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-900">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}

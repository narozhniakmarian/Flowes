import { LanguageProvider } from "@/providers/LanguageProvider";
import { CartProvider } from "@/providers/CartProvider";
import { CartDrawer } from "@/components/Cart/CartDrawer";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { ContactButton } from "@/components/ContactButton/ContactButton";
import { ScrollToTop } from "@/components/ScrollToTop/ScrollToTop";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <CartProvider>
        <Header />
        <CartDrawer />
        {children}
        <Footer />
        <ContactButton />
        <ScrollToTop />
      </CartProvider>
    </LanguageProvider>
  );
}

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CompareProvider } from "@/hooks/useCompare";
import CompareBar from "@/components/CompareBar";
import Index from "./pages/Index";
import MobilePhones from "./pages/MobilePhones";
import Tablets from "./pages/Tablets";
import Accessories from "./pages/Accessories";
import SpecialOffersPage from "./pages/SpecialOffersPage";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ProductDetail from "./pages/ProductDetail";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import Admin from "./pages/Admin";
import Compare from "./pages/Compare";
import Search from "./pages/Search";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CompareProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/mobile-phones" element={<MobilePhones />} />
            <Route path="/tablets" element={<Tablets />} />
            <Route path="/accessories" element={<Accessories />} />
            <Route path="/special-offers" element={<SpecialOffersPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/search" element={<Search />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CompareBar />
        </BrowserRouter>
      </CompareProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

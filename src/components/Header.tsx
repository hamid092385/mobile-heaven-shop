import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, User, Heart, Phone, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import OrderTrackingModal from "./OrderTrackingModal";

const navItems = [
  { label: "صفحه اصلی", path: "/" },
  { label: "گوشی موبایل", path: "/mobile-phones" },
  { label: "تبلت", path: "/tablets" },
  { label: "لوازم جانبی", path: "/accessories" },
  { label: "پیشنهادات ویژه", path: "/special-offers" },
  { label: "تماس با ما", path: "/contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount, isLoggedIn } = useCart();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-card border-b border-border/50">
      {/* Top Bar */}
      <div className="bg-secondary/50 py-2">
        <div className="container flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-muted-foreground">
            <span>ارسال رایگان برای خریدهای بالای ۲ میلیون تومان</span>
          </div>
          <div className="flex items-center gap-4">
            <OrderTrackingModal />
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center neon-glow">
              <Phone className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">موبایل مارکت</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form 
              className="relative w-full"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const input = form.querySelector('input') as HTMLInputElement;
                if (input.value.trim()) {
                  navigate(`/search?q=${encodeURIComponent(input.value.trim())}`);
                }
              }}
            >
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="جستجوی گوشی، برند یا مدل..."
                className="w-full pr-10 bg-secondary/50 border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl"
              />
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="hidden md:flex hover:bg-secondary">
              <Heart className="h-5 w-5" />
            </Button>
            
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden md:flex hover:bg-secondary">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="text-muted-foreground text-sm">
                    {user?.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">سفارشات من</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="h-4 w-4 ml-2" />
                    خروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="icon" className="hidden md:flex hover:bg-secondary">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
            
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative hover:bg-secondary">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -left-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <form 
            className="relative"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const input = form.querySelector('input') as HTMLInputElement;
              if (input.value.trim()) {
                navigate(`/search?q=${encodeURIComponent(input.value.trim())}`);
              }
            }}
          >
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="جستجو..."
              className="w-full pr-10 bg-secondary/50 border-border/50 rounded-xl"
            />
          </form>
        </div>
      </div>

      {/* Navigation */}
      <nav className="hidden md:block border-t border-border/30">
        <div className="container">
          <ul className="flex items-center gap-8 py-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === item.path ? "text-primary" : "text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass-card border-t border-border/30 animate-slide-up">
          <nav className="container py-4">
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={`block py-2 transition-colors hover:text-primary ${
                      location.pathname === item.path ? "text-primary" : "text-foreground"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {!isLoggedIn && (
                <li>
                  <Link 
                    to="/auth" 
                    className="block py-2 text-primary font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ورود / ثبت‌نام
                  </Link>
                </li>
              )}
              {isLoggedIn && (
                <li>
                  <button 
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="block py-2 text-destructive"
                  >
                    خروج از حساب
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

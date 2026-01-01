import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, ArrowRight, Save, Package, Lock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProducts, Product } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/formatPrice";
import { toPersianDate } from "@/lib/persianDate";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const ADMIN_PASSWORD = "Aa110110";

const Admin = () => {
  const navigate = useNavigate();
  const { data: products, isLoading: productsLoading } = useProducts();
  const queryClient = useQueryClient();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    const savedAuth = sessionStorage.getItem("admin_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
      toast.success("ورود موفقیت‌آمیز");
    } else {
      toast.error("رمز عبور اشتباه است");
    }
  };

  const updatePrice = useMutation({
    mutationFn: async ({ productId, price }: { productId: string; price: number }) => {
      const { error } = await supabase
        .from("products")
        .update({ price, price_updated_at: new Date().toISOString() })
        .eq("id", productId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("قیمت بروزرسانی شد");
      setEditingId(null);
      setNewPrice("");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSavePrice = (productId: string) => {
    const price = parseInt(newPrice.replace(/,/g, ""));
    if (isNaN(price) || price <= 0) {
      toast.error("لطفاً قیمت معتبر وارد کنید");
      return;
    }
    updatePrice.mutate({ productId, price });
  };

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 p-4">
          <div className="w-full max-w-md p-8 rounded-2xl bg-card border border-border shadow-lg">
            <div className="text-center mb-8">
              <Lock className="h-16 w-16 text-primary mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground">ورود به پنل مدیریت</h1>
              <p className="text-muted-foreground mt-2">رمز عبور را وارد کنید</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور"
                className="text-center"
                autoFocus
              />
              <Button type="submit" className="w-full btn-primary">
                ورود
              </Button>
            </form>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>پنل مدیریت | موبایل مارکت</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary">صفحه اصلی</Link>
            <ArrowRight className="h-4 w-4 rotate-180" />
            <span className="text-foreground">پنل مدیریت</span>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-8">پنل مدیریت محصولات</h1>

          {productsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {products?.map((product) => (
                <div
                  key={product.id}
                  className="p-4 rounded-2xl bg-surface-light border border-border/50 flex flex-col md:flex-row md:items-center gap-4"
                >
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-20 h-20 object-contain rounded-xl bg-surface-lighter"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                    {product.price_updated_at && (
                      <p className="text-xs text-muted-foreground mt-1">
                        آخرین بروزرسانی: {toPersianDate(product.price_updated_at)}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {editingId === product.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          placeholder="قیمت جدید"
                          className="w-32"
                          dir="ltr"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSavePrice(product.id)}
                          disabled={updatePrice.isPending}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(null);
                            setNewPrice("");
                          }}
                        >
                          انصراف
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="text-lg font-bold text-primary">
                          {formatPrice(product.price)} تومان
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(product.id);
                            setNewPrice(String(product.price));
                          }}
                        >
                          ویرایش قیمت
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Admin;

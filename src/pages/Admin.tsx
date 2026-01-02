import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, ArrowRight, Save, Package, Lock, LogOut, Plus, X, Trash2, Key } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const DEFAULT_PASSWORD = "Aa110110";
const PASSWORD_STORAGE_KEY = "admin_password";

const Admin = () => {
  const navigate = useNavigate();
  const { data: products, isLoading: productsLoading } = useProducts();
  const queryClient = useQueryClient();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    name_en: "",
    brand: "",
    category: "mobile",
    price: "",
    image_url: "",
  });

  const getAdminPassword = () => {
    return localStorage.getItem(PASSWORD_STORAGE_KEY) || DEFAULT_PASSWORD;
  };

  useEffect(() => {
    const savedAuth = sessionStorage.getItem("admin_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === getAdminPassword()) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
      toast.success("ورود موفقیت‌آمیز");
    } else {
      toast.error("رمز عبور اشتباه است");
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentPassword !== getAdminPassword()) {
      toast.error("رمز عبور فعلی اشتباه است");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("رمز عبور جدید باید حداقل ۶ کاراکتر باشد");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("رمز عبور جدید و تکرار آن مطابقت ندارند");
      return;
    }
    
    localStorage.setItem(PASSWORD_STORAGE_KEY, newPassword);
    toast.success("رمز عبور با موفقیت تغییر کرد");
    setShowChangePassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
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

  const addProduct = useMutation({
    mutationFn: async () => {
      const price = parseInt(newProduct.price.replace(/,/g, ""));
      if (isNaN(price) || price <= 0) {
        throw new Error("لطفاً قیمت معتبر وارد کنید");
      }
      if (!newProduct.name || !newProduct.brand) {
        throw new Error("لطفاً نام و برند محصول را وارد کنید");
      }
      
      const { error } = await supabase.from("products").insert({
        name: newProduct.name,
        name_en: newProduct.name_en || null,
        brand: newProduct.brand,
        category: newProduct.category,
        price: price,
        image_url: newProduct.image_url || null,
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("محصول جدید اضافه شد");
      setShowAddForm(false);
      setNewProduct({
        name: "",
        name_en: "",
        brand: "",
        category: "mobile",
        price: "",
        image_url: "",
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("محصول حذف شد");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
    toast.success("از پنل مدیریت خارج شدید");
  };

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

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold text-foreground">پنل مدیریت محصولات</h1>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setShowAddForm(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                افزودن محصول
              </Button>
              <Button variant="outline" onClick={() => setShowChangePassword(true)} className="gap-2">
                <Key className="h-4 w-4" />
                تغییر رمز
              </Button>
              <Button variant="outline" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                خروج
              </Button>
            </div>
          </div>

          {/* Change Password Form */}
          {showChangePassword && (
            <div className="mb-8 p-6 rounded-2xl bg-surface-light border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">تغییر رمز عبور</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowChangePassword(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <Input
                  type="password"
                  placeholder="رمز عبور فعلی"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="رمز عبور جدید"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="تکرار رمز عبور جدید"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button type="submit">ذخیره رمز جدید</Button>
              </form>
            </div>
          )}

          {/* Add Product Form */}
          {showAddForm && (
            <div className="mb-8 p-6 rounded-2xl bg-surface-light border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">افزودن محصول جدید</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="نام محصول (فارسی)"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
                <Input
                  placeholder="نام محصول (انگلیسی)"
                  value={newProduct.name_en}
                  onChange={(e) => setNewProduct({ ...newProduct, name_en: e.target.value })}
                  dir="ltr"
                />
                <Input
                  placeholder="برند"
                  value={newProduct.brand}
                  onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                />
                <Select
                  value={newProduct.category}
                  onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="دسته‌بندی" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mobile">موبایل</SelectItem>
                    <SelectItem value="tablet">تبلت</SelectItem>
                    <SelectItem value="accessory">لوازم جانبی</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="قیمت (تومان)"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  dir="ltr"
                />
                <Input
                  placeholder="لینک تصویر"
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                  dir="ltr"
                />
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={() => addProduct.mutate()} disabled={addProduct.isPending}>
                  {addProduct.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "ذخیره محصول"}
                </Button>
              </div>
            </div>
          )}

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
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>آیا مطمئن هستید؟</AlertDialogTitle>
                              <AlertDialogDescription>
                                این عمل قابل بازگشت نیست. محصول "{product.name}" برای همیشه حذف خواهد شد.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>انصراف</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteProduct.mutate(product.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                حذف
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link, Navigate } from "react-router-dom";
import { Loader2, ArrowRight, Save, Lock, LogOut, Plus, X, Trash2, Edit } from "lucide-react";
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
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface EditProduct {
  id: string;
  name: string;
  name_en: string;
  brand: string;
  category: string;
  price: string;
  original_price: string;
  discount_percent: string;
  image_url: string;
  in_stock: boolean;
  is_featured: boolean;
  is_special_offer: boolean;
}

const Admin = () => {
  const { data: products, isLoading: productsLoading } = useProducts();
  const queryClient = useQueryClient();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const { user, loading: authLoading, signOut } = useAuth();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<EditProduct | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    name_en: "",
    brand: "",
    category: "mobile",
    price: "",
    original_price: "",
    discount_percent: "",
    image_url: "",
    in_stock: true,
    is_featured: false,
    is_special_offer: false,
  });

  const updateProduct = useMutation({
    mutationFn: async (product: EditProduct) => {
      const price = parseInt(product.price.replace(/,/g, ""));
      const originalPrice = product.original_price ? parseInt(product.original_price.replace(/,/g, "")) : null;
      const discountPercent = product.discount_percent ? parseInt(product.discount_percent) : null;
      
      if (isNaN(price) || price <= 0) {
        throw new Error("لطفاً قیمت معتبر وارد کنید");
      }
      if (!product.name || !product.brand) {
        throw new Error("لطفاً نام و برند محصول را وارد کنید");
      }
      
      const { error } = await supabase
        .from("products")
        .update({
          name: product.name,
          name_en: product.name_en || null,
          brand: product.brand,
          category: product.category,
          price: price,
          original_price: originalPrice,
          discount_percent: discountPercent,
          image_url: product.image_url || null,
          in_stock: product.in_stock,
          is_featured: product.is_featured,
          is_special_offer: product.is_special_offer,
          price_updated_at: new Date().toISOString(),
        })
        .eq("id", product.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("محصول بروزرسانی شد");
      setEditingProduct(null);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const addProduct = useMutation({
    mutationFn: async () => {
      const price = parseInt(newProduct.price.replace(/,/g, ""));
      const originalPrice = newProduct.original_price ? parseInt(newProduct.original_price.replace(/,/g, "")) : null;
      const discountPercent = newProduct.discount_percent ? parseInt(newProduct.discount_percent) : null;
      
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
        original_price: originalPrice,
        discount_percent: discountPercent,
        image_url: newProduct.image_url || null,
        in_stock: newProduct.in_stock,
        is_featured: newProduct.is_featured,
        is_special_offer: newProduct.is_special_offer,
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
        original_price: "",
        discount_percent: "",
        image_url: "",
        in_stock: true,
        is_featured: false,
        is_special_offer: false,
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

  const handleLogout = async () => {
    await signOut();
    toast.success("از پنل مدیریت خارج شدید");
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct({
      id: product.id,
      name: product.name,
      name_en: product.name_en || "",
      brand: product.brand,
      category: product.category,
      price: String(product.price),
      original_price: product.original_price ? String(product.original_price) : "",
      discount_percent: product.discount_percent ? String(product.discount_percent) : "",
      image_url: product.image_url || "",
      in_stock: product.in_stock ?? true,
      is_featured: product.is_featured ?? false,
      is_special_offer: product.is_special_offer ?? false,
    });
  };

  // Loading state
  if (authLoading || adminLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
        <Footer />
      </>
    );
  }

  // Not logged in - redirect to auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Not admin - show unauthorized message
  if (!isAdmin) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 p-4">
          <div className="w-full max-w-md p-8 rounded-2xl bg-card border border-border shadow-lg text-center">
            <Lock className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">دسترسی محدود</h1>
            <p className="text-muted-foreground mb-6">
              شما دسترسی ادمین ندارید. این صفحه فقط برای مدیران سایت قابل دسترسی است.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              ایمیل فعلی: {user.email}
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 ml-2" />
                خروج از حساب
              </Button>
              <Link to="/">
                <Button>بازگشت به صفحه اصلی</Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const ProductForm = ({ 
    data, 
    onChange, 
    onSubmit, 
    isPending,
    submitLabel 
  }: { 
    data: typeof newProduct;
    onChange: (data: typeof newProduct) => void;
    onSubmit: () => void;
    isPending: boolean;
    submitLabel: string;
  }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        placeholder="نام محصول (فارسی)"
        value={data.name}
        onChange={(e) => onChange({ ...data, name: e.target.value })}
      />
      <Input
        placeholder="نام محصول (انگلیسی)"
        value={data.name_en}
        onChange={(e) => onChange({ ...data, name_en: e.target.value })}
        dir="ltr"
      />
      <Input
        placeholder="برند"
        value={data.brand}
        onChange={(e) => onChange({ ...data, brand: e.target.value })}
      />
      <Select
        value={data.category}
        onValueChange={(value) => onChange({ ...data, category: value })}
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
        value={data.price}
        onChange={(e) => onChange({ ...data, price: e.target.value })}
        dir="ltr"
      />
      <Input
        placeholder="قیمت اصلی (تومان) - اختیاری"
        value={data.original_price}
        onChange={(e) => onChange({ ...data, original_price: e.target.value })}
        dir="ltr"
      />
      <Input
        placeholder="درصد تخفیف - اختیاری"
        value={data.discount_percent}
        onChange={(e) => onChange({ ...data, discount_percent: e.target.value })}
        dir="ltr"
        type="number"
        min="0"
        max="100"
      />
      <Input
        placeholder="لینک تصویر"
        value={data.image_url}
        onChange={(e) => onChange({ ...data, image_url: e.target.value })}
        dir="ltr"
      />
      <div className="md:col-span-2 flex flex-wrap gap-6">
        <div className="flex items-center space-x-2 space-x-reverse">
          <Checkbox
            id="in_stock"
            checked={data.in_stock}
            onCheckedChange={(checked) => onChange({ ...data, in_stock: !!checked })}
          />
          <Label htmlFor="in_stock">موجود در انبار</Label>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <Checkbox
            id="is_featured"
            checked={data.is_featured}
            onCheckedChange={(checked) => onChange({ ...data, is_featured: !!checked })}
          />
          <Label htmlFor="is_featured">محصول ویژه</Label>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <Checkbox
            id="is_special_offer"
            checked={data.is_special_offer}
            onCheckedChange={(checked) => onChange({ ...data, is_special_offer: !!checked })}
          />
          <Label htmlFor="is_special_offer">پیشنهاد شگفت‌انگیز</Label>
        </div>
      </div>
      <div className="md:col-span-2 flex justify-end">
        <Button onClick={onSubmit} disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : submitLabel}
        </Button>
      </div>
    </div>
  );

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
            <div>
              <h1 className="text-3xl font-bold text-foreground">پنل مدیریت محصولات</h1>
              <p className="text-sm text-muted-foreground mt-1">
                وارد شده به عنوان: {user.email}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setShowAddForm(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                افزودن محصول
              </Button>
              <Button variant="outline" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                خروج
              </Button>
            </div>
          </div>

          {/* Add Product Form */}
          {showAddForm && (
            <div className="mb-8 p-6 rounded-2xl bg-surface-light border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">افزودن محصول جدید</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ProductForm
                data={newProduct}
                onChange={setNewProduct}
                onSubmit={() => addProduct.mutate()}
                isPending={addProduct.isPending}
                submitLabel="ذخیره محصول"
              />
            </div>
          )}

          {/* Edit Product Dialog */}
          <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>ویرایش محصول</DialogTitle>
              </DialogHeader>
              {editingProduct && (
                <ProductForm
                  data={editingProduct}
                  onChange={(data) => setEditingProduct(data as EditProduct)}
                  onSubmit={() => updateProduct.mutate(editingProduct)}
                  isPending={updateProduct.isPending}
                  submitLabel="ذخیره تغییرات"
                />
              )}
            </DialogContent>
          </Dialog>

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
                    <p className="text-sm text-muted-foreground">{product.brand} • {product.category}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {product.in_stock === false && (
                        <span className="text-xs px-2 py-0.5 bg-destructive/10 text-destructive rounded">ناموجود</span>
                      )}
                      {product.is_featured && (
                        <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">ویژه</span>
                      )}
                      {product.is_special_offer && (
                        <span className="text-xs px-2 py-0.5 bg-accent/10 text-accent-foreground rounded">پیشنهاد</span>
                      )}
                      {product.discount_percent && product.discount_percent > 0 && (
                        <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-600 rounded">%{product.discount_percent} تخفیف</span>
                      )}
                    </div>
                    {product.price_updated_at && (
                      <p className="text-xs text-muted-foreground mt-1">
                        آخرین بروزرسانی: {toPersianDate(product.price_updated_at)}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-left">
                      <div className="text-lg font-bold text-primary">
                        {formatPrice(product.price)} تومان
                      </div>
                      {product.original_price && (
                        <div className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.original_price)} تومان
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(product)}
                      className="gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      ویرایش
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

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { MapPin, Phone, FileText, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice } from "@/lib/formatPrice";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
  const { cartItems, cartTotal, clearCart, isLoggedIn } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    notes: "",
  });

  if (!isLoggedIn) {
    return (
      <>
        <Helmet>
          <title>تکمیل خرید | موبایل مارکت</title>
        </Helmet>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container py-16">
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <h1 className="text-2xl font-bold mb-4">برای تکمیل خرید وارد شوید</h1>
              <Link to="/auth">
                <Button className="btn-primary">ورود / ثبت‌نام</Button>
              </Link>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  if (cartItems.length === 0 && !orderComplete) {
    navigate("/cart");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.address) {
      toast({ title: "لطفاً تمام فیلدها را پر کنید", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user!.id,
          total_amount: cartTotal,
          phone: formData.phone,
          shipping_address: formData.address,
          notes: formData.notes || null,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product?.price || 0,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      await clearCart.mutateAsync();

      setOrderComplete(true);
      toast({ title: "سفارش شما با موفقیت ثبت شد" });
    } catch (error) {
      console.error("Order error:", error);
      toast({ title: "خطا در ثبت سفارش", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <>
        <Helmet>
          <title>سفارش ثبت شد | موبایل مارکت</title>
        </Helmet>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container py-16">
            <div className="max-w-md mx-auto text-center">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold mb-4">سفارش شما ثبت شد!</h1>
              <p className="text-muted-foreground mb-8">
                سفارش شما با موفقیت ثبت شد و به زودی با شما تماس گرفته خواهد شد.
              </p>
              <Link to="/">
                <Button className="btn-primary">بازگشت به صفحه اصلی</Button>
              </Link>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>تکمیل خرید | موبایل مارکت</title>
        <meta name="description" content="تکمیل فرآیند خرید در موبایل مارکت" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <h1 className="text-3xl font-bold mb-8">تکمیل خرید</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-6">
                <h2 className="text-xl font-bold">اطلاعات ارسال</h2>

                <div className="space-y-2">
                  <Label htmlFor="phone">شماره تماس</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pr-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">آدرس</Label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Textarea
                      id="address"
                      placeholder="آدرس کامل با کد پستی"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="pr-10 min-h-[100px]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">توضیحات (اختیاری)</Label>
                  <div className="relative">
                    <FileText className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Textarea
                      id="notes"
                      placeholder="توضیحات اضافی برای سفارش..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="pr-10"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "ثبت سفارش"
                  )}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-2xl p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">خلاصه سفارش</h2>

                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg bg-secondary/50 flex-shrink-0 overflow-hidden">
                        <img
                          src={item.product?.image_url || "/placeholder.svg"}
                          alt={item.product?.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{item.product?.name}</p>
                        <p className="text-xs text-muted-foreground">{item.quantity} عدد</p>
                        <p className="text-sm text-primary">
                          {formatPrice((item.product?.price || 0) * item.quantity)} تومان
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>مبلغ کل</span>
                    <span className="text-primary">{formatPrice(cartTotal)} تومان</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Checkout;

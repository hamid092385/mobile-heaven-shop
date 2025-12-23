import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { MapPin, Phone, FileText, Loader2, CheckCircle, CreditCard, Calendar, Lock } from "lucide-react";
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

const generateTrackingNumber = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'TRK-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const Checkout = () => {
  const { cartItems, cartTotal, clearCart, isLoggedIn } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    notes: "",
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
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

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.address) {
      toast({ title: "لطفاً تمام فیلدها را پر کنید", variant: "destructive" });
      return;
    }
    
    setStep('payment');
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentData.cardNumber || !paymentData.expiry || !paymentData.cvv || !paymentData.cardName) {
      toast({ title: "لطفاً اطلاعات کارت را کامل وارد کنید", variant: "destructive" });
      return;
    }

    setLoading(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

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
          status: "paid",
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

      setTrackingNumber(generateTrackingNumber());
      setOrderComplete(true);
      toast({ title: "پرداخت با موفقیت انجام شد" });
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
          <title>پرداخت موفق | موبایل مارکت</title>
        </Helmet>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container py-16">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold mb-4 text-green-500">پرداخت موفق!</h1>
              <p className="text-muted-foreground mb-6">
                سفارش شما با موفقیت ثبت و پرداخت شد.
              </p>
              
              <div className="glass-card rounded-2xl p-6 mb-8">
                <p className="text-sm text-muted-foreground mb-2">کد پیگیری سفارش</p>
                <p className="text-2xl font-mono font-bold text-primary tracking-wider">
                  {trackingNumber}
                </p>
                <p className="text-xs text-muted-foreground mt-4">
                  این کد را برای پیگیری سفارش خود نگه دارید
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/">
                  <Button className="btn-primary w-full sm:w-auto">بازگشت به صفحه اصلی</Button>
                </Link>
                <Link to="/orders">
                  <Button variant="outline" className="w-full sm:w-auto">مشاهده سفارشات</Button>
                </Link>
              </div>
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

          {/* Steps Indicator */}
          <div className="flex items-center justify-center mb-8 gap-4">
            <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-primary' : 'text-green-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'shipping' ? 'bg-primary text-primary-foreground' : 'bg-green-500 text-white'}`}>
                {step === 'payment' ? <CheckCircle className="h-5 w-5" /> : '1'}
              </div>
              <span className="font-medium">اطلاعات ارسال</span>
            </div>
            <div className="w-12 h-0.5 bg-border" />
            <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                2
              </div>
              <span className="font-medium">پرداخت</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              {step === 'shipping' ? (
                <form onSubmit={handleShippingSubmit} className="glass-card rounded-2xl p-6 space-y-6">
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

                  <Button type="submit" className="w-full btn-primary">
                    ادامه به پرداخت
                  </Button>
                </form>
              ) : (
                <form onSubmit={handlePaymentSubmit} className="glass-card rounded-2xl p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">اطلاعات پرداخت</h2>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => setStep('shipping')}
                      className="text-sm"
                    >
                      ویرایش آدرس
                    </Button>
                  </div>

                  <div className="bg-secondary/30 rounded-lg p-4 text-sm">
                    <p className="text-muted-foreground">این یک درگاه پرداخت آزمایشی است</p>
                    <p className="font-mono mt-1">شماره کارت تست: 4242 4242 4242 4242</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">شماره کارت</Label>
                    <div className="relative">
                      <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="cardNumber"
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        value={paymentData.cardNumber}
                        onChange={(e) => setPaymentData({ ...paymentData, cardNumber: formatCardNumber(e.target.value) })}
                        className="pr-10 font-mono tracking-wider"
                        maxLength={19}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">تاریخ انقضا</Label>
                      <div className="relative">
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="expiry"
                          type="text"
                          placeholder="MM/YY"
                          value={paymentData.expiry}
                          onChange={(e) => setPaymentData({ ...paymentData, expiry: formatExpiry(e.target.value) })}
                          className="pr-10 font-mono"
                          maxLength={5}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="cvv"
                          type="text"
                          placeholder="123"
                          value={paymentData.cvv}
                          onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                          className="pr-10 font-mono"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardName">نام روی کارت</Label>
                    <Input
                      id="cardName"
                      type="text"
                      placeholder="JOHN DOE"
                      value={paymentData.cardName}
                      onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value.toUpperCase() })}
                      className="uppercase"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin ml-2" />
                        در حال پردازش...
                      </>
                    ) : (
                      `پرداخت ${formatPrice(cartTotal)} تومان`
                    )}
                  </Button>
                </form>
              )}
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

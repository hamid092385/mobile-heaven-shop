import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Trash2, Minus, Plus, ShoppingBag, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/formatPrice";

const Cart = () => {
  const { cartItems, isLoading, cartTotal, updateQuantity, removeFromCart, isLoggedIn } = useCart();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return (
      <>
        <Helmet>
          <title>سبد خرید | موبایل مارکت</title>
        </Helmet>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container py-16">
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <ShoppingBag className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-4">برای مشاهده سبد خرید وارد شوید</h1>
              <p className="text-muted-foreground mb-6">
                برای اضافه کردن محصولات به سبد خرید باید وارد حساب کاربری خود شوید
              </p>
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

  return (
    <>
      <Helmet>
        <title>سبد خرید | موبایل مارکت</title>
        <meta name="description" content="سبد خرید شما در موبایل مارکت" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <h1 className="text-3xl font-bold mb-8">سبد خرید</h1>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <ShoppingBag className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">سبد خرید خالی است</h2>
              <p className="text-muted-foreground mb-6">
                محصولات مورد نظر خود را به سبد خرید اضافه کنید
              </p>
              <Link to="/mobile-phones">
                <Button className="btn-primary">مشاهده محصولات</Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="glass-card rounded-2xl p-4 flex gap-4"
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 rounded-xl bg-secondary/50 flex-shrink-0 overflow-hidden">
                      <img
                        src={item.product?.image_url || "/placeholder.svg"}
                        alt={item.product?.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground line-clamp-1">
                        {item.product?.name}
                      </h3>
                      <p className="text-sm text-primary">{item.product?.brand}</p>
                      <div className="text-lg font-bold text-primary mt-2">
                        {formatPrice(item.product?.price || 0)} تومان
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeFromCart.mutate(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity.mutate({
                              itemId: item.id,
                              quantity: item.quantity - 1,
                            })
                          }
                          className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity.mutate({
                              itemId: item.id,
                              quantity: item.quantity + 1,
                            })
                          }
                          className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="glass-card rounded-2xl p-6 sticky top-24">
                  <h2 className="text-xl font-bold mb-6">خلاصه سفارش</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-muted-foreground">
                      <span>تعداد کالاها</span>
                      <span>{cartItems.reduce((c, i) => c + i.quantity, 0)} عدد</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>مجموع</span>
                      <span>{formatPrice(cartTotal)} تومان</span>
                    </div>
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>مبلغ قابل پرداخت</span>
                        <span className="text-primary">{formatPrice(cartTotal)} تومان</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full btn-primary gap-2"
                    onClick={() => navigate("/checkout")}
                  >
                    ادامه خرید
                    <ArrowRight className="h-4 w-4 rotate-180" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Cart;

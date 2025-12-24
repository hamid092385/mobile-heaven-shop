import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Package, Clock, CheckCircle, Truck, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice } from "@/lib/formatPrice";
import { Loader2 } from "lucide-react";

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="h-5 w-5 text-yellow-500" />,
  paid: <CheckCircle className="h-5 w-5 text-green-500" />,
  processing: <Package className="h-5 w-5 text-blue-500" />,
  shipped: <Truck className="h-5 w-5 text-primary" />,
  delivered: <CheckCircle className="h-5 w-5 text-green-500" />,
};

const statusLabels: Record<string, string> = {
  pending: "در انتظار پرداخت",
  paid: "پرداخت شده",
  processing: "در حال پردازش",
  shipped: "ارسال شده",
  delivered: "تحویل داده شده",
};

const Orders = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { data: orders, isLoading } = useOrders();

  if (authLoading) {
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

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
          <Package className="h-16 w-16 text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground">برای مشاهده سفارشات وارد شوید</h1>
          <Link to="/auth">
            <Button className="btn-primary">ورود به حساب</Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>تاریخچه سفارشات | موبایل مارکت</title>
        <meta name="description" content="مشاهده و پیگیری سفارشات خود" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary">صفحه اصلی</Link>
            <ArrowRight className="h-4 w-4 rotate-180" />
            <span className="text-foreground">تاریخچه سفارشات</span>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-8">تاریخچه سفارشات</h1>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : !orders || orders.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <Package className="h-20 w-20 text-muted-foreground mx-auto" />
              <h2 className="text-xl font-bold text-foreground">هنوز سفارشی ثبت نکرده‌اید</h2>
              <p className="text-muted-foreground">با خرید اولین محصول، سفارش شما اینجا نمایش داده می‌شود</p>
              <Link to="/">
                <Button className="btn-primary mt-4">مشاهده محصولات</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="p-6 rounded-2xl bg-surface-light border border-border/50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      {statusIcons[order.status] || statusIcons.pending}
                      <div>
                        <div className="font-bold text-foreground">
                          سفارش #{order.id.slice(0, 8).toUpperCase()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('fa-IR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        order.status === 'paid' || order.status === 'delivered' 
                          ? 'bg-green-500/10 text-green-500'
                          : order.status === 'pending'
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : 'bg-primary/10 text-primary'
                      }`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/30">
                    <div>
                      <span className="text-sm text-muted-foreground">مبلغ کل</span>
                      <div className="font-bold text-primary">{formatPrice(order.total_amount)} تومان</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">آدرس ارسال</span>
                      <div className="text-foreground line-clamp-1">{order.shipping_address}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">شماره تماس</span>
                      <div className="text-foreground" dir="ltr">{order.phone}</div>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="mt-4 pt-4 border-t border-border/30">
                      <span className="text-sm text-muted-foreground">یادداشت: </span>
                      <span className="text-foreground">{order.notes}</span>
                    </div>
                  )}
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

export default Orders;

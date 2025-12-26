import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { User, Package, Settings, LogOut, ArrowRight, Loader2, Edit, Check, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useOrders } from "@/hooks/useOrders";
import { formatPrice } from "@/lib/formatPrice";

const statusLabels: Record<string, string> = {
  pending: "در انتظار پرداخت",
  paid: "پرداخت شده",
  processing: "در حال پردازش",
  shipped: "ارسال شده",
  delivered: "تحویل داده شده",
};

const Profile = () => {
  const { isAuthenticated, loading: authLoading, user, signOut } = useAuth();
  const { profile, isLoading: profileLoading, updateProfile } = useProfile();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
  });

  const handleEdit = () => {
    setFormData({
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateProfile.mutate(formData);
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (authLoading || profileLoading) {
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
          <User className="h-16 w-16 text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground">برای مشاهده پروفایل وارد شوید</h1>
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
        <title>پروفایل کاربری | موبایل مارکت</title>
        <meta name="description" content="مدیریت حساب کاربری و پیگیری سفارشات" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary">صفحه اصلی</Link>
            <ArrowRight className="h-4 w-4 rotate-180" />
            <span className="text-foreground">پروفایل کاربری</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="p-6 rounded-2xl bg-surface-light border border-border/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-foreground">{profile?.full_name || "کاربر"}</h2>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link to="/orders" className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors">
                    <Package className="h-5 w-5 text-primary" />
                    <span>سفارشات من</span>
                  </Link>
                  <Link to="/wishlist" className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors">
                    <Settings className="h-5 w-5 text-primary" />
                    <span>لیست علاقه‌مندی</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-destructive/10 text-destructive transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>خروج از حساب</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Info */}
              <div className="p-6 rounded-2xl bg-surface-light border border-border/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">اطلاعات حساب</h2>
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={handleEdit}>
                      <Edit className="h-4 w-4 ml-2" />
                      ویرایش
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSave} disabled={updateProfile.isPending}>
                        <Check className="h-4 w-4 ml-2" />
                        ذخیره
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">نام کامل</label>
                      <Input
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        placeholder="نام و نام خانوادگی"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">شماره تماس</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">آدرس</label>
                      <Textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="آدرس کامل"
                        rows={3}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-border/30">
                      <span className="text-muted-foreground">نام کامل</span>
                      <span className="text-foreground">{profile?.full_name || "-"}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border/30">
                      <span className="text-muted-foreground">ایمیل</span>
                      <span className="text-foreground" dir="ltr">{user?.email}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border/30">
                      <span className="text-muted-foreground">شماره تماس</span>
                      <span className="text-foreground" dir="ltr">{profile?.phone || "-"}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-muted-foreground">آدرس</span>
                      <span className="text-foreground max-w-xs text-left">{profile?.address || "-"}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Orders */}
              <div className="p-6 rounded-2xl bg-surface-light border border-border/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">سفارشات اخیر</h2>
                  <Link to="/orders">
                    <Button variant="link" className="text-primary">
                      مشاهده همه
                    </Button>
                  </Link>
                </div>

                {ordersLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : !orders || orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">هنوز سفارشی ندارید</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="p-4 rounded-xl bg-secondary/30 flex items-center justify-between">
                        <div>
                          <div className="font-medium text-foreground">
                            سفارش #{order.id.slice(0, 8).toUpperCase()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString('fa-IR')}
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-primary">{formatPrice(order.total_amount)} تومان</div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            order.status === 'delivered' 
                              ? 'bg-green-500/10 text-green-500'
                              : order.status === 'pending'
                              ? 'bg-yellow-500/10 text-yellow-500'
                              : 'bg-primary/10 text-primary'
                          }`}>
                            {statusLabels[order.status] || order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Profile;

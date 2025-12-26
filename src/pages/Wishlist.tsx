import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Heart, Loader2, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice } from "@/lib/formatPrice";

const Wishlist = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { wishlistItems, isLoading, removeFromWishlist } = useWishlist();

  if (authLoading || isLoading) {
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
          <Heart className="h-16 w-16 text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground">برای مشاهده علاقه‌مندی‌ها وارد شوید</h1>
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
        <title>لیست علاقه‌مندی | موبایل مارکت</title>
        <meta name="description" content="محصولات مورد علاقه شما" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <h1 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Heart className="h-8 w-8 text-primary" />
            لیست علاقه‌مندی
          </h1>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <Heart className="h-20 w-20 text-muted-foreground mx-auto" />
              <h2 className="text-xl font-bold text-foreground">لیست علاقه‌مندی شما خالی است</h2>
              <p className="text-muted-foreground">محصولات مورد علاقه خود را اینجا ذخیره کنید</p>
              <Link to="/">
                <Button className="btn-primary mt-4">مشاهده محصولات</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-surface-light border border-border/50">
                  <Link to={`/product/${item.product_id}`}>
                    <div className="aspect-square rounded-xl bg-surface-lighter overflow-hidden mb-4">
                      <img
                        src={item.product?.image_url || "/placeholder.svg"}
                        alt={item.product?.name}
                        className="w-full h-full object-contain p-4 hover:scale-110 transition-transform"
                      />
                    </div>
                    <h3 className="font-bold text-foreground mb-2 line-clamp-2">{item.product?.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{item.product?.brand}</p>
                  </Link>
                  <div className="flex items-center justify-between">
                    <div className="text-primary font-bold">{formatPrice(item.product?.price || 0)} تومان</div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => removeFromWishlist.mutate(item.product_id)}
                      disabled={removeFromWishlist.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

export default Wishlist;

import { Helmet } from "react-helmet";
import { useParams, Link } from "react-router-dom";
import { ArrowRight, Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductReviews from "@/components/ProductReviews";
import { Button } from "@/components/ui/button";
import { useProductById } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { formatPrice } from "@/lib/formatPrice";
import { toPersianDate } from "@/lib/persianDate";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProductById(id || "");
  const { addToCart, isLoggedIn } = useCart();
  const { isInWishlist, toggleWishlist, isLoggedIn: wishlistLoggedIn } = useWishlist();

  const handleAddToCart = () => {
    if (product) {
      addToCart.mutate({ productId: product.id });
    }
  };

  if (isLoading) {
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

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">محصول یافت نشد</h1>
          <Link to="/">
            <Button>بازگشت به صفحه اصلی</Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const specs = product.specs as Record<string, string> | null;

  return (
    <>
      <Helmet>
        <title>{product.name} | موبایل مارکت</title>
        <meta name="description" content={`خرید ${product.name} با بهترین قیمت و گارانتی اصالت`} />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary">صفحه اصلی</Link>
            <ArrowRight className="h-4 w-4 rotate-180" />
            <Link to={`/${product.category === 'mobile' ? 'mobile-phones' : product.category === 'tablet' ? 'tablets' : 'accessories'}`} className="hover:text-primary">
              {product.category === 'mobile' ? 'گوشی موبایل' : product.category === 'tablet' ? 'تبلت' : 'لوازم جانبی'}
            </Link>
            <ArrowRight className="h-4 w-4 rotate-180" />
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="relative">
              <div className="sticky top-24">
                <div className="aspect-square rounded-2xl bg-gradient-to-b from-surface-lighter to-surface-light overflow-hidden">
                  <div className="flex items-center justify-center h-full p-12">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {product.is_featured && (
                    <span className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-full">
                      جدید
                    </span>
                  )}
                  {product.discount_percent && product.discount_percent > 0 && (
                    <span className="px-4 py-2 bg-accent text-accent-foreground text-sm font-bold rounded-full">
                      {product.discount_percent}٪ تخفیف
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <span className="text-primary font-medium">{product.brand}</span>
                <h1 className="text-3xl font-bold text-foreground mt-2">{product.name}</h1>
                {product.name_en && (
                  <p className="text-muted-foreground mt-1">{product.name_en}</p>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating || 0)
                            ? "fill-accent text-accent"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{product.rating}</span>
                </div>
                <span className="text-muted-foreground">({product.reviews_count} نظر)</span>
              </div>

              {/* Price */}
              <div className="p-6 rounded-2xl bg-surface-light border border-border/50">
                <div className="flex items-end gap-4">
                  <div className="text-3xl font-bold text-primary">
                    {formatPrice(product.price)} تومان
                  </div>
                  {product.original_price && (
                    <div className="text-xl text-muted-foreground line-through">
                      {formatPrice(product.original_price)} تومان
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    product.in_stock 
                      ? "bg-green-500/10 text-green-500" 
                      : "bg-red-500/10 text-red-500"
                  }`}>
                    {product.in_stock ? "موجود در انبار" : "ناموجود"}
                  </span>
                  {product.price_updated_at && (
                    <span className="text-xs text-muted-foreground">
                      آخرین بروزرسانی: {toPersianDate(product.price_updated_at)}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                {isLoggedIn ? (
                  <Button 
                    size="lg" 
                    className="btn-primary flex-1 text-lg h-14"
                    onClick={handleAddToCart}
                    disabled={addToCart.isPending || !product.in_stock}
                  >
                    <ShoppingCart className="h-5 w-5 ml-2" />
                    افزودن به سبد خرید
                  </Button>
                ) : (
                  <Link to="/auth" className="flex-1">
                    <Button size="lg" className="btn-primary w-full text-lg h-14">
                      <ShoppingCart className="h-5 w-5 ml-2" />
                      برای خرید وارد شوید
                    </Button>
                  </Link>
                )}
                <Button 
                  size="lg" 
                  variant="outline" 
                  className={`h-14 w-14 ${isInWishlist(product.id) ? "bg-destructive/10 text-destructive border-destructive" : ""}`}
                  onClick={() => wishlistLoggedIn && toggleWishlist(product.id)}
                >
                  <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
                <div className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-surface-light">
                  <Truck className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">ارسال سریع</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-surface-light">
                  <Shield className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">گارانتی اصالت</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-surface-light">
                  <RotateCcw className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">۷ روز ضمانت بازگشت</span>
                </div>
              </div>

              {/* Specs */}
              {specs && Object.keys(specs).length > 0 && (
                <div className="space-y-4 pt-6 border-t border-border/50">
                  <h2 className="text-xl font-bold text-foreground">مشخصات فنی</h2>
                  <div className="space-y-3">
                    {Object.entries(specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-3 border-b border-border/30">
                        <span className="text-muted-foreground capitalize">
                          {key === 'ram' ? 'حافظه رم' : 
                           key === 'storage' ? 'حافظه داخلی' : 
                           key === 'screen' ? 'صفحه نمایش' : 
                           key === 'battery' ? 'باتری' :
                           key === 'camera' ? 'دوربین' : key}
                        </span>
                        <span className="font-medium text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16 pt-8 border-t border-border/50">
            <h2 className="text-2xl font-bold text-foreground mb-8">نظرات و امتیازات</h2>
            <ProductReviews productId={product.id} />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ProductDetail;

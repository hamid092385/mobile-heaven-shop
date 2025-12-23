import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCardNew from "@/components/ProductCardNew";
import { Percent, Loader2 } from "lucide-react";
import { useSpecialOffers } from "@/hooks/useProducts";

const SpecialOffersPage = () => {
  const { data: products, isLoading } = useSpecialOffers();

  return (
    <>
      <Helmet>
        <title>پیشنهادات ویژه | موبایل مارکت</title>
        <meta name="description" content="بهترین تخفیف‌ها و پیشنهادات ویژه گوشی موبایل و لوازم جانبی" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center">
              <Percent className="h-7 w-7 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">پیشنهادات ویژه</h1>
              <p className="text-muted-foreground">
                {products?.length || 0} محصول با تخفیف
              </p>
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProductCardNew product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
              <p className="text-muted-foreground">محصولی یافت نشد</p>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default SpecialOffersPage;

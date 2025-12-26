import { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCardNew from "@/components/ProductCardNew";
import ProductFilters, { FilterState } from "@/components/ProductFilters";
import { Headphones, Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";

const Accessories = () => {
  const { data: products, isLoading } = useProducts("accessory");
  
  const brands = useMemo(() => {
    if (!products) return [];
    return [...new Set(products.map((p) => p.brand))].sort();
  }, [products]);

  const maxPrice = useMemo(() => {
    if (!products || products.length === 0) return 100000000;
    return Math.max(...products.map((p) => p.price));
  }, [products]);

  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    minPrice: 0,
    maxPrice: maxPrice,
    inStockOnly: false,
  });

  useMemo(() => {
    if (maxPrice > 0 && filters.maxPrice === 100000000) {
      setFilters((prev) => ({ ...prev, maxPrice }));
    }
  }, [maxPrice]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((product) => {
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false;
      }
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false;
      }
      if (filters.inStockOnly && !product.in_stock) {
        return false;
      }
      return true;
    });
  }, [products, filters]);

  return (
    <>
      <Helmet>
        <title>لوازم جانبی | موبایل مارکت</title>
        <meta name="description" content="خرید لوازم جانبی گوشی و تبلت با بهترین قیمت و کیفیت" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Headphones className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">لوازم جانبی</h1>
                <p className="text-muted-foreground">
                  {filteredProducts.length} محصول
                </p>
              </div>
            </div>
            <div className="lg:hidden">
              <ProductFilters
                brands={brands}
                filters={filters}
                onFiltersChange={setFilters}
                maxPriceLimit={maxPrice}
              />
            </div>
          </div>

          <div className="flex gap-8">
            <ProductFilters
              brands={brands}
              filters={filters}
              onFiltersChange={setFilters}
              maxPriceLimit={maxPrice}
            />

            <div className="flex-1">
              {isLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product, index) => (
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
                  <p className="text-muted-foreground">محصولی با این فیلترها یافت نشد</p>
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Accessories;

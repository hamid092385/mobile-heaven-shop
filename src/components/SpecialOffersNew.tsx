import ProductCardNew from "./ProductCardNew";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Percent } from "lucide-react";
import { useSpecialOffers } from "@/hooks/useProducts";
import { Link } from "react-router-dom";

const SpecialOffersNew = () => {
  const { data: products, isLoading } = useSpecialOffers();

  return (
    <section className="py-16 bg-gradient-to-b from-background to-secondary/30">
      <div className="container">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center">
              <Percent className="h-7 w-7 text-accent" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-1">پیشنهادات ویژه</h2>
              <p className="text-muted-foreground">بهترین تخفیف‌های این هفته</p>
            </div>
          </div>
          <Link to="/special-offers">
            <Button variant="ghost" className="gap-2 text-accent hover:bg-accent/10">
              مشاهده همه
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products?.slice(0, 4).map((product, index) => (
              <div
                key={product.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCardNew product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SpecialOffersNew;

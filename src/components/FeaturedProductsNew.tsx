import ProductCardNew from "./ProductCardNew";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useFeaturedProducts } from "@/hooks/useProducts";
import { Link } from "react-router-dom";

const FeaturedProductsNew = () => {
  const { data: products, isLoading } = useFeaturedProducts();

  return (
    <section className="py-16">
      <div className="container">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">پرفروش‌ترین گوشی‌ها</h2>
            <p className="text-muted-foreground">محبوب‌ترین انتخاب مشتریان ما</p>
          </div>
          <Link to="/mobile-phones">
            <Button variant="ghost" className="gap-2 text-primary hover:bg-primary/10">
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
            {products?.map((product, index) => (
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

export default FeaturedProductsNew;

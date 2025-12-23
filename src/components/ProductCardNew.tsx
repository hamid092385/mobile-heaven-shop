import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/hooks/useProducts";
import { formatPrice } from "@/lib/formatPrice";
import { useCart } from "@/hooks/useCart";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

const ProductCardNew = ({ product }: ProductCardProps) => {
  const { addToCart, isLoggedIn } = useCart();

  const handleAddToCart = () => {
    addToCart.mutate({ productId: product.id });
  };

  return (
    <div className="product-card group">
      {/* Image Container */}
      <div className="relative aspect-square rounded-xl bg-gradient-to-b from-surface-lighter to-surface-light overflow-hidden mb-4">
        {/* Badges */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          {product.is_featured && (
            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
              جدید
            </span>
          )}
          {product.discount_percent && product.discount_percent > 0 && (
            <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-full">
              {product.discount_percent}٪ تخفیف
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground">
          <Heart className="h-4 w-4" />
        </button>

        {/* Product Image */}
        <div className="flex items-center justify-center h-full p-8">
          <img
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-primary font-medium">{product.brand}</span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-accent text-accent" />
            <span className="text-xs text-muted-foreground">
              {product.rating} ({product.reviews_count})
            </span>
          </div>
        </div>

        <h3 className="font-bold text-foreground line-clamp-2 min-h-[3rem]">{product.name}</h3>

        <div className="flex items-end justify-between">
          <div>
            <div className="text-lg font-bold text-primary">{formatPrice(product.price)} تومان</div>
            {product.original_price && (
              <div className="text-sm text-muted-foreground line-through">
                {formatPrice(product.original_price)} تومان
              </div>
            )}
          </div>
          {isLoggedIn ? (
            <Button 
              size="icon" 
              className="btn-primary rounded-xl h-10 w-10"
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          ) : (
            <Link to="/auth">
              <Button size="icon" className="btn-primary rounded-xl h-10 w-10">
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCardNew;

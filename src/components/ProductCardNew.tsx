import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/hooks/useProducts";
import { formatPrice } from "@/lib/formatPrice";
import { toPersianDate } from "@/lib/persianDate";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

const ProductCardNew = ({ product }: ProductCardProps) => {
  const { addToCart, isLoggedIn } = useCart();
  const { isInWishlist, toggleWishlist, isLoggedIn: wishlistLoggedIn } = useWishlist();

  const handleAddToCart = () => {
    addToCart.mutate({ productId: product.id });
  };

  return (
    <Link to={`/product/${product.id}`} className="block">
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
          <button 
            className={`absolute top-3 left-3 z-10 w-9 h-9 rounded-full backdrop-blur flex items-center justify-center transition-all ${
              isInWishlist(product.id) 
                ? "bg-destructive text-white" 
                : "bg-background/80 opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-primary-foreground"
            }`}
            onClick={(e) => {
              e.preventDefault();
              if (wishlistLoggedIn) toggleWishlist(product.id);
            }}
          >
            <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
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

          <div className="space-y-2">
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
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCart();
                  }}
                  disabled={addToCart.isPending}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  size="icon" 
                  className="btn-primary rounded-xl h-10 w-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              )}
            </div>
            {product.price_updated_at && (
              <div className="text-xs text-muted-foreground">
                آخرین بروزرسانی: {toPersianDate(product.price_updated_at)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCardNew;

import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  name: string;
  brand: string;
  price: string;
  originalPrice?: string;
  discount?: number;
  rating: number;
  reviews: number;
  image: string;
  isNew?: boolean;
}

const ProductCard = ({
  name,
  brand,
  price,
  originalPrice,
  discount,
  rating,
  reviews,
  image,
  isNew,
}: ProductCardProps) => {
  return (
    <div className="product-card group">
      {/* Image Container */}
      <div className="relative aspect-square rounded-xl bg-gradient-to-b from-surface-lighter to-surface-light overflow-hidden mb-4">
        {/* Badges */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          {isNew && (
            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
              جدید
            </span>
          )}
          {discount && (
            <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-full">
              {discount}٪ تخفیف
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
            src={image}
            alt={name}
            className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-primary font-medium">{brand}</span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-accent text-accent" />
            <span className="text-xs text-muted-foreground">
              {rating} ({reviews})
            </span>
          </div>
        </div>

        <h3 className="font-bold text-foreground line-clamp-2 min-h-[3rem]">{name}</h3>

        <div className="flex items-end justify-between">
          <div>
            <div className="text-lg font-bold text-primary">{price} تومان</div>
            {originalPrice && (
              <div className="text-sm text-muted-foreground line-through">
                {originalPrice} تومان
              </div>
            )}
          </div>
          <Button size="icon" className="btn-primary rounded-xl h-10 w-10">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

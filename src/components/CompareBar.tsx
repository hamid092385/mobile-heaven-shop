import { Link } from "react-router-dom";
import { X, GitCompare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/hooks/useCompare";
import { formatPrice } from "@/lib/formatPrice";

const CompareBar = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  if (compareItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg">
      <div className="container py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-primary shrink-0">
            <GitCompare className="h-5 w-5" />
            <span className="font-bold">مقایسه ({compareItems.length}/4)</span>
          </div>
          
          <div className="flex-1 flex items-center gap-3 overflow-x-auto pb-2">
            {compareItems.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-light border border-border/50 shrink-0"
              >
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  className="w-10 h-10 object-contain rounded-lg bg-surface-lighter"
                />
                <div className="max-w-32">
                  <p className="text-sm font-medium text-foreground truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-primary">
                    {formatPrice(product.price)} تومان
                  </p>
                </div>
                <button
                  onClick={() => removeFromCompare(product.id)}
                  className="p-1 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCompare}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 ml-1" />
              پاک کردن
            </Button>
            <Link to="/compare">
              <Button size="sm" className="btn-primary">
                مقایسه کن
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareBar;

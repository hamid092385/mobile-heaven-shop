import { useState } from "react";
import { Filter, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { formatPrice } from "@/lib/formatPrice";

export interface FilterState {
  brands: string[];
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
}

interface ProductFiltersProps {
  brands: string[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  maxPriceLimit: number;
}

const ProductFilters = ({
  brands,
  filters,
  onFiltersChange,
  maxPriceLimit,
}: ProductFiltersProps) => {
  const [brandOpen, setBrandOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [stockOpen, setStockOpen] = useState(true);

  const handleBrandToggle = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFiltersChange({ ...filters, brands: newBrands });
  };

  const handlePriceChange = (values: number[]) => {
    onFiltersChange({ ...filters, minPrice: values[0], maxPrice: values[1] });
  };

  const handleStockToggle = (checked: boolean) => {
    onFiltersChange({ ...filters, inStockOnly: checked });
  };

  const clearFilters = () => {
    onFiltersChange({
      brands: [],
      minPrice: 0,
      maxPrice: maxPriceLimit,
      inStockOnly: false,
    });
  };

  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.minPrice > 0 ||
    filters.maxPrice < maxPriceLimit ||
    filters.inStockOnly;

  const FilterContent = () => (
    <div className="space-y-6">
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="w-full text-destructive hover:text-destructive"
        >
          <X className="h-4 w-4 ml-2" />
          پاک کردن فیلترها
        </Button>
      )}

      {/* Brand Filter */}
      <Collapsible open={brandOpen} onOpenChange={setBrandOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
          <span className="font-medium">برند</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${brandOpen ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-3">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors"
            >
              <Checkbox
                checked={filters.brands.includes(brand)}
                onCheckedChange={() => handleBrandToggle(brand)}
              />
              <span>{brand}</span>
            </label>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Price Filter */}
      <Collapsible open={priceOpen} onOpenChange={setPriceOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
          <span className="font-medium">محدوده قیمت</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${priceOpen ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-4">
          <Slider
            value={[filters.minPrice, filters.maxPrice]}
            min={0}
            max={maxPriceLimit}
            step={1000000}
            onValueChange={handlePriceChange}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              از {formatPrice(filters.minPrice)} تومان
            </span>
            <span className="text-muted-foreground">
              تا {formatPrice(filters.maxPrice)} تومان
            </span>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Stock Filter */}
      <Collapsible open={stockOpen} onOpenChange={setStockOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
          <span className="font-medium">وضعیت موجودی</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${stockOpen ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <label className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors">
            <Checkbox
              checked={filters.inStockOnly}
              onCheckedChange={(checked) => handleStockToggle(checked as boolean)}
            />
            <span>فقط کالاهای موجود</span>
          </label>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 p-6 rounded-2xl bg-surface-light border border-border/50">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            فیلترها
          </h2>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filters */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              فیلترها
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-card border-border">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                فیلترها
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default ProductFilters;

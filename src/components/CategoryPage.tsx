import { useState, useMemo, useEffect, ReactNode } from "react";
import { Helmet } from "react-helmet";
import { LucideIcon, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCardNew from "@/components/ProductCardNew";
import ProductFilters, { FilterState } from "@/components/ProductFilters";
import {
  useProductsByGroup,
  CATEGORY_GROUPS,
  CategoryGroupKey,
  categoryMatchesSub,
} from "@/hooks/useProducts";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

interface CategoryPageProps {
  groupKey: CategoryGroupKey;
  title: string;
  description: string;
  icon: LucideIcon;
  metaTitle?: string;
  metaDescription?: string;
  children?: ReactNode;
}

const PAGE_SIZE = 12;

const CategoryPage = ({
  groupKey,
  title,
  description,
  icon: Icon,
  metaTitle,
  metaDescription,
}: CategoryPageProps) => {
  const { data: products, isLoading } = useProductsByGroup(groupKey);
  const subs = CATEGORY_GROUPS[groupKey].subs;

  const [activeSub, setActiveSub] = useState<string>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setActiveSub("all");
    setPage(1);
  }, [groupKey]);

  const brands = useMemo(() => {
    if (!products) return [];
    return [...new Set(products.map((p) => p.brand).filter(Boolean))].sort();
  }, [products]);

  const maxPrice = useMemo(() => {
    if (!products || products.length === 0) return 100_000_000;
    return Math.max(...products.map((p) => p.price));
  }, [products]);

  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    minPrice: 0,
    maxPrice: 100_000_000,
    inStockOnly: false,
  });

  useEffect(() => {
    if (maxPrice > 0 && filters.maxPrice === 100_000_000) {
      setFilters((prev) => ({ ...prev, maxPrice }));
    }
  }, [maxPrice]); // eslint-disable-line react-hooks/exhaustive-deps

  const subCounts = useMemo(() => {
    const map: Record<string, number> = {};
    (products ?? []).forEach((p) => {
      const n = normalizeCategory(p.category ?? "");
      subs.forEach((s) => {
        if (normalizeCategory(s) === n) map[s] = (map[s] ?? 0) + 1;
      });
    });
    return map;
  }, [products, subs]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((product) => {
      if (
        activeSub !== "all" &&
        normalizeCategory(product.category ?? "") !== normalizeCategory(activeSub)
      ) {
        return false;
      }
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false;
      }
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false;
      }
      if (filters.inStockOnly && !product.in_stock) return false;
      return true;
    });
  }, [products, filters, activeSub]);

  useEffect(() => {
    setPage(1);
  }, [activeSub, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const pageNumbers = useMemo(() => {
    const pages: (number | "…")[] = [];
    const push = (n: number | "…") => pages.push(n);
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) push(i);
    } else {
      push(1);
      if (currentPage > 3) push("…");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) push(i);
      if (currentPage < totalPages - 2) push("…");
      push(totalPages);
    }
    return pages;
  }, [totalPages, currentPage]);

  return (
    <>
      <Helmet>
        <title>{metaTitle ?? `${title} | موبایل مارکت`}</title>
        <meta name="description" content={metaDescription ?? description} />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          {/* Hero */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Icon className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{title}</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  {description} • {filteredProducts.length} محصول
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

          {/* Bubble sub-filters */}
          <div className="flex flex-wrap gap-2 mb-8 p-3 rounded-2xl bg-surface-light/50 border border-border/40">
            <button
              onClick={() => setActiveSub("all")}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                activeSub === "all"
                  ? "bg-primary text-primary-foreground border-primary neon-glow"
                  : "bg-background/60 border-border/60 hover:border-primary/60 hover:text-primary",
              )}
            >
              همه ({products?.length ?? 0})
            </button>
            {subs.map((sub) => {
              const count = subCounts[sub] ?? 0;
              const active = activeSub === sub;
              return (
                <button
                  key={sub}
                  onClick={() => setActiveSub(sub)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                    active
                      ? "bg-primary text-primary-foreground border-primary neon-glow"
                      : "bg-background/60 border-border/60 hover:border-primary/60 hover:text-primary",
                  )}
                >
                  {sub} <span className="opacity-70">({count})</span>
                </button>
              );
            })}
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
              ) : pagedProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {pagedProducts.map((product, index) => (
                      <div
                        key={product.id}
                        className="animate-slide-up"
                        style={{ animationDelay: `${index * 0.04}s` }}
                      >
                        <ProductCardNew product={product} />
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <Pagination className="mt-10">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setPage((p) => Math.max(1, p - 1));
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                          >
                            قبلی
                          </PaginationLink>
                        </PaginationItem>
                        {pageNumbers.map((n, i) =>
                          n === "…" ? (
                            <PaginationItem key={`e-${i}`}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          ) : (
                            <PaginationItem key={n}>
                              <PaginationLink
                                href="#"
                                isActive={n === currentPage}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setPage(n);
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                              >
                                {n.toLocaleString("fa-IR")}
                              </PaginationLink>
                            </PaginationItem>
                          ),
                        )}
                        <PaginationItem>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setPage((p) => Math.min(totalPages, p + 1));
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className={cn(
                              currentPage === totalPages && "pointer-events-none opacity-50",
                            )}
                          >
                            بعدی
                          </PaginationLink>
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
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

export default CategoryPage;

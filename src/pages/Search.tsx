import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useSearchParams, Link } from "react-router-dom";
import { Search as SearchIcon, Filter, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCardNew from "@/components/ProductCardNew";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchProducts } from "@/hooks/useProducts";
import { Loader2 } from "lucide-react";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState(query);
  
  const { data: products, isLoading } = useSearchProducts(query);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue.trim() });
    }
  };

  return (
    <>
      <Helmet>
        <title>{query ? `جستجو: ${query}` : "جستجوی محصولات"} | موبایل مارکت</title>
        <meta name="description" content="جستجوی گوشی موبایل، تبلت و لوازم جانبی" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="نام محصول، برند یا مدل را جستجو کنید..."
                className="w-full pr-14 pl-4 py-6 text-lg bg-surface-light border-border/50 rounded-2xl focus:border-primary"
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={() => {
                    setInputValue("");
                    setSearchParams({});
                  }}
                  className="absolute left-14 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              <Button type="submit" className="absolute left-2 top-1/2 -translate-y-1/2 btn-primary">
                جستجو
              </Button>
            </div>
          </form>

          {/* Results */}
          {query && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">
                نتایج جستجو برای "{query}"
              </h1>
              {products && (
                <p className="text-muted-foreground mt-2">
                  {products.length} محصول یافت شد
                </p>
              )}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : !query ? (
            <div className="text-center py-16 space-y-4">
              <SearchIcon className="h-20 w-20 text-muted-foreground mx-auto" />
              <h2 className="text-xl font-bold text-foreground">عبارت مورد نظر را جستجو کنید</h2>
              <p className="text-muted-foreground">می‌توانید بر اساس نام محصول، برند یا مدل جستجو کنید</p>
            </div>
          ) : !products || products.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <SearchIcon className="h-20 w-20 text-muted-foreground mx-auto" />
              <h2 className="text-xl font-bold text-foreground">محصولی یافت نشد</h2>
              <p className="text-muted-foreground">عبارت جستجوی دیگری را امتحان کنید</p>
              <Link to="/">
                <Button className="btn-primary mt-4">بازگشت به صفحه اصلی</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <div style={{ animationDelay: `${index * 50}ms` }} className="animate-slide-up">
                    <ProductCardNew product={product} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Search;

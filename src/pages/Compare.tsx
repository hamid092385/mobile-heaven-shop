import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { GitCompare, X, Star, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/hooks/useCompare";
import { formatPrice } from "@/lib/formatPrice";
import { toPersianDate } from "@/lib/persianDate";

const Compare = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  const specKeys = compareItems.reduce<string[]>((keys, product) => {
    const specs = product.specs as Record<string, string> | null;
    if (specs) {
      Object.keys(specs).forEach((key) => {
        if (!keys.includes(key)) keys.push(key);
      });
    }
    return keys;
  }, []);

  const specLabels: Record<string, string> = {
    ram: "حافظه رم",
    storage: "حافظه داخلی",
    screen: "صفحه نمایش",
    battery: "باتری",
    camera: "دوربین",
    processor: "پردازنده",
    os: "سیستم عامل",
  };

  return (
    <>
      <Helmet>
        <title>مقایسه محصولات | موبایل مارکت</title>
        <meta name="description" content="مقایسه مشخصات و قیمت محصولات" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary">صفحه اصلی</Link>
            <ArrowRight className="h-4 w-4 rotate-180" />
            <span className="text-foreground">مقایسه محصولات</span>
          </div>

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <GitCompare className="h-8 w-8 text-primary" />
              مقایسه محصولات
            </h1>
            {compareItems.length > 0 && (
              <Button variant="outline" onClick={clearCompare}>
                پاک کردن همه
              </Button>
            )}
          </div>

          {compareItems.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <GitCompare className="h-20 w-20 text-muted-foreground mx-auto" />
              <h2 className="text-xl font-bold text-foreground">لیست مقایسه خالی است</h2>
              <p className="text-muted-foreground">محصولاتی که می‌خواهید مقایسه کنید را انتخاب کنید</p>
              <Link to="/mobile-phones">
                <Button className="btn-primary mt-4">مشاهده محصولات</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr>
                    <th className="p-4 text-right font-bold text-foreground bg-surface-light rounded-tr-2xl">
                      ویژگی
                    </th>
                    {compareItems.map((product, index) => (
                      <th
                        key={product.id}
                        className={`p-4 bg-surface-light ${index === compareItems.length - 1 ? "rounded-tl-2xl" : ""}`}
                      >
                        <div className="relative">
                          <button
                            onClick={() => removeFromCompare(product.id)}
                            className="absolute -top-2 -left-2 p-1 rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <Link to={`/product/${product.id}`}>
                            <img
                              src={product.image_url || "/placeholder.svg"}
                              alt={product.name}
                              className="w-32 h-32 object-contain mx-auto mb-4 hover:scale-105 transition-transform"
                            />
                            <h3 className="font-bold text-foreground text-center hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                          </Link>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Price */}
                  <tr className="border-b border-border/30">
                    <td className="p-4 font-medium text-muted-foreground">قیمت</td>
                    {compareItems.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        <div className="text-xl font-bold text-primary">
                          {formatPrice(product.price)} تومان
                        </div>
                        {product.original_price && (
                          <div className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.original_price)} تومان
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Brand */}
                  <tr className="border-b border-border/30 bg-surface-light/50">
                    <td className="p-4 font-medium text-muted-foreground">برند</td>
                    {compareItems.map((product) => (
                      <td key={product.id} className="p-4 text-center font-medium text-foreground">
                        {product.brand}
                      </td>
                    ))}
                  </tr>

                  {/* Rating */}
                  <tr className="border-b border-border/30">
                    <td className="p-4 font-medium text-muted-foreground">امتیاز</td>
                    {compareItems.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-5 w-5 fill-accent text-accent" />
                          <span className="font-medium text-foreground">{product.rating || "-"}</span>
                          <span className="text-sm text-muted-foreground">
                            ({product.reviews_count || 0} نظر)
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Stock */}
                  <tr className="border-b border-border/30 bg-surface-light/50">
                    <td className="p-4 font-medium text-muted-foreground">موجودی</td>
                    {compareItems.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            product.in_stock
                              ? "bg-green-500/10 text-green-500"
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {product.in_stock ? "موجود" : "ناموجود"}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Last Update */}
                  <tr className="border-b border-border/30">
                    <td className="p-4 font-medium text-muted-foreground">آخرین بروزرسانی قیمت</td>
                    {compareItems.map((product) => (
                      <td key={product.id} className="p-4 text-center text-foreground">
                        {product.price_updated_at ? toPersianDate(product.price_updated_at) : "-"}
                      </td>
                    ))}
                  </tr>

                  {/* Specs */}
                  {specKeys.map((key, index) => (
                    <tr
                      key={key}
                      className={`border-b border-border/30 ${index % 2 === 0 ? "bg-surface-light/50" : ""}`}
                    >
                      <td className="p-4 font-medium text-muted-foreground">
                        {specLabels[key] || key}
                      </td>
                      {compareItems.map((product) => {
                        const specs = product.specs as Record<string, string> | null;
                        return (
                          <td key={product.id} className="p-4 text-center text-foreground">
                            {specs?.[key] || "-"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Actions */}
                  <tr>
                    <td className="p-4"></td>
                    {compareItems.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        <Link to={`/product/${product.id}`}>
                          <Button className="btn-primary">مشاهده محصول</Button>
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Compare;

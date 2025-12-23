import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Smartphone } from "lucide-react";

const MobilePhones = () => {
  return (
    <>
      <Helmet>
        <title>گوشی موبایل | موبایل مارکت</title>
        <meta name="description" content="خرید گوشی موبایل از برندهای معتبر جهان با گارانتی اصالت کالا" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Smartphone className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4">گوشی موبایل</h1>
            <p className="text-muted-foreground max-w-md">
              به زودی لیست کامل گوشی‌های موبایل در این صفحه نمایش داده خواهد شد.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MobilePhones;

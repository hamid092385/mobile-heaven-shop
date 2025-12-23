import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Percent } from "lucide-react";

const SpecialOffersPage = () => {
  return (
    <>
      <Helmet>
        <title>پیشنهادات ویژه | موبایل مارکت</title>
        <meta name="description" content="بهترین تخفیف‌ها و پیشنهادات ویژه گوشی موبایل و لوازم جانبی" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="w-20 h-20 rounded-2xl bg-accent/20 flex items-center justify-center mb-6">
              <Percent className="h-10 w-10 text-accent" />
            </div>
            <h1 className="text-3xl font-bold mb-4">پیشنهادات ویژه</h1>
            <p className="text-muted-foreground max-w-md">
              به زودی لیست کامل پیشنهادات ویژه در این صفحه نمایش داده خواهد شد.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default SpecialOffersPage;

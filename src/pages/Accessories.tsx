import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Headphones } from "lucide-react";

const Accessories = () => {
  return (
    <>
      <Helmet>
        <title>لوازم جانبی | موبایل مارکت</title>
        <meta name="description" content="خرید لوازم جانبی گوشی و تبلت با بهترین قیمت و کیفیت" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Headphones className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4">لوازم جانبی</h1>
            <p className="text-muted-foreground max-w-md">
              به زودی لیست کامل لوازم جانبی در این صفحه نمایش داده خواهد شد.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Accessories;

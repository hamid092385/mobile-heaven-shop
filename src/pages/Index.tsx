import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BrandSection from "@/components/BrandSection";
import FeaturedProductsNew from "@/components/FeaturedProductsNew";
import SpecialOffersNew from "@/components/SpecialOffersNew";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>موبایل مارکت | فروشگاه آنلاین گوشی هوشمند</title>
        <meta
          name="description"
          content="بزرگترین فروشگاه آنلاین گوشی موبایل در ایران. خرید آیفون، سامسونگ، شیائومی با گارانتی اصالت و ارسال سریع."
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSection />
          <BrandSection />
          <FeaturedProductsNew />
          <SpecialOffersNew />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;

import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const products = [
  {
    name: "آیفون ۱۵ پرو مکس ۲۵۶ گیگابایت",
    brand: "اپل",
    price: "۸۵,۰۰۰,۰۰۰",
    originalPrice: "۹۵,۰۰۰,۰۰۰",
    discount: 10,
    rating: 4.9,
    reviews: 256,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop",
    isNew: true,
  },
  {
    name: "سامسونگ گلکسی S24 اولترا",
    brand: "سامسونگ",
    price: "۷۲,۰۰۰,۰۰۰",
    rating: 4.8,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop",
    isNew: true,
  },
  {
    name: "شیائومی ۱۴ اولترا",
    brand: "شیائومی",
    price: "۴۵,۰۰۰,۰۰۰",
    originalPrice: "۵۲,۰۰۰,۰۰۰",
    discount: 15,
    rating: 4.7,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop",
  },
  {
    name: "گوگل پیکسل ۸ پرو",
    brand: "گوگل",
    price: "۵۵,۰۰۰,۰۰۰",
    rating: 4.8,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop",
  },
  {
    name: "وان‌پلاس ۱۲",
    brand: "وان‌پلاس",
    price: "۳۸,۰۰۰,۰۰۰",
    originalPrice: "۴۲,۰۰۰,۰۰۰",
    discount: 10,
    rating: 4.6,
    reviews: 87,
    image: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&h=500&fit=crop",
  },
  {
    name: "هوآوی Mate 60 Pro",
    brand: "هوآوی",
    price: "۶۵,۰۰۰,۰۰۰",
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&h=500&fit=crop",
  },
  {
    name: "آیفون ۱۵ پرو ۱۲۸ گیگابایت",
    brand: "اپل",
    price: "۶۸,۰۰۰,۰۰۰",
    rating: 4.9,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop",
  },
  {
    name: "سامسونگ گلکسی Z Fold 5",
    brand: "سامسونگ",
    price: "۸۹,۰۰۰,۰۰۰",
    originalPrice: "۹۸,۰۰۰,۰۰۰",
    discount: 10,
    rating: 4.8,
    reviews: 178,
    image: "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=500&h=500&fit=crop",
    isNew: true,
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-16">
      <div className="container">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">پرفروش‌ترین گوشی‌ها</h2>
            <p className="text-muted-foreground">محبوب‌ترین انتخاب مشتریان ما</p>
          </div>
          <Button variant="ghost" className="gap-2 text-primary hover:bg-primary/10">
            مشاهده همه
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

import { Clock, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

const offers = [
  {
    title: "حراج بزرگ آیفون",
    description: "تخفیف ویژه تا ۲۵٪ روی تمام مدل‌های آیفون",
    image: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=600&h=400&fit=crop",
    discount: 25,
    timeLeft: "۲ روز",
  },
  {
    title: "فروش ویژه سامسونگ",
    description: "گلکسی S24 با هدیه ویژه",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=400&fit=crop",
    discount: 20,
    timeLeft: "۵ روز",
  },
];

const SpecialOffers = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container">
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2 rounded-xl bg-accent/20">
            <Flame className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">پیشنهادات ویژه</h2>
            <p className="text-muted-foreground">فرصت‌های طلایی را از دست ندهید</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {offers.map((offer, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-3xl glass-card border-border/50 transition-all duration-500 hover:neon-glow"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-background/80 to-background" />
              </div>

              {/* Content */}
              <div className="relative p-8 md:p-12">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-4 py-1 bg-accent text-accent-foreground text-sm font-bold rounded-full">
                    {offer.discount}٪ تخفیف
                  </span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{offer.timeLeft} مانده</span>
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold mb-3">{offer.title}</h3>
                <p className="text-muted-foreground mb-6">{offer.description}</p>

                <Button className="btn-accent rounded-xl px-8">
                  مشاهده پیشنهادات
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Features Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {[
            { icon: "🚚", title: "ارسال رایگان", desc: "سفارش بالای ۲ میلیون" },
            { icon: "🔄", title: "۷ روز ضمانت", desc: "بازگشت بدون قید و شرط" },
            { icon: "🛡️", title: "گارانتی اصالت", desc: "تضمین اورجینال بودن" },
            { icon: "💳", title: "پرداخت امن", desc: "درگاه مطمئن بانکی" },
          ].map((feature, index) => (
            <div key={index} className="glass-card rounded-2xl p-6 text-center">
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h4 className="font-bold mb-1">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;

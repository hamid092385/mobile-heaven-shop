import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-hero-pattern py-16 md:py-24">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-right animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">جدیدترین مدل‌های ۲۰۲۴</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-foreground">بهترین گوشی‌های</span>
              <br />
              <span className="gradient-text">هوشمند دنیا</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
              با بیش از ۱۰۰۰ مدل گوشی از برندهای معتبر جهانی، بهترین انتخاب را برای شما فراهم کرده‌ایم.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="btn-primary rounded-xl px-8 gap-2">
                مشاهده محصولات
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl px-8 border-border/50 hover:bg-secondary">
                پیشنهادات ویژه
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border/30">
              {[
                { value: "+۱۰۰۰", label: "محصول متنوع" },
                { value: "+۵۰K", label: "مشتری راضی" },
                { value: "۲۴/۷", label: "پشتیبانی" },
              ].map((stat, index) => (
                <div key={index} className="text-center lg:text-right">
                  <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-radial from-primary/30 via-transparent to-transparent blur-3xl scale-150" />
              
              {/* Phone Mockup */}
              <div className="relative z-10 animate-float">
                <div className="w-64 md:w-80 h-[500px] md:h-[600px] bg-gradient-to-b from-surface-lighter to-surface-light rounded-[3rem] p-2 neon-border animate-glow">
                  <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/20 flex items-center justify-center">
                        <Sparkles className="w-10 h-10 text-primary" />
                      </div>
                      <p className="text-lg font-bold text-foreground">iPhone 15 Pro Max</p>
                      <p className="text-sm text-muted-foreground mt-2">جدیدترین فناوری اپل</p>
                      <div className="mt-4 text-2xl font-bold text-accent">۸۵,۰۰۰,۰۰۰ تومان</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 px-4 py-2 glass-card rounded-xl animate-float" style={{ animationDelay: "0.5s" }}>
                <span className="text-sm font-medium text-accent">تخفیف ۱۵٪</span>
              </div>
              <div className="absolute -bottom-4 -left-4 px-4 py-2 glass-card rounded-xl animate-float" style={{ animationDelay: "1s" }}>
                <span className="text-sm font-medium text-primary">ارسال رایگان</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

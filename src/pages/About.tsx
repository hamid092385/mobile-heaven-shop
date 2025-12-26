import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Shield, Award, Clock, Phone, Mail, MapPin, Instagram, Send, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <>
      <Helmet>
        <title>درباره ما | موبایل مارکت</title>
        <meta name="description" content="موبایل مارکت، فروشگاه معتبر گوشی موبایل و لوازم جانبی با بیش از ۱۰ سال سابقه درخشان" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary">صفحه اصلی</Link>
            <ArrowRight className="h-4 w-4 rotate-180" />
            <span className="text-foreground">درباره ما</span>
          </div>

          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4 gradient-text">درباره موبایل مارکت</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              با بیش از ۱۰ سال تجربه در زمینه فروش گوشی‌های هوشمند و لوازم جانبی، افتخار داریم که یکی از معتبرترین فروشگاه‌های آنلاین کشور هستیم.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { icon: Shield, title: "گارانتی اصالت", desc: "تضمین اصل بودن تمام محصولات" },
              { icon: Award, title: "کیفیت برتر", desc: "انتخاب بهترین برندهای جهانی" },
              { icon: Clock, title: "ارسال سریع", desc: "ارسال در کمتر از ۲۴ ساعت" },
              { icon: Users, title: "پشتیبانی ۲۴/۷", desc: "پاسخگویی به سوالات شما" },
            ].map((item, index) => (
              <div key={index} className="p-6 rounded-2xl bg-surface-light border border-border/50 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Story */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">داستان ما</h2>
              <p className="text-muted-foreground leading-relaxed">
                موبایل مارکت در سال ۱۳۹۲ با هدف ارائه محصولات دیجیتال با کیفیت و قیمت مناسب تأسیس شد. ما از ابتدا بر اصالت کالا و رضایت مشتری تمرکز داشتیم و امروز افتخار می‌کنیم که به یکی از بزرگترین فروشگاه‌های آنلاین گوشی موبایل در کشور تبدیل شده‌ایم.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                تیم حرفه‌ای ما متشکل از کارشناسان مجرب در زمینه فناوری، همواره در تلاش است تا بهترین تجربه خرید را برای شما فراهم کند. ما به ارزش‌هایی مانند صداقت، شفافیت و مشتری‌مداری پایبند هستیم.
              </p>
              <div className="flex gap-8">
                <div>
                  <div className="text-3xl font-bold text-primary">۱۰+</div>
                  <div className="text-muted-foreground">سال تجربه</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">۵۰۰۰۰+</div>
                  <div className="text-muted-foreground">مشتری راضی</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">۱۰۰۰+</div>
                  <div className="text-muted-foreground">محصول</div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 p-1">
              <div className="rounded-2xl bg-surface-light p-8 h-80 flex items-center justify-center">
                <div className="text-center">
                  <Phone className="h-20 w-20 text-primary mx-auto mb-4" />
                  <span className="text-2xl font-bold gradient-text">موبایل مارکت</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-accent/10 border border-border/50 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">سوالی دارید؟</h2>
            <p className="text-muted-foreground mb-6">تیم پشتیبانی ما آماده پاسخگویی به سوالات شماست</p>
            <Link to="/contact">
              <button className="btn-primary px-8 py-3 rounded-xl text-lg">
                تماس با ما
              </button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default About;

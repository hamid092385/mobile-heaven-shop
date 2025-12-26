import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Phone, Mail, MapPin, ArrowRight, Clock, Instagram, Send, MessageCircle } from "lucide-react";

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>تماس با ما | موبایل مارکت</title>
        <meta name="description" content="ارتباط با تیم پشتیبانی موبایل مارکت - پاسخگویی ۲۴ ساعته" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary">صفحه اصلی</Link>
            <ArrowRight className="h-4 w-4 rotate-180" />
            <span className="text-foreground">تماس با ما</span>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 gradient-text">تماس با ما</h1>
            <p className="text-xl text-muted-foreground">تیم پشتیبانی ما ۲۴ ساعته آماده پاسخگویی به شماست</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="space-y-6">
              {[
                { icon: Phone, title: "تلفن تماس", value: "۰۲۱-۱۲۳۴۵۶۷۸", desc: "شنبه تا پنجشنبه ۹ صبح تا ۹ شب" },
                { icon: Mail, title: "ایمیل", value: "info@mobilemarket.ir", desc: "پاسخگویی در کمتر از ۲۴ ساعت" },
                { icon: MapPin, title: "آدرس فروشگاه", value: "تهران، خیابان ولیعصر، مرکز خرید موبایل ایران", desc: "طبقه سوم، واحد ۳۱۲" },
                { icon: Clock, title: "ساعات کاری", value: "۹ صبح تا ۹ شب", desc: "همه روزه حتی روزهای تعطیل" },
              ].map((item, index) => (
                <div key={index} className="p-6 rounded-2xl bg-surface-light border border-border/50 flex gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                    <p className="text-primary font-medium">{item.value}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}

              <div className="p-6 rounded-2xl bg-surface-light border border-border/50">
                <h3 className="font-bold text-foreground mb-4">ما را در شبکه‌های اجتماعی دنبال کنید</h3>
                <div className="flex gap-3">
                  {[
                    { icon: Instagram, label: "اینستاگرام" },
                    { icon: Send, label: "تلگرام" },
                    { icon: MessageCircle, label: "واتساپ" },
                  ].map((social, index) => (
                    <a key={index} href="#" className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors">
                      <social.icon className="h-5 w-5" />
                      <span className="text-sm">{social.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-border/50 h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.123456789!2d51.4215!3d35.7596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQ1JzM0LjYiTiA1McKwMjUnMTcuNCJF!5e0!3m2!1sen!2s!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="موقعیت فروشگاه"
              />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Contact;

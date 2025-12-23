import { Phone, Mail, MapPin, Instagram, Send, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border/50">
      {/* Newsletter */}
      <div className="container py-12 border-b border-border/30">
        <div className="glass-card rounded-3xl p-8 md:p-12 neon-border">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">عضویت در خبرنامه</h3>
              <p className="text-muted-foreground">
                از جدیدترین محصولات و تخفیف‌های ویژه باخبر شوید
              </p>
            </div>
            <div className="flex gap-3">
              <Input
                placeholder="ایمیل خود را وارد کنید..."
                className="bg-secondary/50 border-border/50 rounded-xl"
              />
              <Button className="btn-primary rounded-xl px-6">
                عضویت
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Phone className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold gradient-text">موبایل مارکت</span>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              فروشگاه معتبر موبایل با بیش از ۱۰ سال سابقه درخشان در زمینه فروش گوشی‌های هوشمند و لوازم جانبی.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: "#" },
                { icon: Send, href: "#" },
                { icon: MessageCircle, href: "#" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">دسترسی سریع</h4>
            <ul className="space-y-3">
              {["درباره ما", "تماس با ما", "سوالات متداول", "قوانین و مقررات", "حریم خصوصی", "همکاری با ما"].map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold mb-6">دسته‌بندی محصولات</h4>
            <ul className="space-y-3">
              {["گوشی موبایل", "تبلت", "ساعت هوشمند", "هندزفری و هدفون", "شارژر و کابل", "قاب و کاور"].map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6">تماس با ما</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-1" />
                <span className="text-muted-foreground">
                  تهران، خیابان ولیعصر، مرکز خرید موبایل ایران
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground">۰۲۱-۱۲۳۴۵۶۷۸</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground">info@mobilemarket.ir</span>
              </li>
            </ul>

            {/* Trust Badges */}
            <div className="flex gap-3 mt-6">
              <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center">
                <span className="text-2xl">🛡️</span>
              </div>
              <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border/30">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© ۱۴۰۳ موبایل مارکت. تمامی حقوق محفوظ است.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-primary transition-colors">شرایط استفاده</a>
              <a href="#" className="hover:text-primary transition-colors">حریم خصوصی</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

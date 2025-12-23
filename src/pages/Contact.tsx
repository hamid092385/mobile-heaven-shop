import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Phone, Mail, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>تماس با ما | موبایل مارکت</title>
        <meta name="description" content="ارتباط با تیم پشتیبانی موبایل مارکت - پاسخگویی ۲۴ ساعته" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-8">تماس با ما</h1>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">تلفن</h3>
                <p className="text-muted-foreground text-sm">۰۲۱-۱۲۳۴۵۶۷۸</p>
              </div>
              <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">ایمیل</h3>
                <p className="text-muted-foreground text-sm">info@mobilemarket.ir</p>
              </div>
              <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">آدرس</h3>
                <p className="text-muted-foreground text-sm">تهران، خیابان ولیعصر</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Contact;

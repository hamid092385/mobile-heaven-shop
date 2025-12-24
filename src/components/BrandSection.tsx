import appleLogo from "@/assets/brands/apple.svg";
import samsungLogo from "@/assets/brands/samsung.svg";
import xiaomiLogo from "@/assets/brands/xiaomi.svg";
import huaweiLogo from "@/assets/brands/huawei.svg";
import oneplusLogo from "@/assets/brands/oneplus.svg";
import googleLogo from "@/assets/brands/google.svg";
import { Link } from "react-router-dom";

const brands = [
  { name: "اپل", nameEn: "Apple", logo: appleLogo, color: "from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800" },
  { name: "سامسونگ", nameEn: "Samsung", logo: samsungLogo, color: "from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800" },
  { name: "شیائومی", nameEn: "Xiaomi", logo: xiaomiLogo, color: "from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800" },
  { name: "هوآوی", nameEn: "Huawei", logo: huaweiLogo, color: "from-red-50 to-red-100 dark:from-red-900 dark:to-red-800" },
  { name: "وان‌پلاس", nameEn: "OnePlus", logo: oneplusLogo, color: "from-red-50 to-red-100 dark:from-red-900 dark:to-red-800" },
  { name: "گوگل", nameEn: "Google", logo: googleLogo, color: "from-blue-50 to-green-50 dark:from-gray-700 dark:to-gray-800" },
];

const BrandSection = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">برندهای محبوب</h2>
          <p className="text-muted-foreground">نماینده رسمی برندهای معتبر جهانی</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {brands.map((brand, index) => (
            <Link
              to={`/search?q=${encodeURIComponent(brand.nameEn)}`}
              key={index}
              className="group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="glass-card rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:neon-glow">
                <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${brand.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform p-3`}>
                  <img 
                    src={brand.logo} 
                    alt={`${brand.name} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-medium text-foreground">{brand.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandSection;
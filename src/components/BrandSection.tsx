const brands = [
  { name: "اپل", logo: "🍎", color: "from-gray-600 to-gray-800" },
  { name: "سامسونگ", logo: "📱", color: "from-blue-600 to-blue-800" },
  { name: "شیائومی", logo: "🔶", color: "from-orange-500 to-orange-700" },
  { name: "هوآوی", logo: "🔴", color: "from-red-500 to-red-700" },
  { name: "وان‌پلاس", logo: "🔵", color: "from-red-600 to-red-800" },
  { name: "گوگل", logo: "🌐", color: "from-green-500 to-blue-500" },
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
            <div
              key={index}
              className="group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="glass-card rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:neon-glow">
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${brand.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                  {brand.logo}
                </div>
                <span className="font-medium text-foreground">{brand.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandSection;

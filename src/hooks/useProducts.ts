import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  name_en: string | null;
  brand: string;
  category: string;
  price: number;
  original_price: number | null;
  discount_percent: number | null;
  rating: number | null;
  reviews_count: number | null;
  in_stock: boolean | null;
  is_featured: boolean | null;
  is_special_offer: boolean | null;
  image_url: string | null;
  specs: Record<string, unknown> | null;
  created_at: string;
  price_updated_at: string | null;
  amazon_asin: string | null;
  auto_sync: boolean | null;
}

export const useProductById = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as Product | null;
    },
    enabled: !!id,
  });
};

// Sanitize input for SQL ILIKE queries - escape special characters
const sanitizeSearchQuery = (input: string): string => {
  return input
    .trim()
    .slice(0, 100) // Limit length to prevent DoS
    .replace(/[%_\\]/g, '\\$&'); // Escape SQL wildcards
};

export const useSearchProducts = (query: string) => {
  return useQuery({
    queryKey: ["products", "search", query],
    queryFn: async () => {
      if (!query.trim()) return [];
      
      // Sanitize the query to prevent SQL injection
      const sanitized = sanitizeSearchQuery(query);
      
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .or(`name.ilike.%${sanitized}%,name_en.ilike.%${sanitized}%,brand.ilike.%${sanitized}%`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Product[];
    },
    enabled: !!query.trim(),
  });
};

// Six top-level category groups exposed as sitewide navigation pages.
// Each group aggregates several raw Persian category strings that arrive
// from n8n / the database. `subs` is used both as the alias list for the
// query and as the bubble sub-filters shown at the top of the page.
export const CATEGORY_GROUPS = {
  "phones-tablets": {
    label: "موبایل و تبلت",
    subs: ["موبایل", "تبلت"],
  },
  smartwatches: {
    label: "ساعت هوشمند",
    subs: ["ساعت هوشمند", "لوازم جانبی ساعت هوشمند"],
  },
  audio: {
    label: "هندزفری و صوتی",
    subs: ["هندزفری و هدفون توگوشی", "باند و اسپیکر", "لوازم جانبی هندزفری"],
  },
  computers: {
    label: "لپ‌تاپ و کامپیوتر",
    subs: ["لپ‌تاپ", "نت‌بوک", "قطعات اصلی کامپیوتر", "مانیتور و نمایشگر"],
  },
  gaming: {
    label: "کنسول و گیمینگ",
    subs: ["کنسول و دستگاه بازی", "تجهیزات گیمینگ"],
  },
  accessories: {
    label: "لوازم جانبی و شبکه",
    subs: [
      "لوازم جانبی موبایل",
      "لوازم جانبی کامپیوتر",
      "لوازم جانبی لپ‌تاپ",
      "لوازم جانبی تبلت",
      "تجهیزات ذخیره‌سازی",
      "مودم و تجهیزات شبکه",
    ],
  },
} as const;

export type CategoryGroupKey = keyof typeof CATEGORY_GROUPS;

// Per sub-category alias list. The DB `category` column may contain either
// the Persian label or an English shorthand (mobile/tablet/accessory/...)
// depending on how n8n / the admin panel wrote the row. All variants below
// resolve to the same bubble filter shown in the UI.
export const SUB_ALIASES: Record<string, string[]> = {
  "موبایل": ["موبایل", "گوشی", "گوشی موبایل", "تلفن همراه", "mobile", "phone", "phones"],
  "تبلت": ["تبلت", "tablet", "tablets"],
  "ساعت هوشمند": ["ساعت هوشمند", "smartwatch", "smart watch", "watch"],
  "لوازم جانبی ساعت هوشمند": ["لوازم جانبی ساعت هوشمند", "smartwatch accessory"],
  "هندزفری و هدفون توگوشی": ["هندزفری و هدفون توگوشی", "هندزفری", "هدفون", "earphone", "headphone", "earbuds"],
  "باند و اسپیکر": ["باند و اسپیکر", "اسپیکر", "باند", "speaker"],
  "لوازم جانبی هندزفری": ["لوازم جانبی هندزفری", "headphone accessory"],
  "لپ‌تاپ": ["لپ‌تاپ", "لپ تاپ", "لپ-تاپ", "laptop", "laptops"],
  "نت‌بوک": ["نت‌بوک", "نت بوک", "netbook"],
  "قطعات اصلی کامپیوتر": ["قطعات اصلی کامپیوتر", "قطعات کامپیوتر", "pc parts"],
  "مانیتور و نمایشگر": ["مانیتور و نمایشگر", "مانیتور", "monitor", "display"],
  "کنسول و دستگاه بازی": ["کنسول و دستگاه بازی", "کنسول", "console", "gaming console"],
  "تجهیزات گیمینگ": ["تجهیزات گیمینگ", "گیمینگ", "gaming"],
  "لوازم جانبی موبایل": ["لوازم جانبی موبایل", "لوازم جانبی گوشی", "mobile accessory", "phone accessory", "accessory", "accessories", "لوازم جانبی"],
  "لوازم جانبی کامپیوتر": ["لوازم جانبی کامپیوتر", "pc accessory", "computer accessory"],
  "لوازم جانبی لپ‌تاپ": ["لوازم جانبی لپ‌تاپ", "لوازم جانبی لپ تاپ", "laptop accessory"],
  "لوازم جانبی تبلت": ["لوازم جانبی تبلت", "tablet accessory"],
  "تجهیزات ذخیره‌سازی": ["تجهیزات ذخیره‌سازی", "ذخیره سازی", "storage", "ssd", "hdd"],
  "مودم و تجهیزات شبکه": ["مودم و تجهیزات شبکه", "مودم", "شبکه", "modem", "router", "network"],
};

// Route → Persian categories mapping (for external reference / n8n docs).
export const CATEGORY_MAPPING: Record<string, readonly string[]> = {
  "/phones-tablets": CATEGORY_GROUPS["phones-tablets"].subs,
  "/smartwatches": CATEGORY_GROUPS.smartwatches.subs,
  "/audio": CATEGORY_GROUPS.audio.subs,
  "/computers": CATEGORY_GROUPS.computers.subs,
  "/gaming": CATEGORY_GROUPS.gaming.subs,
  "/accessories": CATEGORY_GROUPS.accessories.subs,
};

// Legacy per-single-category aliases (kept for older code paths).
export const CATEGORY_ALIASES: Record<string, string[]> = {
  mobile: ["mobile", "phone", "phones", "موبایل", "گوشی", "گوشی موبایل", "تلفن همراه"],
  tablet: ["tablet", "tablets", "تبلت"],
  accessory: [...CATEGORY_GROUPS.accessories.subs, "accessory", "accessories", "لوازم جانبی"],
  laptop: ["laptop", "laptops", "لپ تاپ", "لپ‌تاپ", "لپ-تاپ"],
};

const normalize = (s: string) =>
  s.toLowerCase().replace(/\u200c/g, " ").replace(/\s+/g, " ").trim();

export const useProducts = (category?: string) => {
  return useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      const all = (data as Product[]) ?? [];
      if (!category) return all;

      const aliases = (CATEGORY_ALIASES[category] ?? [category]).map(normalize);
      return all.filter((p) => p.category && aliases.includes(normalize(p.category)));
    },
  });
};

// Returns all normalized alias strings that map to a given Persian sub label.
export const aliasesForSub = (sub: string): string[] => {
  const list = SUB_ALIASES[sub] ?? [sub];
  return list.map(normalize);
};

// True if a DB `category` value belongs to the given Persian sub label.
export const categoryMatchesSub = (category: string | null, sub: string): boolean => {
  if (!category) return false;
  return aliasesForSub(sub).includes(normalize(category));
};

// Fetch products belonging to any sub-category of a top-level group.
export const useProductsByGroup = (groupKey: CategoryGroupKey) => {
  return useQuery({
    queryKey: ["products", "group", groupKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      const allAliases = new Set(
        CATEGORY_GROUPS[groupKey].subs.flatMap((s) => aliasesForSub(s)),
      );
      return ((data as Product[]) ?? []).filter(
        (p) => p.category && allAliases.has(normalize(p.category)),
      );
    },
  });
};

// Exported for use by CategoryPage when filtering by the bubble sub-filter.
export const normalizeCategory = normalize;


export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(8);
      
      if (error) throw error;
      return data as Product[];
    },
  });
};

export const useSpecialOffers = () => {
  return useQuery({
    queryKey: ["products", "special-offers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_special_offer", true)
        .order("discount_percent", { ascending: false });
      
      if (error) throw error;
      return data as Product[];
    },
  });
};

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  name_en: string | null;
  brand: string;
  category: string;
  category_fa: string | null;
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

const sanitizeSearchQuery = (input: string): string => {
  return input.trim().slice(0, 100).replace(/[%_\\]/g, "\\$&");
};

export const useSearchProducts = (query: string) => {
  return useQuery({
    queryKey: ["products", "search", query],
    queryFn: async () => {
      if (!query.trim()) return [];
      const sanitized = sanitizeSearchQuery(query);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .or(`name.ilike.%${sanitized}%,name_en.ilike.%${sanitized}%,brand.ilike.%${sanitized}%`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as unknown as Product[];
    },
    enabled: !!query.trim(),
  });
};

// Six top-level pages. Each key maps 1:1 to the exact Persian value stored
// in the `category_fa` column of the products table.
export const CATEGORY_GROUPS = {
  "phones-tablets": { label: "موبایل و تبلت", categoryFa: "موبایل و تبلت", subs: [] as string[] },
  smartwatches: { label: "ساعت هوشمند", categoryFa: "ساعت هوشمند", subs: [] as string[] },
  audio: { label: "هندزفری و تجهیزات صوتی", categoryFa: "هندزفری و تجهیزات صوتی", subs: [] as string[] },
  computers: { label: "لپ‌تاپ و کامپیوتر", categoryFa: "لپ‌تاپ و کامپیوتر", subs: [] as string[] },
  gaming: { label: "کنسول و گیمینگ", categoryFa: "کنسول و گیمینگ", subs: [] as string[] },
  accessories: { label: "لوازم جانبی و شبکه", categoryFa: "لوازم جانبی و شبکه", subs: [] as string[] },
} as const;

export type CategoryGroupKey = keyof typeof CATEGORY_GROUPS;

export const CATEGORY_MAPPING: Record<string, string> = {
  "/phones-tablets": CATEGORY_GROUPS["phones-tablets"].categoryFa,
  "/smartwatches": CATEGORY_GROUPS.smartwatches.categoryFa,
  "/audio": CATEGORY_GROUPS.audio.categoryFa,
  "/computers": CATEGORY_GROUPS.computers.categoryFa,
  "/gaming": CATEGORY_GROUPS.gaming.categoryFa,
  "/accessories": CATEGORY_GROUPS.accessories.categoryFa,
};

const normalize = (s: string) =>
  s.toLowerCase().replace(/\u200c/g, " ").replace(/\s+/g, " ").trim();

// Kept for backwards compatibility with any legacy imports.
export const categoryMatchesSub = (category: string | null, sub: string): boolean => {
  if (!category) return false;
  return normalize(category) === normalize(sub);
};

export const useProducts = (category?: string) => {
  return useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      let q = supabase.from("products").select("*").order("created_at", { ascending: false });
      if (category) q = q.eq("category_fa", category);
      const { data, error } = await q;
      if (error) throw error;
      return (data as unknown as Product[]) ?? [];
    },
  });
};

// Fetch products by top-level group (queries directly on `category_fa`).
export const useProductsByGroup = (groupKey: CategoryGroupKey) => {
  const categoryFa = CATEGORY_GROUPS[groupKey].categoryFa;
  return useQuery({
    queryKey: ["products", "group", groupKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category_fa", categoryFa)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as unknown as Product[]) ?? [];
    },
  });
};

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
      return data as unknown as Product[];
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
      return data as unknown as Product[];
    },
  });
};

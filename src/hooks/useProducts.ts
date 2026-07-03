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
  digikala_id: string | null;
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

export const useProducts = (category?: string) => {
  return useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      let query = supabase.from("products").select("*");
      
      if (category) {
        query = query.eq("category", category);
      }
      
      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Product[];
    },
  });
};

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

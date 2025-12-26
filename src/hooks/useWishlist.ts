import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface WishlistItem {
  id: string;
  product_id: string;
  user_id: string;
  created_at: string;
  product?: {
    id: string;
    name: string;
    brand: string;
    price: number;
    original_price: number | null;
    image_url: string | null;
    discount_percent: number | null;
  };
}

export const useWishlist = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: wishlistItems = [], isLoading } = useQuery({
    queryKey: ["wishlist", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("wishlist")
        .select(`
          *,
          product:products (
            id,
            name,
            brand,
            price,
            original_price,
            image_url,
            discount_percent
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as WishlistItem[];
    },
    enabled: !!user,
  });

  const addToWishlist = useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error("لطفاً وارد شوید");
      
      const { error } = await supabase
        .from("wishlist")
        .insert({ user_id: user.id, product_id: productId });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("به لیست علاقه‌مندی اضافه شد");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const removeFromWishlist = useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error("لطفاً وارد شوید");
      
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("از لیست علاقه‌مندی حذف شد");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item.product_id === productId);
  };

  const toggleWishlist = (productId: string) => {
    if (isInWishlist(productId)) {
      removeFromWishlist.mutate(productId);
    } else {
      addToWishlist.mutate(productId);
    }
  };

  return {
    wishlistItems,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    isLoggedIn: !!user,
  };
};

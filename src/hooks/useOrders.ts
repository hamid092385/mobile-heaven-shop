import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Order {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  shipping_address: string;
  phone: string;
  notes: string | null;
  created_at: string;
}

export const useOrders = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
    enabled: !!user,
  });
};

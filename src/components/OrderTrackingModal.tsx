import { useState } from "react";
import { Search, Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/formatPrice";

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  pending: { label: "در انتظار پرداخت", icon: Clock, color: "text-yellow-500" },
  paid: { label: "پرداخت شده", icon: CheckCircle, color: "text-green-500" },
  processing: { label: "در حال پردازش", icon: Package, color: "text-blue-500" },
  shipped: { label: "ارسال شده", icon: Truck, color: "text-purple-500" },
  delivered: { label: "تحویل شده", icon: CheckCircle, color: "text-green-600" },
  cancelled: { label: "لغو شده", icon: XCircle, color: "text-red-500" },
};

interface OrderResult {
  id: string;
  tracking_code: string;
  status: string;
  total_amount: number;
  created_at: string;
  shipping_address: string;
}

const OrderTrackingModal = () => {
  const [open, setOpen] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const { data, error: queryError } = await supabase
        .from("orders")
        .select("id, tracking_code, status, total_amount, created_at, shipping_address")
        .eq("tracking_code", trackingCode.trim().toUpperCase())
        .maybeSingle();

      if (queryError) throw queryError;

      if (!data) {
        setError("سفارشی با این کد پیگیری یافت نشد");
      } else {
        setOrder(data);
      }
    } catch (err) {
      console.error("Tracking error:", err);
      setError("خطا در جستجوی سفارش");
    } finally {
      setLoading(false);
    }
  };

  const StatusIcon = order ? statusConfig[order.status]?.icon || Clock : Clock;
  const statusLabel = order ? statusConfig[order.status]?.label || order.status : "";
  const statusColor = order ? statusConfig[order.status]?.color || "text-muted-foreground" : "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-muted-foreground hover:text-primary transition-colors">
          پیگیری سفارش
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">پیگیری سفارش</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tracking">کد پیگیری</Label>
            <div className="flex gap-2">
              <Input
                id="tracking"
                placeholder="TRK-XXXXXXXX"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                className="font-mono"
              />
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </form>

        {error && (
          <div className="text-center py-4 text-destructive">
            <XCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>{error}</p>
          </div>
        )}

        {order && (
          <div className="space-y-4 mt-4">
            <div className="glass-card rounded-xl p-4 text-center">
              <StatusIcon className={`h-12 w-12 mx-auto mb-2 ${statusColor}`} />
              <p className={`font-bold text-lg ${statusColor}`}>{statusLabel}</p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">کد پیگیری:</span>
                <span className="font-mono font-bold">{order.tracking_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">مبلغ کل:</span>
                <span className="text-primary font-bold">{formatPrice(order.total_amount)} تومان</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">تاریخ ثبت:</span>
                <span>{new Date(order.created_at).toLocaleDateString("fa-IR")}</span>
              </div>
              <div className="pt-2 border-t">
                <span className="text-muted-foreground block mb-1">آدرس ارسال:</span>
                <span className="text-xs">{order.shipping_address}</span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderTrackingModal;
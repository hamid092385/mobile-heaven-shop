import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { 
  Search, Package, DollarSign, ShoppingBag, TrendingUp,
  ChevronDown, Filter, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { formatPrice } from "@/lib/formatPrice";
import { useToast } from "@/hooks/use-toast";

const statusOptions = [
  { value: "pending", label: "در انتظار پرداخت", color: "bg-yellow-500" },
  { value: "paid", label: "پرداخت شده", color: "bg-green-500" },
  { value: "processing", label: "در حال پردازش", color: "bg-blue-500" },
  { value: "shipped", label: "ارسال شده", color: "bg-purple-500" },
  { value: "delivered", label: "تحویل شده", color: "bg-green-600" },
  { value: "cancelled", label: "لغو شده", color: "bg-red-500" },
];

interface Order {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  shipping_address: string;
  phone: string;
  notes: string | null;
  tracking_code: string | null;
  created_at: string;
}

const AdminDashboard = () => {
  const { isAdmin, isLoading: adminLoading, user } = useAdmin();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch all orders (admin only)
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
    enabled: isAdmin,
  });

  // Update order status mutation
  const updateStatus = useMutation({
    mutationFn: async ({ orderId, newStatus }: { orderId: string; newStatus: string }) => {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast({ title: "وضعیت سفارش بروزرسانی شد" });
    },
    onError: () => {
      toast({ title: "خطا در بروزرسانی وضعیت", variant: "destructive" });
    },
  });

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = 
        order.phone?.includes(searchQuery) ||
        order.tracking_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const paidOrders = orders.filter(o => o.status !== "pending" && o.status !== "cancelled");
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total_amount, 0);
    const pendingOrders = orders.filter(o => o.status === "pending" || o.status === "paid" || o.status === "processing").length;
    
    return {
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders,
      deliveredOrders: orders.filter(o => o.status === "delivered").length,
    };
  }, [orders]);

  if (adminLoading || ordersLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-destructive">دسترسی غیرمجاز</h1>
          <p className="text-muted-foreground mt-2">شما دسترسی به این بخش را ندارید</p>
          <Link to="/">
            <Button className="mt-4">بازگشت به صفحه اصلی</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status);
    return (
      <span className={`px-2 py-1 rounded-full text-xs text-white ${statusOption?.color || 'bg-gray-500'}`}>
        {statusOption?.label || status}
      </span>
    );
  };

  return (
    <>
      <Helmet>
        <title>داشبورد مدیریت | موبایل مارکت</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary">صفحه اصلی</Link>
            <span>/</span>
            <Link to="/admin" className="hover:text-primary">پنل مدیریت</Link>
            <span>/</span>
            <span className="text-foreground">داشبورد سفارشات</span>
          </div>

          <h1 className="text-3xl font-bold mb-8">داشبورد مدیریت سفارشات</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">کل سفارشات</p>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">مجموع فروش</p>
                  <p className="text-2xl font-bold text-green-500">{formatPrice(stats.totalRevenue)}</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Package className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">در انتظار پردازش</p>
                  <p className="text-2xl font-bold text-yellow-500">{stats.pendingOrders}</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">تحویل شده</p>
                  <p className="text-2xl font-bold text-purple-500">{stats.deliveredOrders}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="glass-card rounded-xl p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="جستجو بر اساس موبایل یا کد پیگیری..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="فیلتر وضعیت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="glass-card rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">کد پیگیری</TableHead>
                  <TableHead className="text-right">موبایل</TableHead>
                  <TableHead className="text-right">مبلغ</TableHead>
                  <TableHead className="text-right">وضعیت</TableHead>
                  <TableHead className="text-right">تاریخ</TableHead>
                  <TableHead className="text-right">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      سفارشی یافت نشد
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">
                        {order.tracking_code || "-"}
                      </TableCell>
                      <TableCell dir="ltr" className="text-right">
                        {order.phone}
                      </TableCell>
                      <TableCell className="text-primary font-bold">
                        {formatPrice(order.total_amount)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.status)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("fa-IR")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              تغییر وضعیت
                              <ChevronDown className="h-4 w-4 mr-1" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {statusOptions.map((status) => (
                              <DropdownMenuItem
                                key={status.value}
                                onClick={() => updateStatus.mutate({ 
                                  orderId: order.id, 
                                  newStatus: status.value 
                                })}
                                disabled={order.status === status.value}
                              >
                                <span className={`w-2 h-2 rounded-full ${status.color} ml-2`} />
                                {status.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Orders Details (expandable) */}
          {filteredOrders.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">جزئیات آدرس‌ها</h2>
              <div className="grid gap-4">
                {filteredOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="glass-card rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-mono text-sm text-primary">{order.tracking_code || order.id.slice(0, 8)}</p>
                        <p className="text-sm mt-1">{order.shipping_address}</p>
                        {order.notes && (
                          <p className="text-xs text-muted-foreground mt-1">یادداشت: {order.notes}</p>
                        )}
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AdminDashboard;
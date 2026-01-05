import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Phone, Lock, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const passwordSchema = z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد");

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};
    
    try {
      passwordSchema.parse(password);
    } catch {
      newErrors.password = "رمز عبور باید حداقل ۶ کاراکتر باشد";
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "رمز عبور و تکرار آن مطابقت ندارند";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        toast({ title: error.message, variant: "destructive" });
      } else {
        setSuccess(true);
        toast({ title: "رمز عبور با موفقیت تغییر کرد" });
        setTimeout(() => navigate("/auth"), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Helmet>
          <title>رمز عبور تغییر کرد | موبایل مارکت</title>
        </Helmet>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="w-full max-w-md text-center">
            <div className="glass-card rounded-2xl p-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">رمز عبور تغییر کرد!</h1>
              <p className="text-muted-foreground mb-4">
                در حال انتقال به صفحه ورود...
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>تغییر رمز عبور | موبایل مارکت</title>
        <meta name="description" content="تغییر رمز عبور حساب کاربری" />
      </Helmet>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center gap-2 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center neon-glow">
              <Phone className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold gradient-text">موبایل مارکت</span>
          </Link>

          {/* Form Card */}
          <div className="glass-card rounded-2xl p-8">
            <h1 className="text-2xl font-bold text-center mb-2">تغییر رمز عبور</h1>
            <p className="text-muted-foreground text-center mb-6">
              رمز عبور جدید خود را وارد کنید
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">رمز عبور جدید</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="رمز عبور جدید"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pr-10 pl-10 ${errors.password ? "border-destructive" : ""}`}
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">تکرار رمز عبور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="تکرار رمز عبور"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                    dir="ltr"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "تغییر رمز عبور"
                )}
              </Button>
            </form>
          </div>

          {/* Back to login */}
          <div className="text-center mt-6">
            <Link to="/auth" className="text-muted-foreground hover:text-primary">
              بازگشت به صفحه ورود
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;

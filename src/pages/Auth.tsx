import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Phone, Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const emailSchema = z.string().email("ایمیل معتبر نیست");
const passwordSchema = z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد");

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse(email);
    } catch {
      setErrors({ email: "ایمیل معتبر نیست" });
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        toast({ title: error.message, variant: "destructive" });
      } else {
        setResetEmailSent(true);
        toast({ title: "لینک بازنشانی به ایمیل شما ارسال شد" });
      }
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    try {
      emailSchema.parse(email);
    } catch {
      newErrors.email = "ایمیل معتبر نیست";
    }
    
    try {
      passwordSchema.parse(password);
    } catch {
      newErrors.password = "رمز عبور باید حداقل ۶ کاراکتر باشد";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login")) {
            toast({ title: "ایمیل یا رمز عبور اشتباه است", variant: "destructive" });
          } else {
            toast({ title: error.message, variant: "destructive" });
          }
        } else {
          toast({ title: "ورود موفقیت‌آمیز بود" });
          navigate("/");
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          if (error.message.includes("already registered")) {
            toast({ title: "این ایمیل قبلاً ثبت‌نام کرده است", variant: "destructive" });
          } else {
            toast({ title: error.message, variant: "destructive" });
          }
        } else {
          toast({ title: "ثبت‌نام موفقیت‌آمیز بود! می‌توانید وارد شوید" });
          navigate("/");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Forgot password form
  if (forgotPassword) {
    return (
      <>
        <Helmet>
          <title>فراموشی رمز عبور | موبایل مارکت</title>
        </Helmet>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <Link to="/" className="flex items-center justify-center gap-2 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center neon-glow">
                <Phone className="h-7 w-7 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold gradient-text">موبایل مارکت</span>
            </Link>

            <div className="glass-card rounded-2xl p-8">
              {resetEmailSent ? (
                <div className="text-center">
                  <Mail className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h1 className="text-2xl font-bold mb-2">ایمیل ارسال شد!</h1>
                  <p className="text-muted-foreground mb-4">
                    لینک بازنشانی رمز عبور به ایمیل شما ارسال شد. لطفاً صندوق ورودی خود را بررسی کنید.
                  </p>
                  <Button
                    onClick={() => {
                      setForgotPassword(false);
                      setResetEmailSent(false);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    بازگشت به ورود
                  </Button>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-center mb-2">فراموشی رمز عبور</h1>
                  <p className="text-muted-foreground text-center mb-6">
                    ایمیل خود را وارد کنید تا لینک بازنشانی برایتان ارسال شود
                  </p>

                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="resetEmail">ایمیل</Label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="resetEmail"
                          type="email"
                          placeholder="email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`pr-10 ${errors.email ? "border-destructive" : ""}`}
                          dir="ltr"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
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
                        "ارسال لینک بازنشانی"
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotPassword(false);
                        setErrors({});
                      }}
                      className="text-primary hover:underline"
                    >
                      بازگشت به ورود
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isLogin ? "ورود" : "ثبت‌نام"} | موبایل مارکت</title>
        <meta name="description" content="ورود یا ثبت‌نام در فروشگاه موبایل مارکت" />
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
            <h1 className="text-2xl font-bold text-center mb-2">
              {isLogin ? "ورود به حساب" : "ثبت‌نام"}
            </h1>
            <p className="text-muted-foreground text-center mb-6">
              {isLogin
                ? "خوش آمدید! لطفاً وارد شوید"
                : "یک حساب کاربری بسازید"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">نام و نام خانوادگی</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="نام خود را وارد کنید"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">ایمیل</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pr-10 ${errors.email ? "border-destructive" : ""}`}
                    dir="ltr"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">رمز عبور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="رمز عبور"
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

              {isLogin && (
                <div className="text-left">
                  <button
                    type="button"
                    onClick={() => setForgotPassword(true)}
                    className="text-sm text-primary hover:underline"
                  >
                    فراموشی رمز عبور؟
                  </button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isLogin ? (
                  "ورود"
                ) : (
                  "ثبت‌نام"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="text-primary hover:underline"
              >
                {isLogin
                  ? "حساب ندارید؟ ثبت‌نام کنید"
                  : "قبلاً ثبت‌نام کرده‌اید؟ وارد شوید"}
              </button>
            </div>
          </div>

          {/* Back to home */}
          <div className="text-center mt-6">
            <Link to="/" className="text-muted-foreground hover:text-primary">
              بازگشت به صفحه اصلی
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;

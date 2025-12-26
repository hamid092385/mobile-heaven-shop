import { useState } from "react";
import { Star, Send, Trash2, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useReviews } from "@/hooks/useReviews";
import { Link } from "react-router-dom";

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const {
    reviews,
    isLoading,
    addReview,
    deleteReview,
    userReview,
    averageRating,
    isLoggedIn,
  } = useReviews(productId);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) return;
    addReview.mutate(
      { rating, comment: comment.trim() || undefined },
      {
        onSuccess: () => {
          setRating(5);
          setComment("");
        },
      }
    );
  };

  const StarRating = ({
    value,
    onChange,
    readonly = false,
    size = "md",
  }: {
    value: number;
    onChange?: (rating: number) => void;
    readonly?: boolean;
    size?: "sm" | "md" | "lg";
  }) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
    };

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            className={`${readonly ? "cursor-default" : "cursor-pointer"} transition-colors`}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readonly && setHoverRating(star)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
          >
            <Star
              className={`${sizeClasses[size]} ${
                star <= (hoverRating || value)
                  ? "fill-accent text-accent"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="flex items-center gap-6 p-6 rounded-2xl bg-surface-light border border-border/50">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary">
            {averageRating.toFixed(1)}
          </div>
          <StarRating value={Math.round(averageRating)} readonly size="sm" />
          <div className="text-sm text-muted-foreground mt-1">
            از {reviews.length} نظر
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length;
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-3">{star}</span>
                <Star className="h-3 w-3 fill-accent text-accent" />
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-muted-foreground">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Review Form */}
      {isLoggedIn ? (
        !userReview ? (
          <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-surface-light border border-border/50 space-y-4">
            <h3 className="font-bold text-foreground">نظر خود را ثبت کنید</h3>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">امتیاز شما:</span>
              <StarRating value={rating} onChange={setRating} size="lg" />
            </div>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="نظر خود را بنویسید (اختیاری)..."
              rows={3}
              maxLength={500}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {comment.length}/500
              </span>
              <Button type="submit" disabled={addReview.isPending}>
                {addReview.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                ) : (
                  <Send className="h-4 w-4 ml-2" />
                )}
                ثبت نظر
              </Button>
            </div>
          </form>
        ) : (
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-center">
            شما قبلاً نظر خود را ثبت کرده‌اید
          </div>
        )
      ) : (
        <div className="p-6 rounded-2xl bg-surface-light border border-border/50 text-center">
          <p className="text-muted-foreground mb-4">برای ثبت نظر وارد حساب کاربری شوید</p>
          <Link to="/auth">
            <Button>ورود به حساب</Button>
          </Link>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-foreground">نظرات کاربران ({reviews.length})</h3>
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            هنوز نظری ثبت نشده است. اولین نفری باشید که نظر می‌دهد!
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="p-4 rounded-xl bg-surface-light border border-border/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <StarRating value={review.rating} readonly size="sm" />
                        <span className="text-sm font-medium text-foreground">
                          {review.rating}/5
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString("fa-IR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                  {userReview?.id === review.id && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => deleteReview.mutate(review.id)}
                      disabled={deleteReview.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {review.comment && (
                  <p className="mt-3 text-foreground leading-relaxed">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Star, ThumbsUp, Info } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Button,
} from "@/components/ui/shadcn";
import { Review, useProductDetail } from "@/mock";
import { cn } from "@/lib/utils";

// NOTE: This component renders FRONTEND-ONLY, FULLY MOCKED reviews.
// All review data comes from the in-memory mock store in src/mock.ts.
// There is NO backend. Any interactions (sorting, helpful votes) are
// purely client-side state and are not persisted.

export interface ReviewSectionProps {
  productId?: string;
  className?: string;
}

type SortMode = "helpful" | "newest";

const SORT_OPTIONS: { id: SortMode; label: string }[] = [
  { id: "helpful", label: "Most helpful" },
  { id: "newest", label: "Newest" },
];

function sortReviews(list: Review[], mode: SortMode): Review[] {
  const reviews = [...list];
  if (mode === "helpful") {
    return reviews.sort((a, b) => b.helpfulVotes - a.helpfulVotes);
  }
  if (mode === "newest") {
    return reviews.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }
  return reviews;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index + 1 <= rating;
        return (
          <Star
            key={index}
            className={cn(
              "h-4 w-4 transition-colors",
              filled
                ? "fill-amber-500 text-amber-500"
                : "text-muted-foreground/40",
            )}
          />
        );
      })}
    </div>
  );
}

const helpfulVariants = {
  initial: { scale: 1 },
  tap: { scale: 0.94 },
};

export const ReviewSection: React.FC<ReviewSectionProps> = ({ productId, className }) => {
  const { reviews } = useProductDetail(productId ?? "");
  const [sort, setSort] = useState<SortMode>("helpful");
  // local optimistic helpful state (mocked, not persisted)
  const [localHelpful, setLocalHelpful] = useState<Record<string, number>>({});

  const sorted = useMemo(() => sortReviews(reviews, sort), [reviews, sort]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return Math.round((total / reviews.length) * 10) / 10;
  }, [reviews]);

  const handleHelpful = (id: string) => {
    setLocalHelpful((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  };

  const totalReviews = reviews.length;

  return (
    <section
      className={cn(
        "w-full border-t border-border/60 bg-background/80 backdrop-blur-sm",
        className,
      )}
      aria-label="Customer reviews"
    >
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Summary column */}
          <div className="lg:col-span-4 min-w-0 flex flex-col gap-4">
            <Card className="bg-muted/40 border-border/60 shadow-sm">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between w-full">
                  <CardTitle className="text-lg font-semibold tracking-tight font-['Playfair_Display']">
                    Patron impressions
                  </CardTitle>
                  {totalReviews > 0 && (
                    <Badge className="rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-medium px-3 py-1">
                      {averageRating.toFixed(1)} ★
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-sm text-muted-foreground whitespace-normal break-words">
                  Every pair is hand-finished in Rajasthan. These notes are from early Jootiya patrons.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {totalReviews > 0 ? (
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-3xl font-semibold tracking-tight font-['Playfair_Display']">
                        {averageRating.toFixed(1)}
                      </span>
                      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        AVERAGE RATING
                      </span>
                    </div>
                    <div className="h-12 w-px bg-border/70" />
                    <div className="flex flex-col gap-1">
                      <StarRating rating={averageRating} />
                      <span className="text-xs text-muted-foreground">
                        Based on {totalReviews} review{totalReviews === 1 ? "" : "s"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    This pair is fresh from the atelier. Be the first to leave an impression.
                  </p>
                )}

                <div className="pt-2 border-t border-border/60 mt-2 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Info className="h-3.5 w-3.5" />
                    <span className="whitespace-normal break-words">
                      Reviews are fully mocked and live only in your browser for this preview.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSort(option.id)}
                        className={cn(
                          "rounded-full border px-3 py-1 transition-colors text-xs font-medium flex items-center gap-1.5",
                          sort === option.id
                            ? "bg-amber-900 text-amber-50 border-amber-800"
                            : "bg-background text-muted-foreground border-border hover:bg-muted/80",
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reviews column */}
          <div className="lg:col-span-8 min-w-0">
            {sorted.length === 0 ? (
              <Card className="bg-muted/40 border-dashed border-border/60">
                <CardContent className="py-10 flex flex-col items-start gap-3">
                  <p className="text-sm text-muted-foreground whitespace-normal break-words max-w-prose">
                    No stories yet for this mojri. Early patrons often share how they styled their pair and where it travelled with them.
                  </p>
                  <Badge className="rounded-full bg-indigo-50 text-indigo-900 border border-indigo-100 text-xs px-3 py-1">
                    Mock preview
                  </Badge>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col gap-4">
                {sorted.map((review) => {
                  const optimisticHelpful = review.helpfulVotes + (localHelpful[review.id] ?? 0);
                  return (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                    >
                      <Card className="bg-background/90 border-border/70 shadow-sm">
                        <CardContent className="pt-5 pb-4 flex flex-col gap-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-9 w-9 border border-border/60 bg-muted/80">
                                {/* Mock-only avatar; no remote fetch */}
                                <AvatarImage src={undefined as unknown as string} alt={review.userName} />
                                <AvatarFallback className="bg-amber-900 text-amber-50 text-xs font-semibold">
                                  {review.avatarInitials}
                                </AvatarFallback>
                              </Avatar>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="text-sm font-medium leading-tight whitespace-normal break-words">
                                    {review.userName}
                                  </p>
                                  <Badge className="rounded-full bg-indigo-50 text-indigo-900 border border-indigo-100 text-[10px] font-medium px-2 py-0.5">
                                    Verified mock patron
                                  </Badge>
                                </div>
                                <StarRating rating={review.rating} />
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <h4 className="text-sm font-semibold tracking-tight whitespace-normal break-words">
                              {review.title}
                            </h4>
                            <p className="text-sm text-muted-foreground whitespace-normal break-words leading-relaxed">
                              {review.body}
                            </p>
                          </div>

                          <div className="flex items-center justify-between gap-3 pt-1 flex-wrap">
                            <motion.button
                              type="button"
                              variants={helpfulVariants}
                              whileTap="tap"
                              initial="initial"
                              onClick={() => handleHelpful(review.id)}
                              className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/60 px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                              <ThumbsUp className="h-3.5 w-3.5" />
                              <span>Helpful</span>
                              <span className="text-[10px] text-muted-foreground/80">
                                {optimisticHelpful}
                              </span>
                            </motion.button>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 rounded-full border border-dashed border-border/60 text-muted-foreground hover:bg-muted/80"
                                >
                                  <Info className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
                                These interactions are a preview only. In a full build, your feedback would help future patrons choose their perfect mojri.
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
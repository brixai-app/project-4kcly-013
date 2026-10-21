import { useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BadgeCheck, MessageSquare, Star } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Card,
  CardContent,
  Progress,
  Separator,
} from '@/components/ui/shadcn';
import { getReviews, getReviewSummary } from '@/mock';

function RatingStars({ rating, label }: { rating: number; label?: string }) {
  return (
    <span
      role="img"
      aria-label={label ?? `${rating.toFixed(1)} out of 5 stars`}
      className="inline-flex shrink-0 items-center gap-1 text-[#783d48] dark:text-[#e6b8aa]"
    >
      {Array.from({ length: 5 }, (_, index) => {
        const fill = Math.max(0, Math.min(1, rating - index));
        return (
          <span key={index} className="relative block h-4 w-4" aria-hidden="true">
            <Star className="h-4 w-4 text-[#b9a998] dark:text-[#a39284]" strokeWidth={1.5} />
            <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="h-4 w-4 max-w-none fill-current" strokeWidth={1.5} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

function formatReviewDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(date);
}

export function ReviewSection({ productId, className = '' }: { productId: string; className?: string }) {
  const headingId = useId();
  const noticeId = useId();
  const reduceMotion = useReducedMotion();
  const reviews = getReviews(productId);
  const summary = getReviewSummary(productId);

  return (
    <section
      aria-labelledby={headingId}
      aria-describedby={noticeId}
      className={`w-full bg-[#f5efe6] py-16 text-[#352b26] dark:bg-[#241f1c] dark:text-[#f3e9dc] sm:py-20 lg:py-24 ${className}`}
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 lg:px-12">
        <div className="flex w-full flex-wrap items-start justify-between gap-6">
          <div className="min-w-0">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#795e50] dark:text-[#cbb6a4]">
              A closer look
            </p>
            <h2 id={headingId} className="whitespace-normal break-words font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
              Words from the collection
            </h2>
          </div>
          <Badge variant="outline" className="rounded-full border-[#cdbbae] bg-transparent px-4 py-2 text-xs font-medium text-[#694535] dark:border-[#67564a] dark:text-[#e1c6b6]">
            Sample reviews
          </Badge>
        </div>

        <p id={noticeId} className="mt-5 text-sm leading-relaxed text-[#725f52] dark:text-[#cbb9aa]">
          Fictional customer reviews for this browser-only demo, not real purchase feedback. No backend or payment processing is connected.
        </p>

        <Separator className="my-8 bg-[#ddcfc0] dark:bg-[#514439] lg:my-10" />

        {reviews.length === 0 ? (
          <Card className="rounded-none border-[#ddcfc0] bg-[#fbf7f0] shadow-none dark:border-[#514439] dark:bg-[#2e2722]">
            <CardContent className="flex flex-col items-start gap-4 p-6 sm:p-10">
              <MessageSquare className="h-7 w-7 text-[#783d48] dark:text-[#e6b8aa]" aria-hidden="true" strokeWidth={1.4} />
              <h3 className="font-serif text-2xl">A story yet to be shared</h3>
              <p className="text-sm leading-7 text-[#725f52] dark:text-[#cbb9aa]">
                There are no sample reviews for this pair yet. Explore the product details, fit guidance and artisan story to learn more. Review submissions are not available in this demonstration.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <aside className="min-w-0 lg:col-span-4" aria-label="Sample review rating summary">
              <div className="flex flex-wrap items-end gap-4">
                <span className="font-serif text-6xl leading-none sm:text-7xl" aria-label={`Average rating ${summary.average.toFixed(1)} out of 5`}>
                  {summary.average.toFixed(1)}
                </span>
                <div className="pb-1">
                  <RatingStars rating={summary.average} />
                  <p className="mt-2 text-sm text-[#725f52] dark:text-[#cbb9aa]">
                    Based on {summary.count} sample {summary.count === 1 ? 'review' : 'reviews'}
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-4" aria-label="Rating distribution">
                {summary.distribution.map(({ rating, count }) => (
                  <div key={rating} className="flex min-w-0 items-center gap-3">
                    <span className="w-12 shrink-0 text-sm text-[#725f52] dark:text-[#cbb9aa]" aria-hidden="true">
                      {rating} {rating === 1 ? 'star' : 'stars'}
                    </span>
                    <Progress
                      value={summary.count ? (count / summary.count) * 100 : 0}
                      aria-label={`${rating}-star sample reviews`}
                      aria-valuetext={`${count} of ${summary.count} sample reviews`}
                      className="h-1.5 min-w-0 flex-1 bg-[#e2d5c6] dark:bg-[#54463b] [&>div]:bg-[#783d48] dark:[&>div]:bg-[#e6b8aa]"
                    />
                    <span className="w-6 shrink-0 text-right text-sm tabular-nums text-[#725f52] dark:text-[#cbb9aa]" aria-hidden="true">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </aside>

            <div className="min-w-0 space-y-5 lg:col-span-8">
              {reviews.map((review, index) => {
                const formattedDate = formatReviewDate(review.date);
                const initials = review.name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join('').toUpperCase();

                return (
                  <motion.article
                    key={`${productId}-${review.id}`}
                    aria-label={`Sample review by ${review.name}`}
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion ? 0 : Math.min(index * 0.06, 0.18) }}
                    className="min-w-0"
                  >
                    <Card className="rounded-none border-[#ddcfc0] bg-[#fbf7f0] shadow-none dark:border-[#514439] dark:bg-[#2e2722]">
                      <CardContent className="p-6 sm:p-8">
                        <div className="flex w-full flex-wrap items-start justify-between gap-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <Avatar className="h-11 w-11 shrink-0">
                              <AvatarFallback className="bg-[#e9ddce] text-sm text-[#654636] dark:bg-[#514036] dark:text-[#f0d9c6]">
                                {initials || 'G'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="break-words text-sm font-medium">{review.name}</p>
                              {formattedDate && (
                                <time dateTime={review.date} className="mt-1 block text-xs text-[#725f52] dark:text-[#cbb9aa]">
                                  {formattedDate}
                                </time>
                              )}
                            </div>
                          </div>
                          {review.verified === true && (
                            <Badge variant="outline" className="max-w-full gap-1.5 whitespace-normal rounded-full border-[#cdbbae] bg-transparent px-3 py-1 text-xs text-[#694535] dark:border-[#67564a] dark:text-[#e1c6b6]">
                              <BadgeCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                              Verified purchase · sample record
                            </Badge>
                          )}
                        </div>
                        <div className="mt-6">
                          <RatingStars rating={review.rating} />
                          <h3 className="mt-3 whitespace-normal break-words font-serif text-xl leading-snug sm:text-2xl">
                            {review.title}
                          </h3>
                          <p className="mt-3 whitespace-normal break-words text-sm leading-7 text-[#725f52] dark:text-[#cbb9aa]">
                            {review.text}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ReviewSection;
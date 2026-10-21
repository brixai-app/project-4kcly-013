import React, { useId, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MessageSquare, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, Badge, Button, Input, Textarea } from '@/components/ui/shadcn';
import { formatDate, getProductReviews, getReviewSummary, useStore } from '@/mock';
import { cn } from '@/lib/utils';

export interface ReviewSectionProps {
  productId: string;
  className?: string;
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <span role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`} className="inline-flex gap-1 text-primary">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={cn('h-4 w-4', index < Math.round(rating) ? 'fill-current' : 'text-muted-foreground/40')}
        />
      ))}
    </span>
  );
}

function ReviewForm({ productId }: { productId: string }) {
  const id = useId();
  const submitReview = useStore(state => state.submitReview);
  const storageStatus = useStore(state => state.storageStatus);
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const ratingRef = useRef<HTMLButtonElement>(null);
  const submissionLock = useRef(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submissionLock.current) return;
    setError('');
    if (!rating) {
      setError('Choose a rating from 1 to 5 before submitting.');
      ratingRef.current?.focus();
      return;
    }
    const form = event.currentTarget;
    const data = new FormData(form);
    submissionLock.current = true;
    setSaving(true);
    try {
      const result = submitReview({
        productId,
        name: String(data.get('name') ?? ''),
        rating,
        text: String(data.get('text') ?? ''),
      });
      if (!result.ok) {
        setError(result.message);
        toast.error(result.message);
        return;
      }
      form.reset();
      setRating(0);
      const memoryOnly = useStore.getState().storageStatus === 'memory-only';
      toast.success(memoryOnly
        ? 'Demo review added for this session. Browser storage is unavailable; it will not survive a reload.'
        : result.message);
    } catch {
      const message = 'Your demo review could not be saved. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      submissionLock.current = false;
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="min-w-0 space-y-6" aria-labelledby={`${id}-heading`}>
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your perspective</p>
        <h3 id={`${id}-heading`} className="break-words font-serif text-3xl">Leave a demo review</h3>
        <p id={`${id}-notice`} className="text-sm leading-relaxed text-muted-foreground">
          Try the review experience. Feedback stays in this browser only, is not published online, and does not represent a verified purchase.
        </p>
      </div>
      <div className="space-y-2">
        <label htmlFor={`${id}-name`} className="text-sm font-medium">Display name <span className="text-muted-foreground">(required)</span></label>
        <Input
          id={`${id}-name`}
          name="name"
          autoComplete="nickname"
          placeholder="How should we credit you?"
          required
          minLength={2}
          maxLength={60}
          className="h-12 bg-background"
        />
      </div>
      <fieldset className="min-w-0 space-y-3">
        <legend className="text-sm font-medium">Your rating <span className="text-muted-foreground">(required)</span></legend>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a rating from 1 to 5 stars">
          {Array.from({ length: 5 }, (_, index) => {
            const value = index + 1;
            return (
              <Button
                key={value}
                ref={value === 1 ? ratingRef : undefined}
                type="button"
                variant="outline"
                aria-pressed={rating === value}
                aria-label={`${value} ${value === 1 ? 'star' : 'stars'}`}
                onClick={() => { setRating(value); setError(''); }}
                className={cn(
                  'h-11 gap-2 rounded-full px-4 transition-colors',
                  rating === value && 'border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground',
                )}
              >
                <span>{value}</span>
                <Star aria-hidden="true" className={cn('h-4 w-4', rating === value && 'fill-current')} />
              </Button>
            );
          })}
        </div>
      </fieldset>
      <div className="space-y-2">
        <label htmlFor={`${id}-text`} className="text-sm font-medium">Your review <span className="text-muted-foreground">(required)</span></label>
        <Textarea
          id={`${id}-text`}
          name="text"
          required
          minLength={10}
          maxLength={1500}
          rows={5}
          placeholder="What catches your eye about this Mojri design?"
          aria-describedby={`${id}-help ${id}-notice`}
          className="min-h-36 resize-y bg-background"
        />
        <p id={`${id}-help`} className="text-xs text-muted-foreground">10–1,500 characters. Please do not include contact or payment details.</p>
      </div>
      {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}
      {storageStatus === 'memory-only' && (
        <p role="status" className="text-sm text-muted-foreground">Browser storage is unavailable. Your review will remain only until this page is reloaded.</p>
      )}
      <Button type="submit" disabled={saving} aria-busy={saving} className="min-h-12 w-full px-7 sm:w-auto">
        {saving ? 'Saving demo review…' : 'Submit demo review'}
      </Button>
    </form>
  );
}

export function ReviewSection({ productId, className }: ReviewSectionProps) {
  const reviews = useStore(state => state.reviews);
  const reducedMotion = useReducedMotion();
  const headingId = useId();
  const entries = useMemo(() => getProductReviews(productId, reviews), [productId, reviews]);
  const summary = useMemo(() => getReviewSummary(productId, reviews), [productId, reviews]);

  return (
    <section aria-labelledby={headingId} className={cn('w-full border-t border-border bg-background py-16 text-foreground lg:py-24', className)}>
      <div className="mx-auto w-full max-w-[1600px] px-6 lg:px-12">
        <div className="mb-12 flex w-full flex-wrap items-end justify-between gap-6">
          <div className="min-w-0 space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">The conversation around craft</p>
            <h2 id={headingId} className="whitespace-normal break-words font-serif text-4xl md:text-5xl">Notes on the details</h2>
          </div>
          <Badge variant="outline" className="rounded-full px-4 py-2">Demo reviews · Not verified purchases</Badge>
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="min-w-0 lg:col-span-7">
            <div className="grid min-w-0 gap-8 border-b border-border pb-10 sm:grid-cols-[auto_1fr] sm:gap-12">
              <div className="space-y-3">
                <p className="font-serif text-6xl" aria-label={summary.count ? `Average rating ${summary.average.toFixed(1)} out of 5` : 'No ratings yet'}>
                  {summary.count ? summary.average.toFixed(1) : '—'}
                </p>
                <RatingStars rating={summary.average} />
                <p className="text-sm text-muted-foreground">{summary.count} demo {summary.count === 1 ? 'review' : 'reviews'}</p>
              </div>
              <div className="min-w-0 space-y-3" aria-label="Rating distribution">
                {[5, 4, 3, 2, 1].map(stars => {
                  const count = summary.distribution[stars] ?? 0;
                  const percent = summary.count ? count / summary.count * 100 : 0;
                  return (
                    <div key={stars} className="flex items-center gap-3 text-sm" aria-label={`${stars} stars: ${count} reviews`}>
                      <span className="w-12 shrink-0 text-muted-foreground">{stars} star</span>
                      <div aria-hidden="true" className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary motion-safe:transition-[width] motion-safe:duration-500" style={{ width: `${percent}%` }} />
                      </div>
                      <span aria-hidden="true" className="w-6 shrink-0 text-right tabular-nums text-muted-foreground">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {entries.length ? (
              <ul className="divide-y divide-border">
                {entries.map(review => (
                  <motion.li key={review.id} initial={reducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }} className="min-w-0 py-8">
                    <article className="space-y-4">
                      <header className="flex w-full flex-wrap items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <Avatar className="h-10 w-10 shrink-0">
                            <AvatarFallback className="bg-muted text-xs text-foreground">{review.name.split(/\s+/).map(part => part.charAt(0)).slice(0, 2).join('').toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="break-words text-sm font-medium">{review.name}</p>
                            <p className="text-xs text-muted-foreground">{review.source === 'seed' ? 'Illustrative demo persona' : 'Browser visitor · Demo submission'}</p>
                          </div>
                        </div>
                        <time dateTime={review.createdAt} className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</time>
                      </header>
                      <RatingStars rating={review.rating} />
                      {review.title && <h3 className="break-words font-serif text-xl">{review.title}</h3>}
                      <p className="whitespace-pre-wrap break-words text-sm leading-7 text-muted-foreground">{review.text}</p>
                    </article>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <div className="space-y-4 py-12">
                <MessageSquare aria-hidden="true" className="h-7 w-7 text-muted-foreground" />
                <h3 className="font-serif text-2xl">A conversation waiting to begin</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">No demo reviews for this design yet. Share a first impression using the form; nothing is published or sent to a backend.</p>
              </div>
            )}
          </div>
          <aside className="min-w-0 border-t border-border pt-10 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <ReviewForm key={productId} productId={productId} />
          </aside>
        </div>
      </div>
    </section>
  );
}

export default ReviewSection;
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, ChevronDown, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

type ProductDetailModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  product?: Product | null;
  className?: string;
};

const fallbackProduct: Product = {
  id: 'jootiya-fallback',
  name: 'Jodhpur Mojri',
  slug: 'jodhpur-mojri',
  price: 2499,
  image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
  category: 'Mojri',
  collection: 'Heritage Edit',
  description: 'Hand-finished leather mojri shaped in Jodhpur with a refined almond toe and cushioned lining.',
  artisanId: 'artisan-1',
  sizes: ['6', '7', '8', '9', '10'],
  colors: ['Terracotta', 'Indigo', 'Ivory'],
  featured: true,
  inStock: true,
  material: 'Leather',
  origin: 'Jodhpur, Rajasthan',
};

export function ProductDetailModal({
  open = false,
  onOpenChange = () => {},
  product = null,
  className = '',
}: ProductDetailModalProps = {}) {
  const { addItem } = useCart() as any;
  const item = product ?? fallbackProduct;
  const gallery = useMemo(() => [item.image, ...(item.gallery ?? [])].filter(Boolean), [item]);
  const sizes = item.sizes?.length ? item.sizes : ['6', '7', '8', '9', '10'];
  const colors = item.colors?.length ? item.colors : ['Terracotta', 'Indigo', 'Ivory'];
  const [selectedImage, setSelectedImage] = useState(gallery[0] ?? item.image);
  const [selectedSize, setSelectedSize] = useState(sizes[0] ?? '');
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? '');

  useEffect(() => {
    setSelectedImage(gallery[0] ?? item.image);
    setSelectedSize(sizes[0] ?? '');
    setSelectedColor(colors[0] ?? '');
  }, [item.id, gallery, sizes, colors, item.image]);

  const handleAdd = () => {
    if (!item?.id) return;
    addItem?.({ productId: item.id, quantity: 1, size: selectedSize || undefined, color: selectedColor || undefined });
    toast.success('Added to cart');
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#17130F]/60 backdrop-blur-[2px]" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-[min(96vw,1100px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-sm border border-[#CBBCA7] bg-[#FFFDF8] text-[#17130F] shadow-2xl outline-none',
            className,
          )}
        >
          <div className="grid max-h-[92vh] grid-cols-1 md:grid-cols-[1.15fr_0.85fr]">
            <div className="relative min-h-[52vh] bg-[#F6F0E5]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={selectedImage}
                  alt={item.name ?? 'Product image'}
                  crossOrigin="anonymous"
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="h-full w-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-sm border border-[#CBBCA7] bg-[#FFFDF8]/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6F6254] backdrop-blur">
                <span>{item.collection ?? 'Heritage Edit'}</span>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-sm border border-[#CBBCA7] bg-[#FFFDF8]/90 text-[#17130F] backdrop-blur transition hover:bg-[#F6F0E5]"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const current = gallery.indexOf(selectedImage);
                    setSelectedImage(gallery[(current - 1 + gallery.length) % gallery.length] ?? item.image);
                  }}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-[#CBBCA7] bg-[#FFFDF8]/90 text-[#17130F] backdrop-blur transition hover:bg-[#F6F0E5]"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="flex max-w-[70%] items-center gap-2 overflow-x-auto">
                  {gallery.map((src) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setSelectedImage(src)}
                      className={cn(
                        'h-14 w-14 shrink-0 overflow-hidden rounded-sm border transition',
                        selectedImage === src ? 'border-[#A8472A]' : 'border-[#CBBCA7]',
                      )}
                    >
                      <img src={src} alt={item.name ?? 'Preview'} crossOrigin="anonymous" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const current = gallery.indexOf(selectedImage);
                    setSelectedImage(gallery[(current + 1) % gallery.length] ?? item.image);
                  }}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-[#CBBCA7] bg-[#FFFDF8]/90 text-[#17130F] backdrop-blur transition hover:bg-[#F6F0E5]"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex min-h-0 flex-col gap-5 overflow-y-auto p-5 md:p-7">
              <Dialog.Title className="font-['Playfair_Display'] text-3xl font-light tracking-tight md:text-4xl">{item.name}</Dialog.Title>
              <div className="flex flex-wrap items-center gap-3 text-sm text-[#6F6254]">
                <span>{item.category ?? 'Mojri'}</span>
                <span className="h-1 w-1 rounded-full bg-[#CBBCA7]" />
                <span>₹{item.price?.toLocaleString('en-IN') ?? '0'}</span>
              </div>
              <Dialog.Description className="text-sm leading-7 text-[#6F6254]">
                {item.description ?? 'A refined handcrafted mojri with a balanced silhouette, made for ceremonial and everyday wear.'}
              </Dialog.Description>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Size">
                  <DropdownSelect value={selectedSize} options={sizes} onChange={setSelectedSize} />
                </Field>
                <Field label="Color">
                  <DropdownSelect value={selectedColor} options={colors} onChange={setSelectedColor} />
                </Field>
              </div>

              <div className="grid gap-3 rounded-sm border border-[#CBBCA7] bg-[#F6F0E5] p-4 text-sm text-[#6F6254]">
                <MetaRow label="Material" value={item.material ?? 'Leather'} />
                <MetaRow label="Origin" value={item.origin ?? 'Jodhpur, Rajasthan'} />
                <MetaRow label="Artisan" value={item.artisanId ?? 'Handcrafted atelier'} />
              </div>

              <div className="mt-auto flex flex-col gap-3 border-t border-[#CBBCA7] pt-5">
                <button
                  type="button"
                  onClick={handleAdd}
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#A8472A] px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#84351F]"
                >
                  <Check className="h-4 w-4" />
                  Add to cart
                </button>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-sm border border-[#CBBCA7] px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#17130F] transition hover:bg-[#F6F0E5]"
                >
                  Continue browsing
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Field({ label = '', children = null }: { label?: string; children?: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6F6254]">{label}</div>
      {children}
    </div>
  );
}

function MetaRow({ label = '', value = '' }: { label?: string; value?: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6F6254]">{label}</span>
      <span className="min-w-0 text-right text-sm text-[#17130F]">{value}</span>
    </div>
  );
}

function DropdownSelect({
  value = '',
  options = [],
  onChange = () => {},
}: {
  value?: string;
  options?: string[];
  onChange?: (value: string) => void;
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 rounded-sm border border-[#CBBCA7] bg-[#FFFDF8] px-4 py-3 text-left text-sm text-[#17130F] transition hover:bg-[#F6F0E5]"
        >
          <span className="min-w-0 truncate">{value || 'Select'}</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-[#6F6254]" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={8}
          className="z-[60] min-w-[var(--radix-dropdown-menu-trigger-width)] overflow-hidden rounded-sm border border-[#CBBCA7] bg-[#FFFDF8] p-1 shadow-xl"
        >
          {options.map((option) => (
            <DropdownMenu.Item
              key={option}
              onSelect={() => onChange(option)}
              className="flex cursor-pointer items-center justify-between rounded-sm px-3 py-2 text-sm text-[#17130F] outline-none transition hover:bg-[#F6F0E5]"
            >
              <span className="min-w-0 truncate">{option}</span>
              {value === option ? <Check className="h-4 w-4 text-[#A8472A]" /> : null}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export default ProductDetailModal;
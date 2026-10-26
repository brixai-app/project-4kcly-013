import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Sparkles, Shield, Truck } from 'lucide-react';
import { CustomOrderForm } from '@/components/HeritageExperiences';

export function CustomOrdersPage() {
  const cues = [
    { icon: Sparkles, title: 'Bespoke finishing', text: 'Hand-selected leather, embroidery, and sole detailing tailored to your brief.' },
    { icon: Clock, title: 'Measured timeline', text: 'Share your event date and we align sampling, approval, and dispatch windows.' },
    { icon: Shield, title: 'Authentic craft', text: 'Every request is routed to Jodhpur artisans with heritage construction methods.' },
    { icon: Truck, title: 'Pan-India delivery', text: 'Secure shipping and careful packaging for ceremonial and destination wear.' },
  ];

  return (
    <main className="bg-[#F5F0E6] text-[#2B2B2B]">
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl gap-10 px-4 py-10 md:grid-cols-[1.05fr_0.95fr] md:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col justify-between border border-[#C9A66B] bg-[#FFF9F0] p-6 md:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6F655B]">Custom orders</p>
            <h1 className="mt-4 max-w-xl font-['Playfair_Display'] text-5xl font-light tracking-tight md:text-6xl">
              A made-to-measure Mojri, shaped for your occasion.
            </h1>
            <p className="mt-5 max-w-xl font-['Lora'] text-base leading-7 text-[#6F655B] md:text-lg">
              Tell us the event, palette, fit, and finish. Our atelier will review your brief and respond with a refined proposal for your bespoke pair.
            </p>
          </div>

          <div className="mt-10 grid gap-4 border-t border-[#C9A66B] pt-6 sm:grid-cols-2">
            {cues.map((cue) => {
              const Icon = cue.icon;
              return (
                <div key={cue.title} className="border border-[#C9A66B] bg-[#F5F0E6] p-4">
                  <Icon className="h-5 w-5 text-[#7B2D26]" />
                  <h2 className="mt-3 text-sm font-semibold uppercase tracking-[0.2em]">{cue.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#6F655B]">{cue.text}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#7B2D26]">
            <span className="h-px flex-1 bg-[#C9A66B]" />
            <span>Start your brief</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.08 }} className="border border-[#C9A66B] bg-[#FFF9F0] p-4 md:p-6">
          <CustomOrderForm className="w-full" />
        </motion.div>
      </section>
    </main>
  );
}

export default CustomOrdersPage;
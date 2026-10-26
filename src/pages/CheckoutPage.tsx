import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Truck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import CheckoutForm from '@/components/CheckoutForm';

export function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#F5F0E6] text-[#2B2B2B]">
      <section className="border-b border-[#C9A66B]/70 bg-[#FFF9F0]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-8 md:grid-cols-[1.1fr_0.9fr] md:px-6 lg:px-8">
          <div className="space-y-6">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#6F655B] transition-colors hover:text-[#7B2D26]"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue shopping
            </Link>
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7B2D26]">Secure checkout</p>
              <h1 className="max-w-2xl font-['Playfair_Display'] text-5xl font-light tracking-tight text-[#2B2B2B] md:text-6xl">
                Complete your Jodhpuri order with quiet precision.
              </h1>
              <p className="max-w-xl font-['Lora'] text-base leading-7 text-[#6F655B]">
                Review your selected mojris, enter shipping details, and confirm a handcrafted pair prepared for dispatch from our atelier.
              </p>
            </div>
          </div>

          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="grid gap-4 self-end border border-[#C9A66B] bg-[#FFF9F0] p-5"
          >
            {[
              { icon: Shield, title: 'Protected payment flow', text: 'Your details are handled through a streamlined, secure checkout experience.' },
              { icon: Truck, title: 'Careful dispatch', text: 'Orders are packed with heritage-grade attention and shipped with tracking.' },
              { icon: CheckCircle2, title: 'Order confirmation', text: 'Receive a confirmation summary immediately after submission.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-[#7B2D26]" />
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2B2B2B]">{item.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-[#6F655B]">{item.text}</p>
                </div>
              </div>
            ))}
          </motion.aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <CheckoutForm className="mx-auto max-w-5xl" />
      </section>
    </main>
  );
}

export default CheckoutPage;
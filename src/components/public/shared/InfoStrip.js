import React from 'react';
import { Wine, LifeBuoy, Truck, BadgeCheck } from 'lucide-react';

const items = [
  {
    icon: Wine,
    text: "Shop at the world's largest wine marketplace with exclusive wine",
  },
  {
    icon: LifeBuoy,
    text: 'We support our customers to the last mile. We are here to help',
  },
  {
    icon: Truck,
    text: 'Carefully and efficiently delivering your orders right to your doorstep',
  },
  {
    icon: BadgeCheck,
    text: 'Check honest and professional review of any wine before you buy',
  },
];

const InfoStrip = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto px-6 py-16 text-cream">
    {items.map(({ icon: Icon, text }, i) => (
      <div key={i} className="flex flex-col items-start gap-4">
        <Icon size={26} strokeWidth={1.5} className="text-gold" />
        <p className="text-sm font-light leading-relaxed text-cream/80">{text}</p>
      </div>
    ))}
  </div>
);

export default InfoStrip;

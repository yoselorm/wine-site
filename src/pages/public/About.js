import React from 'react';
import { Users, Award, Leaf, HandHeart } from 'lucide-react';
import heroImg from '../../assets/images/about/about-us-hero.jpg';
import wineryAerial from '../../assets/images/about/what-makes-us-diff.png';
import vineyardAerial from '../../assets/images/about/own-your-plate-b.jpg';
import convenienceImg from '../../assets/images/about/convenience.jpg';
import ownYourPalateImg from '../../assets/images/about/own-your-plate.jpg';
import experienceImg from '../../assets/images/about/the-experience.jpg';
import premiumImg from '../../assets/images/about/premium-quality.jpg';
import interactionsImg from '../../assets/images/about/interactions.png';

const differentiators = [
  {
    icon: Users,
    text: 'We are a team of friendly and passionate people.',
  },
  {
    icon: Award,
    text: 'With a combined experience and exposure to wine of 25 years.',
  },
  {
    icon: Leaf,
    text: 'We purchase directly from the vineyard, guaranteeing the very best in quality, sourced during and after harvest so nothing sits on a shelf too long.',
  },
  {
    icon: HandHeart,
    text: "For us, business isn't complete until you are satisfied with our service, and once you are confident enough to initiate a repeat purchase and refer a friend.",
  },
];

const AltRow = ({ eyebrow, title, text, image, reverse }) => (
  <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
    <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}>
      <div className="w-full md:w-1/2">
        <img src={image} alt={title} className="w-full aspect-[4/3] object-cover" />
      </div>
      <div className="w-full md:w-1/2">
        {eyebrow && <p className="text-[11px] font-bold uppercase tracking-widest text-gold mb-4">{eyebrow}</p>}
        <h3 className="font-serif text-3xl text-zinc-900 mb-5">{title}</h3>
        <p className="text-zinc-500 font-light leading-relaxed">{text}</p>
      </div>
    </div>
  </section>
);

const About = () => {
  return (
    <div className="bg-cream min-h-screen">
      <section className="relative h-[55vh] md:h-[65vh] w-full flex items-center justify-center overflow-hidden">
        <img src={heroImg} alt="Wine tasting bar" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-forest-dark/60" />
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-serif text-white leading-tight">
            A one-stop shop for all your wine and alcoholic beverage purchases
          </h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="font-serif text-3xl text-zinc-900 mb-14">What Makes Us Different</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {differentiators.map(({ icon: Icon, text }, i) => (
            <div key={i} className="border border-zinc-200 bg-white p-8 flex flex-col items-center text-center hover:border-gold transition-colors">
              <Icon size={28} strokeWidth={1.5} className="text-forest mb-5" />
              <p className="text-sm text-zinc-500 font-light leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <img src={wineryAerial} alt="Aerial view of the winery" className="w-full h-[45vh] md:h-[60vh] object-cover" />

      <AltRow
        eyebrow="Effortless"
        title="Convenience"
        text="Today, we are proud to be the first winery to receive Living Building Challenge certification in all seven performance areas, or 'petals,' from the International Living Future Institute (ILFI). This is inspiring to see such a beautiful facility earn the world's most ambitious standard for regenerative design."
        image={convenienceImg}
      />

      <img src={vineyardAerial} alt="Aerial view of the vineyard" className="w-full h-[45vh] md:h-[60vh] object-cover" />

      <AltRow
        eyebrow="Discover"
        title="Own Your Palate"
        text="Today, we are proud to be the first winery to receive Living Building Challenge certification in all seven performance areas, or 'petals,' from the International Living Future Institute (ILFI). The Living Building Challenge is the built environment's most ambitious performance standard."
        image={ownYourPalateImg}
        reverse
      />

      <AltRow
        eyebrow="Curated"
        title="The Experience"
        text="Today, we are proud to be the first winery to receive Living Building Challenge certification in all seven performance areas, or 'petals,' from the International Living Future Institute (ILFI). For context, this achievement is now shared by only 25 buildings in the world."
        image={experienceImg}
      />

      <AltRow
        eyebrow="Sourced Right"
        title="Premium Quality Drink From Premium Producers"
        text="Today, we are proud to be the first winery to receive the industry's most rigorous certification for craft and quality. Every bottle is tasted, vetted, and verified by our in-house sommeliers before it ever reaches your glass."
        image={premiumImg}
        reverse
      />

      <AltRow
        eyebrow="Anywhere, Anytime"
        title="Interactions"
        text="Browse our full catalogue, filter by taste, region, and pairing, and keep track of every order — all from the same interface our sommeliers use to curate your recommendations."
        image={interactionsImg}
      />
    </div>
  );
};

export default About;

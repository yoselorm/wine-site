import React from 'react';
import { Users, TrendingUp, Grape, ThumbsUp } from 'lucide-react';
import heroImg from '../../assets/images/about/about-us-hero.jpg';
import bannerAfterDiff from '../../assets/images/about/what-makes-us-diff.png';
import convenienceImg from '../../assets/images/about/convenience.jpg';
import ownYourPalateImg from '../../assets/images/about/own-your-plate.jpg';
import bannerBeforeExperience from '../../assets/images/about/own-your-plate-b.jpg';
import experienceImg from '../../assets/images/about/the-experience.jpg';
import premiumImg from '../../assets/images/about/premium-quality.jpg';
import bannerBeforeInteraction from '../../assets/images/about/about-int.jpg';
import interactionsImg from '../../assets/images/about/interactions.png';

const differentiators = [
  { icon: Users, text: 'We are a team of friendly and passionate people' },
  { icon: TrendingUp, text: 'With a combined experience and exposure to wine of 35 years' },
  {
    icon: Grape,
    text:
      'We purchase directly from the vineyards thereby guaranteeing the very best in quality, assistance before/during/ and after purchase and not to forget, the very best prices in the business',
  },
  {
    icon: ThumbsUp,
    text:
      'For us, the business is not complete until you are satisfied with our drinks, our service, and you are confident enough to initiate a repeat purchase and refer a friend',
  },
];

const Row = ({ eyebrow, title, text, image, reverse, imageFit = 'cover' }) => (
  <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
    <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}>
      <div className="w-full md:w-1/2">
        {imageFit === 'contain' ? (
          <img src={image} alt={title} className="w-full h-auto" />
        ) : (
          <img src={image} alt={title} className="w-full aspect-[4/3] object-cover" />
        )}
      </div>
      <div className="w-full md:w-1/2">
        {eyebrow && <p className="text-[11px] font-bold uppercase tracking-widest text-gold mb-3">{eyebrow}</p>}
        <h3 className="font-serif text-3xl text-zinc-900 mb-5">{title}</h3>
        <div className="text-zinc-500 font-light leading-relaxed space-y-4">{text}</div>
      </div>
    </div>
  </section>
);

const About = () => {
  return (
    <div className="bg-cream min-h-screen">
      <section className="relative w-full flex items-center overflow-hidden py-20 md:py-28">
        <img src={heroImg} alt="Wine cellar" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 px-6 max-w-7xl mx-auto w-full">
          <div className="max-w-xl">
            <p className="text-xs text-white/80 mb-3">About Us</p>
            <h1 className="text-3xl md:text-5xl font-serif text-white leading-tight mb-6">
              A one stop shop for all your wine and alcoholic beverage purchase.
            </h1>
            <div className="text-sm text-white/80 leading-relaxed space-y-4">
              <p>
                The inspirational impression and deep connection we make with our customers and suppliers is
                crucial. At Wine2U.com, we seek to inspire a passion for fine wine and alcoholic beverages. By
                offering a dynamic portfolio and a robust platform.
              </p>
              <p>
                Our team of dedicated specialists strives to be the best partner to our suppliers and customers. In
                doing so, we give the finest wines in the world—and the people who bring them to life—the room to
                grow and thrive, and the consumers a "Winetastic" Experience.
              </p>
              <p>
                "THE EXPERIENCE" is what we would like to highlight, and that what we want people to walk away
                with is: "When I go to a restaurant I can have this experience" "when I have an event, I can have
                this experience" "when I purchase wine, this is what I can have in my home".
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="font-serif text-3xl text-zinc-900 mb-16">What Makes Us Different</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y divide-gold/40 md:divide-y-0 border-t md:border-t-0 border-gold/40">
          {differentiators.map(({ icon: Icon, text }, i) => (
            <div
              key={i}
              className={`flex flex-col items-center text-center px-6 py-10 md:py-12 ${
                i % 2 === 0 ? 'md:border-r md:border-gold/40' : ''
              } ${i < 2 ? 'md:border-b md:border-gold/40' : ''}`}
            >
              <Icon size={28} strokeWidth={1.25} className="text-zinc-700 mb-5" />
              <p className="text-sm text-zinc-500 font-light leading-relaxed max-w-xs">{text}</p>
            </div>
          ))}
        </div>

        <p className="text-sm text-zinc-500 font-light leading-relaxed max-w-3xl mx-auto mt-16">
          Our online store has been inspired by you, designed by us and created for you, to simplify your purchase
          of wines and alcoholic beverages. Consider wine2u as your personal online sommelier, wine educator, and
          wine-store where you get to interact with us to assist you with your selection and purchase of wines to
          suit every occasion.
        </p>
      </section>

      <img src={bannerAfterDiff} alt="" aria-hidden="true" className="w-full h-[45vh] md:h-[60vh] object-cover" />

      <Row
        eyebrow="Effortless"
        title="Convenience"
        image={convenienceImg}
        reverse
        text={
          <>
            <p>
              Have you had an experience throwing a party and suddenly finding that the number of guests you
              catered for, has doubled(each person brought a plus one or two) as it happens in our neck of woods?
              And suddenly you are panicking that your drinks will run out? Have you had friends just turn up
              unannounced for home visits and you look in your drink's cupboard, wine fridge or cellar and realise
              that you haven't stocked up? And yet the shops are also closed? And what about the impromptu board
              meeting where your PA has not stocked up from the last meeting?
            </p>
            <p>
              If you experienced any of the above and you were unable to top up, wine2u.com has been designed for
              you. Sit on your sofa, relax and let us bring your favorite drinks home to you. No more last minute
              rush, unpleasant surprises at your parties and events, poor quality drinks etc. We've got all angles
              covered at wine2u.
            </p>
          </>
        }
      />

      <Row
        eyebrow="Discover"
        title="Own Your Palate"
        image={ownYourPalateImg}
        text={
          <>
            <p>Your palate is our passion, and what we want to achieve is that you have a 'Winestatic' experience.</p>
            <p>
              Because we believe that each individual has their own unique palate, and the "one size fits all"
              notion does not apply when selecting what your favorite tipple is, especially as a beginner to
              wines.
            </p>
            <p>At wine2u, we hope to assist you to master your own palate, and walk away with the knowledge from our panel of experts.</p>
          </>
        }
      />

      <img src={bannerBeforeExperience} alt="" aria-hidden="true" className="w-full h-[45vh] md:h-[60vh] object-cover" />

      <Row
        eyebrow="Curated"
        title="The Experience"
        image={experienceImg}
        reverse
        text={
          <>
            <p>
              At wine2u, our focus is on "THE EXPERIENCE": "When I go to a restaurant, I can have this experience"
              "when I have an event, I can have this experience" "when I purchase wine, this is what I can have in
              my home..."
            </p>
            <p>
              The <em>experience</em> is that you will become "a wine connoisseur" of your own palate, so that when
              you leave this site and go to a restaurant, you will confidently order wines from their menu to pair
              well with your meal when you go to a party, you won't stare at the bottle on the table
              intimidatingly; and when you are throwing a party at home or having dinner with friends, you will be
              able to select wines to suit you and your guests.
            </p>
          </>
        }
      />

      <Row
        eyebrow="Sourced Right"
        title="Premium quality drink from premium producers"
        image={premiumImg}
        text={
          <>
            <p>
              Whether you are purchasing wines for the first time, or whether you already know your palate,
              whether you are a wine enthusiast or connoisseur, there is something for you on WINE2U.COM.
            </p>
            <p>We introduce you to every winery, so not only are you purchasing their drinks, you also get to know them.</p>
          </>
        }
      />

      <img src={bannerBeforeInteraction} alt="" aria-hidden="true" className="w-full h-[45vh] md:h-[60vh] object-bottom object-cover" />

      <Row
        eyebrow="Anywhere, Anytime"
        title="Interaction"
        image={interactionsImg}
        imageFit="contain"
        reverse
        text={
          <>
            <p>If you are just curious about wines and want to learn more, visit our Tutorials and hear what the experts have to say.</p>
            <p>And if you want suggestions on food and wine pairing for the ultimate experience, go to the Pairing section.</p>
            <p>
              You may also want to visit Koko's Blog for our daily broadcasts ranging from new discoveries to
              everyday questions about wine and alcoholic beverages.
            </p>
          </>
        }
      />
    </div>
  );
};

export default About;

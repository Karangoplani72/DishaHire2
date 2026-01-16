import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Target, 
  Eye, 
  Users, 
  Handshake, 
  Gem, 
  TrendingUp, 
  ArrowRight
} from 'lucide-react';

const MotionDiv = (motion as any).div;

const About: React.FC = () => {
  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[60vh] sm:h-[70vh] flex items-center bg-brand-dark px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1573161158971-d1b07323869a?auto=format&fit=crop&q=80&w=1600" 
            alt="Corporate Environment" 
            className="w-full h-full object-cover opacity-30 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/80 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <MotionDiv 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
            className="max-w-3xl space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold/10 border border-brand-gold/20 rounded-full text-brand-gold text-[10px] font-black uppercase tracking-[0.3em]">
              <ShieldCheck size={14} />
              Your Trusted Consulting Partner
            </div>
            <h1 className="text-4xl sm:text-7xl font-serif font-bold text-white leading-[1.1]">
              Welcome to <span className="text-brand-gold italic">Disha Hire</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 font-serif italic leading-relaxed">
              Bridging the gap between ambitious job seekers and forward-thinking employers through end-to-end recruitment excellence.
            </p>
          </MotionDiv>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 sm:py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <MotionDiv 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-gold mb-4">Identity & Ethics</h2>
              <h3 className="text-3xl sm:text-5xl font-serif font-bold text-brand-dark leading-tight">Who We Are</h3>
            </div>
            <div className="space-y-6 text-gray-600 text-base sm:text-lg leading-relaxed">
              <p>
                Disha Hire is a professional recruitment consultancy committed to <span className="text-brand-dark font-bold">ethical, transparent, and result-oriented hiring</span>. 
              </p>
              <p>
                Our team focuses on long-term alignment instead of short-term placements, ensuring that every hire contributes to the growth of both the individual and the organization.
              </p>
            </div>
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-brand-gold bg-brand-dark flex items-center justify-center text-brand-gold">
                  <Handshake size={20} />
                </div>
                <span className="font-bold text-brand-dark uppercase text-[11px] tracking-widest">Transparency</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-brand-gold bg-brand-dark flex items-center justify-center text-brand-gold">
                  <Users size={20} />
                </div>
                <span className="font-bold text-brand-dark uppercase text-[11px] tracking-widest">Client First</span>
              </div>
            </div>
          </MotionDiv>
          
          <MotionDiv 
            initial={{ opacity: 0, scale: 0.95 }} 
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-brand-gold/5 rounded-[3rem] blur-2xl" />
            <img 
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800" 
              alt="Consultancy in action" 
              className="relative z-10 rounded-[3rem] shadow-2xl grayscale"
            />
          </MotionDiv>
        </div>
      </section>

      {/* Mission & Vision - White Background with Green Cards */}
      <section className="py-20 sm:py-32 bg-white px-4 relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 sm:gap-12 relative z-10">
          <MotionDiv 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 sm:p-16 rounded-[3rem] bg-brand-dark border border-brand-gold/10 hover:border-brand-gold/40 transition-all group shadow-xl"
          >
            <div className="w-16 h-16 rounded-full border-2 border-brand-gold bg-brand-dark/50 flex items-center justify-center text-brand-gold mb-8 group-hover:scale-110 transition-transform">
              <Target size={32} />
            </div>
            <h4 className="text-3xl font-serif font-bold mb-6 text-white">Our Mission</h4>
            <p className="text-gray-400 text-lg leading-relaxed italic font-serif">
              To empower careers and strengthen organizations by delivering high-quality, customized recruitment services that prioritize trust, efficiency, and long-term success.
            </p>
          </MotionDiv>

          <MotionDiv 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 sm:p-16 rounded-[3rem] bg-brand-dark border border-brand-gold/10 hover:border-brand-gold/40 transition-all group shadow-xl"
          >
            <div className="w-16 h-16 rounded-full border-2 border-brand-gold bg-brand-dark/50 flex items-center justify-center text-brand-gold mb-8 group-hover:scale-110 transition-transform">
              <Eye size={32} />
            </div>
            <h4 className="text-3xl font-serif font-bold mb-6 text-white">Our Vision</h4>
            <p className="text-gray-400 text-lg leading-relaxed italic font-serif">
              To become a leading job consulting firm recognized for integrity, professionalism, and excellence across industries, setting a new benchmark in HR consultancy.
            </p>
          </MotionDiv>
        </div>
      </section>

      {/* Values Grid - Text Inside Green Cards with Gold-Bordered Icons */}
      <section className="py-20 sm:py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 sm:mb-24">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-gold mb-4">Foundation</h2>
            <h3 className="text-3xl sm:text-5xl font-serif font-bold text-brand-dark">Our Values</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
            {[
              { title: 'Integrity', icon: ShieldCheck, desc: 'Honest and ethical conduct in every professional placement.' },
              { title: 'Commitment', icon: Target, desc: 'Dedicated to long-term alignment for both clients and candidates.' },
              { title: 'Quality', icon: Gem, desc: 'Highest standards of vetting and customized hiring solutions.' },
              { title: 'Respect', icon: Users, desc: 'Valuing every individual’s dignity and career aspirations.' },
              { title: 'Growth', icon: TrendingUp, desc: 'Fostering continuous professional and organizational evolution.' }
            ].map((value, i) => (
              <MotionDiv 
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center bg-brand-dark p-8 rounded-[2.5rem] border border-brand-gold/10 hover:border-brand-gold transition-all group text-center shadow-lg"
              >
                {/* Circular Icon with Gold Border */}
                <div className="w-16 h-16 rounded-full border-2 border-brand-gold bg-brand-dark/50 flex items-center justify-center text-brand-gold mb-6 group-hover:bg-brand-gold group-hover:text-brand-dark transition-all duration-500">
                  <value.icon size={28} />
                </div>
                {/* Text Content Now Inside Card */}
                <h5 className="text-white font-serif font-bold text-xl mb-3">{value.title}</h5>
                <p className="text-gray-400 text-[10px] sm:text-[11px] uppercase tracking-widest leading-relaxed">
                  {value.desc}
                </p>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-brand-dark relative overflow-hidden text-center px-4">
        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">Let’s choose the <span className="text-brand-gold">Right Direction.</span></h2>
          <p className="text-gray-400 text-lg leading-relaxed font-serif italic">Whether you're hiring or looking to be hired, we are ready to consult.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <a href="/#/contact" className="w-full sm:w-auto px-10 py-5 bg-brand-gold text-brand-dark rounded-full font-bold uppercase tracking-widest text-sm hover:bg-yellow-500 transition-all shadow-2xl flex items-center justify-center gap-3">
               Start Consultation <ArrowRight size={18} />
             </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
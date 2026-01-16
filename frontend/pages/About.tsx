
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Target, 
  Eye, 
  Users, 
  UserPlus, 
  Handshake, 
  Gem, 
  Rocket, 
  Heart,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

const MotionDiv = (motion as any).div;

/**
 * IMAGE GENERATION PROMPTS USED FOR SECTIONS:
 * 
 * 1. Hero Banner: 
 *    Prompt: "Realistic high-quality 16:9 photo of a modern Indian corporate office, 
 *    diverse professionals collaborating in a bright, sunlit boardroom, professional 
 *    atmosphere, blue and white neutral tones, wide angle."
 * 
 * 2. Who We Are: 
 *    Prompt: "A professional recruitment consultant in a business suit having a 
 *    face-to-face interview with a candidate in a modern Indian office setting, 
 *    trustworthy and transparent vibe."
 * 
 * 3. For Job Seekers: 
 *    Prompt: "A group of young Indian freshers and experienced professionals in a 
 *    career guidance workshop, focused expressions, mentorship environment."
 * 
 * 4. For Employers: 
 *    Prompt: "Corporate business leaders in India discussing hiring strategy around 
 *    a glass table, high-end office, handshake in background, executive presence."
 */

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
      <section className="py-20 sm:py-32 px-4">
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
                Our team of experienced recruiters and career consultants focuses on long-term employer–candidate alignment instead of short-term placements. We believe in pointing both businesses and individuals toward the path of sustainable success.
              </p>
            </div>
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-brand-gold border border-brand-gold/20">
                  <Handshake size={24} />
                </div>
                <span className="font-bold text-brand-dark uppercase text-[11px] tracking-widest">High Integrity</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-brand-gold border border-brand-gold/20">
                  <Users size={24} />
                </div>
                <span className="font-bold text-brand-dark uppercase text-[11px] tracking-widest">Human Centric</span>
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
              alt="Professional Consultation" 
              className="relative z-10 rounded-[3rem] shadow-2xl grayscale"
            />
          </MotionDiv>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 sm:py-32 bg-brand-dark text-white px-4 relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 sm:gap-12 relative z-10">
          <MotionDiv 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 sm:p-16 rounded-[3rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
          >
            <div className="w-16 h-16 rounded-3xl bg-brand-gold/20 flex items-center justify-center text-brand-gold mb-8 group-hover:scale-110 transition-transform">
              <Target size={32} />
            </div>
            <h4 className="text-3xl font-serif font-bold mb-6">Our Mission</h4>
            <p className="text-gray-400 text-lg leading-relaxed">
              To empower careers and strengthen organizations by delivering high-quality, customized recruitment services that prioritize trust, efficiency, and long-term success.
            </p>
          </MotionDiv>

          <MotionDiv 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 sm:p-16 rounded-[3rem] bg-brand-gold/10 border border-brand-gold/20 hover:bg-brand-gold/20 transition-all group"
          >
            <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform">
              <Eye size={32} />
            </div>
            <h4 className="text-3xl font-serif font-bold mb-6 text-brand-gold">Our Vision</h4>
            <p className="text-gray-200 text-lg leading-relaxed">
              To become a leading job consulting firm recognized for integrity, professionalism, and excellence across industries, setting a new benchmark in HR consultancy.
            </p>
          </MotionDiv>
        </div>
      </section>

      {/* Dual Solutions Section */}
      <section className="py-20 sm:py-32 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 sm:mb-24 space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-gold">Our Impact</h2>
            <h3 className="text-3xl sm:text-5xl font-serif font-bold text-brand-dark">Dual-Track Solutions</h3>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 sm:gap-20">
            {/* For Job Seekers */}
            <MotionDiv 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 sm:p-14 rounded-[4rem] shadow-xl border border-gray-100 flex flex-col justify-between"
            >
              <div className="space-y-8">
                <div className="flex justify-between items-start">
                  <div className="w-20 h-20 rounded-[2rem] bg-brand-light flex items-center justify-center text-brand-gold">
                    <UserPlus size={40} />
                  </div>
                  <span className="px-4 py-2 bg-brand-gold/5 text-brand-gold rounded-full text-[9px] font-black uppercase tracking-widest border border-brand-gold/10">Path for Candidates</span>
                </div>
                <h4 className="text-3xl font-serif font-bold text-brand-dark">For Job Seekers</h4>
                <p className="text-gray-600 text-lg leading-relaxed">
                  We support freshers and experienced professionals through career guidance, job matching, and placement assistance—helping them choose the <span className="text-brand-gold font-bold">right career path</span>, not just any job.
                </p>
                <img 
                  src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600" 
                  alt="Candidate Guidance" 
                  className="rounded-3xl shadow-lg grayscale"
                />
              </div>
            </MotionDiv>

            {/* For Employers */}
            <MotionDiv 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-brand-dark p-8 sm:p-14 rounded-[4rem] shadow-xl border border-white/5 flex flex-col justify-between"
            >
              <div className="space-y-8">
                <div className="flex justify-between items-start">
                  <div className="w-20 h-20 rounded-[2rem] bg-white/10 flex items-center justify-center text-brand-gold">
                    <Handshake size={40} />
                  </div>
                  <span className="px-4 py-2 bg-white/5 text-gray-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">Path for Corporates</span>
                </div>
                <h4 className="text-3xl font-serif font-bold text-white">For Employers</h4>
                <p className="text-gray-400 text-lg leading-relaxed">
                  We help organizations hire <span className="text-white font-bold">dependable, culturally aligned talent</span> while reducing hiring risks and saving time through structured recruitment processes.
                </p>
                <img 
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600" 
                  alt="Employer Strategy" 
                  className="rounded-3xl shadow-lg grayscale brightness-75"
                />
              </div>
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 sm:py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 sm:mb-24">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-gold mb-4">Foundation</h2>
            <h3 className="text-3xl sm:text-5xl font-serif font-bold text-brand-dark">Our Values</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-10">
            {[
              { title: 'Integrity', icon: ShieldCheck },
              { title: 'Commitment', icon: Heart },
              { title: 'Quality', icon: Gem },
              { title: 'Respect', icon: Users },
              { title: 'Growth', icon: Rocket }
            ].map((value, i) => (
              <MotionDiv 
                key={value.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center group cursor-default"
              >
                <div className="w-full aspect-square rounded-[2rem] sm:rounded-[2.5rem] bg-brand-light flex items-center justify-center text-brand-gold border border-brand-gold/10 group-hover:bg-brand-gold group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:-translate-y-2">
                  <value.icon size={32} />
                </div>
                <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark group-hover:text-brand-gold transition-colors">{value.title}</p>
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

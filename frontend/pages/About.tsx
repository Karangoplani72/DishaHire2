import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Eye, 
  Users, 
  ShieldCheck, 
  Gem, 
  TrendingUp, 
  Handshake, 
  GraduationCap, 
  Briefcase,
  Award,
  ChevronRight,
  Quote
} from 'lucide-react';

const MotionDiv = (motion as any).div;

const About: React.FC = () => {
  const values = [
    { title: 'Integrity', icon: ShieldCheck, desc: 'Unwavering ethical standards in every placement.' },
    { title: 'Commitment', icon: Handshake, desc: 'Dedicated to long-term candidate-employer success.' },
    { title: 'Quality', icon: Gem, desc: 'Providing top-tier talent through rigorous vetting.' },
    { title: 'Respect', icon: Users, desc: 'Valuing every individual aspiration and corporate goal.' },
    { title: 'Growth', icon: TrendingUp, desc: 'Driving progress for careers and organizations alike.' },
    { title: 'Excellence', icon: Award, desc: 'Striving for perfection in recruitment methodology.' }
  ];

  return (
    <div className="bg-brand-light overflow-hidden w-full">
      {/* Section 1: Hero Banner */}
      <section className="relative min-h-[50vh] sm:min-h-[65vh] flex items-center bg-brand-dark overflow-hidden px-4">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop" 
            alt="Corporate Environment" 
            className="w-full h-full object-cover opacity-20 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/60 via-brand-dark to-brand-dark" />
        </div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10 py-12">
          <MotionDiv 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="max-w-4xl space-y-6 text-center sm:text-left"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] font-black uppercase tracking-[0.3em]">
              Professional Recruitment Partner
            </div>
            <h1 className="text-3xl sm:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight">
              Welcome to <span className="text-brand-gold">Disha Hire</span>
            </h1>
            <p className="text-base sm:text-xl text-gray-400 font-serif italic leading-relaxed max-w-2xl">
              Your Trusted Job Consulting Partner – Bridging the gap between ambitious job seekers and forward-thinking employers.
            </p>
          </MotionDiv>
        </div>
      </section>

      {/* Section 2: Who We Are (Redesigned Text-Centric Layout - NO PHOTO) */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 relative bg-white">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-brand-gold/5 pointer-events-none -skew-x-12 transform translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-brand-dark/[0.02] pointer-events-none skew-x-12 transform -translate-x-1/2" />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-12 sm:space-y-20">
          <MotionDiv 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-gold">Our Philosophy</h2>
              <h3 className="text-4xl sm:text-6xl font-serif font-bold text-brand-dark">Who We Are</h3>
            </div>
            <div className="w-20 h-1.5 bg-brand-gold mx-auto rounded-full" />
          </MotionDiv>

          <MotionDiv 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="relative inline-block px-4">
              <Quote className="absolute -top-10 -left-4 sm:-left-16 text-brand-gold/10" size={100} />
              <p className="text-2xl sm:text-4xl text-brand-dark leading-tight font-serif italic font-semibold">
                Disha Hire is a professional recruitment consultancy committed to ethical, transparent, and result-oriented hiring solutions.
              </p>
            </div>
            
            <p className="text-base sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-medium">
              Our experienced recruiters and career consultants focus on long-term employer–candidate alignment rather than short-term placements. We deliver end-to-end recruitment and career consulting solutions tailored to evolving industry demands and individual aspirations.
            </p>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-center border-t border-gray-100 pt-16">
               <div className="space-y-2">
                  <p className="text-4xl sm:text-6xl font-serif font-bold text-brand-dark">15+</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold">Industries</p>
               </div>
               <div className="space-y-2">
                  <p className="text-4xl sm:text-6xl font-serif font-bold text-brand-dark">Ethical</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold">Hiring</p>
               </div>
               <div className="col-span-2 sm:col-span-1 space-y-2">
                  <p className="text-4xl sm:text-6xl font-serif font-bold text-brand-dark">Direct</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold">Impact</p>
               </div>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* Section 3: Mission & Vision Cards (Primary Color) */}
      <section className="py-12 sm:py-24 bg-brand-light px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6 sm:gap-10">
          <MotionDiv 
            whileHover={{ y: -5 }}
            className="bg-brand-dark p-8 sm:p-14 rounded-[2.5rem] sm:rounded-[4rem] text-white shadow-3xl border border-white/5"
          >
            <div className="w-14 h-14 bg-brand-gold/10 rounded-2xl flex items-center justify-center mb-8">
              <Target size={28} className="text-brand-gold" />
            </div>
            <h4 className="text-2xl sm:text-3xl font-serif font-bold mb-6">Our Mission</h4>
            <p className="text-gray-400 text-sm sm:text-lg leading-relaxed font-serif italic">
              To empower careers and strengthen organizations through high-quality, customized recruitment services that prioritize trust, efficiency, and long-term success.
            </p>
          </MotionDiv>

          <MotionDiv 
            whileHover={{ y: -5 }}
            className="bg-brand-dark p-8 sm:p-14 rounded-[2.5rem] sm:rounded-[4rem] text-white shadow-3xl border border-white/5"
          >
            <div className="w-14 h-14 bg-brand-gold/10 rounded-2xl flex items-center justify-center mb-8">
              <Eye size={28} className="text-brand-gold" />
            </div>
            <h4 className="text-2xl sm:text-3xl font-serif font-bold mb-6">Our Vision</h4>
            <p className="text-gray-400 text-sm sm:text-lg leading-relaxed font-serif italic">
              To become a leading job consulting firm recognized for integrity, professionalism, and excellence across industries.
            </p>
          </MotionDiv>
        </div>
      </section>

      {/* Section 4 & 5: For Seekers & Employers */}
      <section className="py-16 sm:py-32 px-4 space-y-24 sm:space-y-40 bg-white">
        {/* Job Seekers */}
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 sm:gap-20 items-center">
          <MotionDiv 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-brand-gold text-[10px] font-black uppercase tracking-widest">
                <GraduationCap size={16} /> Candidate Services
              </div>
              <h3 className="text-3xl sm:text-5xl font-serif font-bold text-brand-dark">For Job Seekers</h3>
            </div>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              We support freshers and experienced professionals through career guidance, job matching, and placement assistance—helping them choose the right career path, not just a job.
            </p>
            <div className="space-y-3">
              {['Career Guidance & Mentorship', 'Direct Placement Assistance', 'Industry Skill Alignment'].map((point) => (
                <div key={point} className="flex items-center gap-3 text-brand-dark font-bold text-xs sm:text-sm">
                  <ChevronRight size={16} className="text-brand-gold" />
                  {point}
                </div>
              ))}
            </div>
          </MotionDiv>
          <div className="aspect-video rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-xl border border-gray-100">
            <img src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200&auto=format&fit=crop" alt="Job Seeker Mentorship" className="w-full h-full object-cover grayscale" />
          </div>
        </div>

        {/* Employers */}
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 sm:gap-20 items-center lg:flex-row-reverse">
          <div className="aspect-video rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-xl border border-gray-100 lg:order-first">
            <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop" alt="Employer Hiring Discussion" className="w-full h-full object-cover grayscale" />
          </div>
          <MotionDiv 
            initial={{ opacity: 0, x: 30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-brand-gold text-[10px] font-black uppercase tracking-widest">
                <Briefcase size={16} /> Enterprise Solutions
              </div>
              <h3 className="text-3xl sm:text-5xl font-serif font-bold text-brand-dark">For Employers</h3>
            </div>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              We help organizations hire dependable, culturally aligned talent while reducing hiring risks and saving time through structured recruitment processes.
            </p>
            <div className="space-y-3">
              {['Risk-Free Hiring Processes', 'Cultural Alignment Screening', 'Time-to-Hire Optimization'].map((point) => (
                <div key={point} className="flex items-center gap-3 text-brand-dark font-bold text-xs sm:text-sm">
                  <ChevronRight size={16} className="text-brand-gold" />
                  {point}
                </div>
              ))}
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* Section 6: Our Values Grid (Primary Color Cards) */}
      <section className="py-20 sm:py-32 bg-brand-dark text-white px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-brand-light to-transparent opacity-10" />
        
        <div className="max-w-7xl mx-auto text-center mb-16 sm:mb-24">
          <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-gold mb-6">Our Foundation</h2>
          <h3 className="text-3xl sm:text-5xl font-serif font-bold">Our Values</h3>
          <div className="w-20 h-1 bg-brand-gold mx-auto mt-8 rounded-full" />
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
          {values.map((v, i) => (
            <MotionDiv 
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group p-10 sm:p-12 bg-white/5 border border-white/10 rounded-[2.5rem] sm:rounded-[3rem] hover:bg-brand-gold hover:border-brand-gold transition-all duration-500 text-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-gold/10 flex items-center justify-center mx-auto mb-8 group-hover:bg-white/20 transition-all duration-500">
                <v.icon size={32} className="text-brand-gold group-hover:text-white" />
              </div>
              <h5 className="text-lg sm:text-xl font-serif font-bold uppercase tracking-widest mb-4 group-hover:text-brand-dark transition-colors">{v.title}</h5>
              <p className="text-sm text-gray-400 group-hover:text-brand-dark/80 font-serif italic transition-colors leading-relaxed">
                {v.desc}
              </p>
            </MotionDiv>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
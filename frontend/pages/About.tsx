import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Users, UserPlus, ShieldCheck, Gem, TrendingUp, Handshake, Briefcase, GraduationCap } from 'lucide-react';

const MotionDiv = (motion as any).div;

const About: React.FC = () => {
  return (
    <div className="bg-white overflow-hidden w-full">
      {/* Hero / About Us Banner */}
      <section className="relative h-[60vh] sm:h-[75vh] flex items-center bg-brand-dark overflow-hidden px-4">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop" 
            alt="Modern Office Environment" 
            className="w-full h-full object-cover opacity-30 grayscale brightness-75"
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
            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-gold/20 border border-brand-gold/30 text-brand-gold text-[10px] font-black uppercase tracking-[0.3em]">
              Established Excellence
            </div>
            <h1 className="text-4xl sm:text-7xl font-serif font-bold text-white leading-tight">
              Welcome to <span className="text-brand-gold">Disha Hire</span>
            </h1>
            <p className="text-lg sm:text-2xl text-gray-300 font-serif italic leading-relaxed">
              Your Trusted Job Consulting Partner – Bridging the gap between ambitious job seekers and forward-thinking employers.
            </p>
          </MotionDiv>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <MotionDiv 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-gold">Corporate Identity</h2>
              <h3 className="text-3xl sm:text-5xl font-serif font-bold text-brand-dark">Who We Are</h3>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed font-serif italic border-l-4 border-brand-gold pl-6">
              "Disha Hire is a professional recruitment consultancy committed to ethical, transparent, and result-oriented hiring solutions."
            </p>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Our experienced recruiters and career consultants focus on long-term employer–candidate alignment rather than short-term placements. We deliver end-to-end recruitment and career consulting solutions tailored to evolving industry demands and individual aspirations.
            </p>
          </MotionDiv>
          
          <MotionDiv 
            initial={{ opacity: 0, scale: 0.95 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-brand-gold/5 rounded-[3rem] blur-2xl" />
            <img 
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1200&auto=format&fit=crop" 
              alt="Professional Recruitment Consultants" 
              className="relative z-10 rounded-[2.5rem] sm:rounded-[4rem] shadow-4xl grayscale brightness-90 border border-gray-100"
            />
            <div className="absolute -bottom-10 -right-6 sm:-bottom-12 sm:-right-8 bg-brand-dark p-8 sm:p-10 rounded-3xl shadow-2xl z-20 border border-white/10 hidden sm:block max-w-[280px]">
               <div className="flex items-center gap-4 mb-4">
                  <ShieldCheck className="text-brand-gold" size={32} />
                  <span className="text-white text-xs font-black uppercase tracking-widest">Ethical Standards</span>
               </div>
               <p className="text-gray-400 text-sm italic font-serif leading-relaxed">Result-oriented solutions focused on integrity and trust.</p>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 sm:py-32 bg-brand-light relative overflow-hidden px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 sm:gap-12 relative z-10">
          {/* Mission */}
          <MotionDiv 
            whileHover={{ y: -10 }}
            className="bg-brand-dark p-10 sm:p-16 rounded-[3rem] text-white shadow-3xl border border-white/5 group"
          >
            <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-brand-gold group-hover:text-brand-dark transition-all duration-500">
              <Target size={32} className="text-brand-gold group-hover:text-brand-dark" />
            </div>
            <h4 className="text-3xl font-serif font-bold mb-6">Our Mission</h4>
            <p className="text-gray-400 text-lg leading-relaxed font-serif italic">
              To empower careers and strengthen organizations through high-quality, customized recruitment services that prioritize trust, efficiency, and long-term success.
            </p>
          </MotionDiv>

          {/* Vision */}
          <MotionDiv 
            whileHover={{ y: -10 }}
            className="bg-white p-10 sm:p-16 rounded-[3rem] text-brand-dark shadow-3xl border border-gray-100 group"
          >
            <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-brand-gold transition-all duration-500">
              <Eye size={32} className="text-brand-gold group-hover:text-white" />
            </div>
            <h4 className="text-3xl font-serif font-bold mb-6">Our Vision</h4>
            <p className="text-gray-500 text-lg leading-relaxed font-serif italic">
              To become a leading job consulting firm recognized for integrity, professionalism, and excellence across industries.
            </p>
          </MotionDiv>
        </div>
      </section>

      {/* Segment Focus: Job Seekers & Employers */}
      <section className="py-20 sm:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-16 sm:space-y-32">
          {/* Job Seekers */}
          <div className="flex flex-col lg:flex-row gap-12 sm:gap-20 items-center">
            <MotionDiv 
              initial={{ opacity: 0, x: -20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
              className="flex-1 space-y-8"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-brand-gold text-[10px] font-black uppercase tracking-widest">
                  <GraduationCap size={16} /> Empowering Talent
                </div>
                <h3 className="text-3xl sm:text-5xl font-serif font-bold text-brand-dark">For Job Seekers</h3>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                We support freshers and experienced professionals through career guidance, job matching, and placement assistance—helping them choose the right career path, not just a job.
              </p>
              <ul className="space-y-4">
                {['Career Guidance & Mentorship', 'Strategic Job Matching', 'Industry-Aligned Placement'].map((item) => (
                  <li key={item} className="flex items-center gap-4 text-brand-dark font-bold text-sm">
                    <div className="w-2 h-2 rounded-full bg-brand-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </MotionDiv>
            <MotionDiv 
              initial={{ opacity: 0, scale: 0.95 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }}
              className="flex-1 w-full"
            >
              <img 
                src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200&auto=format&fit=crop" 
                alt="Young Professionals in Mentorship" 
                className="rounded-[3rem] shadow-4xl grayscale w-full object-cover aspect-[4/3]"
              />
            </MotionDiv>
          </div>

          {/* Employers */}
          <div className="flex flex-col lg:flex-row-reverse gap-12 sm:gap-20 items-center">
            <MotionDiv 
              initial={{ opacity: 0, x: 20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
              className="flex-1 space-y-8"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-brand-gold text-[10px] font-black uppercase tracking-widest">
                  <Handshake size={16} /> Strengthening Organizations
                </div>
                <h3 className="text-3xl sm:text-5xl font-serif font-bold text-brand-dark">For Employers</h3>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                We help organizations hire dependable, culturally aligned talent while reducing hiring risks and saving time through structured recruitment processes.
              </p>
              <ul className="space-y-4">
                {['Structured Recruitment Cycles', 'Cultural Alignment Sourcing', 'Risk Mitigation & Time Savings'].map((item) => (
                  <li key={item} className="flex items-center gap-4 text-brand-dark font-bold text-sm">
                    <div className="w-2 h-2 rounded-full bg-brand-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </MotionDiv>
            <MotionDiv 
              initial={{ opacity: 0, scale: 0.95 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }}
              className="flex-1 w-full"
            >
              <img 
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop" 
                alt="Corporate Hiring Discussions" 
                className="rounded-[3rem] shadow-4xl grayscale w-full object-cover aspect-[4/3]"
              />
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 sm:py-32 bg-brand-dark text-white px-4">
        <div className="max-w-7xl mx-auto text-center mb-16 sm:mb-24">
          <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-gold mb-6">Foundational Pillars</h2>
          <h3 className="text-3xl sm:text-5xl font-serif font-bold">Our Values</h3>
          <div className="w-20 h-1 bg-brand-gold mx-auto mt-8 rounded-full" />
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-10">
          {[
            { title: 'Integrity', icon: ShieldCheck },
            { title: 'Commitment', icon: Handshake },
            { title: 'Quality', icon: Gem },
            { title: 'Respect', icon: Users },
            { title: 'Growth', icon: TrendingUp }
          ].map((v, i) => (
            <MotionDiv 
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group text-center space-y-4"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-white/10 flex items-center justify-center mx-auto group-hover:bg-brand-gold group-hover:text-brand-dark transition-all duration-500">
                <v.icon size={32} className="text-brand-gold group-hover:text-brand-dark" />
              </div>
              <h5 className="text-sm sm:text-lg font-serif font-bold uppercase tracking-widest">{v.title}</h5>
            </MotionDiv>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
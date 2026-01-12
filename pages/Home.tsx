
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Building, Users, CheckCircle2, Star, Quote, ChevronRight, ShieldCheck } from 'lucide-react';
import { INDUSTRIES, PROCESS_STEPS } from '../constants.tsx';
import EnquiryModal from '../components/EnquiryModal.tsx';
import { EnquiryType } from '../types.ts';

const Home: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeEnquiryType, setActiveEnquiryType] = useState<EnquiryType>(EnquiryType.CANDIDATE);

  const openEnquiry = (type: EnquiryType) => {
    setActiveEnquiryType(type);
    setModalOpen(true);
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-brand-dark overflow-hidden">
        {/* Subtle 3D background visual effect */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-gold/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-accent/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold tracking-widest uppercase">
                <ShieldCheck size={14} />
                <span>Premium HR Consultancy</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-serif font-bold text-white leading-tight">
                Right Talent, <br/>
                <span className="text-brand-gold">Right Direction.</span>
              </h1>
              
              <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                We bridge the gap between world-class organizations and top-tier talent through ethical, data-driven recruitment strategies.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={() => openEnquiry(EnquiryType.EMPLOYER)}
                  className="bg-brand-gold text-brand-dark px-8 py-4 rounded font-bold flex items-center justify-center group hover:bg-yellow-500 transition-all duration-300 shadow-lg shadow-brand-gold/20"
                >
                  Hire Expert Talent <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => openEnquiry(EnquiryType.CANDIDATE)}
                  className="bg-transparent border border-white/20 text-white px-8 py-4 rounded font-bold hover:bg-white/10 transition-all duration-300"
                >
                  Find Your Next Role
                </button>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
                <div>
                  <div className="text-3xl font-serif font-bold text-white">500+</div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">Placements</div>
                </div>
                <div>
                  <div className="text-3xl font-serif font-bold text-white">120+</div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">Partners</div>
                </div>
                <div>
                  <div className="text-3xl font-serif font-bold text-white">98%</div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">Retention</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                 <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000" 
                  alt="Recruitment Professional" 
                  className="w-full h-[600px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent" />
                 <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                    <div className="flex items-center space-x-1 text-brand-gold mb-2">
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                    </div>
                    <p className="text-sm text-gray-200 italic">"DishaHire redefined our hiring process. Their focus on cultural fit is unparalleled in the industry."</p>
                    <p className="text-xs font-bold text-white mt-3">— CTO, Global Tech Solutions</p>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-brand-gold">Expertise</h2>
            <h3 className="text-4xl font-serif font-bold text-brand-dark">Industries We Serve</h3>
            <p className="text-gray-500 max-w-2xl mx-auto">Specialized talent acquisition across diverse high-impact sectors.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {INDUSTRIES.map((industry) => (
              <div key={industry} className="p-6 border border-gray-100 rounded-xl hover:shadow-xl transition-all duration-300 hover:border-brand-gold/30 group">
                <div className="w-10 h-10 bg-brand-light rounded-lg flex items-center justify-center mb-4 text-brand-dark group-hover:bg-brand-gold group-hover:text-white transition-colors">
                  <CheckCircle2 size={20} />
                </div>
                <p className="text-sm font-bold text-brand-dark leading-snug">{industry}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recruitment Process */}
      <section className="py-24 bg-brand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-brand-gold">The Journey</h2>
            <h3 className="text-4xl font-serif font-bold text-brand-dark">Our Recruitment Process</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-gray-200 -translate-y-1/2 z-0" />
            
            {PROCESS_STEPS.map((step, idx) => (
              <motion.div 
                whileHover={{ y: -5 }}
                key={step.title} 
                className="relative z-10 bg-white p-10 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="w-16 h-16 bg-brand-dark text-brand-gold rounded-full flex items-center justify-center mb-6 shadow-lg">
                  {step.icon}
                </div>
                <div className="absolute top-10 right-10 text-4xl font-serif font-black text-gray-50">0{idx + 1}</div>
                <h4 className="text-xl font-bold mb-3 text-brand-dark">{step.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-brand-gold">Trust</h2>
              <h3 className="text-4xl font-serif font-bold">Client Testimonials</h3>
            </div>
            <button className="text-brand-gold font-bold flex items-center text-sm border-b border-brand-gold pb-1">
              Read all stories <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 p-10 rounded-3xl space-y-6">
              <Quote className="text-brand-gold w-10 h-10 opacity-50" />
              <p className="text-lg text-gray-200 italic leading-relaxed">
                "Finding a consultancy that understands 'Quality over Quantity' is rare. DishaHire consistently provides candidates who are not just technically sound but also culturally aligned."
              </p>
              <div className="flex items-center space-x-4 pt-4 border-t border-white/10">
                <div className="w-12 h-12 rounded-full bg-brand-gold/20" />
                <div>
                  <h5 className="font-bold">Rajesh Kumar</h5>
                  <p className="text-xs text-brand-gold uppercase">HR Director, FinCorp Solutions</p>
                </div>
              </div>
              <div className="bg-brand-accent/40 p-6 rounded-xl border border-white/5">
                <p className="text-xs font-bold text-brand-gold uppercase tracking-widest mb-2 flex items-center gap-2">
                  <ShieldCheck size={14} /> Admin Reply
                </p>
                <p className="text-sm text-gray-400">"Thank you for the trust, Rajesh. Our team is committed to maintaining the high bar for every search we conduct."</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-10 rounded-3xl space-y-6">
              <Quote className="text-brand-gold w-10 h-10 opacity-50" />
              <p className="text-lg text-gray-200 italic leading-relaxed">
                "The transparency in their commercial terms and the speed of their sourcing makes them our go-to partner for all niche technical roles."
              </p>
              <div className="flex items-center space-x-4 pt-4 border-t border-white/10">
                <div className="w-12 h-12 rounded-full bg-brand-gold/20" />
                <div>
                  <h5 className="font-bold">Anita Desai</h5>
                  <p className="text-xs text-brand-gold uppercase">Head of Talent, SkyTech</p>
                </div>
              </div>
              <div className="bg-brand-accent/40 p-6 rounded-xl border border-white/5">
                <p className="text-xs font-bold text-brand-gold uppercase tracking-widest mb-2 flex items-center gap-2">
                  <ShieldCheck size={14} /> Admin Reply
                </p>
                <p className="text-sm text-gray-400">"It's a pleasure working with SkyTech. We look forward to many more successful placements together."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-gold/5 -skew-y-3 origin-left" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark leading-tight">Ready to transform your recruitment journey?</h2>
          <p className="text-xl text-gray-500">Partner with DishaHire for professional, ethical, and result-oriented talent solutions.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <button onClick={() => openEnquiry(EnquiryType.EMPLOYER)} className="bg-brand-dark text-white px-10 py-4 rounded-full font-bold shadow-xl hover:bg-brand-accent transition">Get a Consultation</button>
             <button onClick={() => openEnquiry(EnquiryType.CANDIDATE)} className="bg-white border-2 border-brand-dark text-brand-dark px-10 py-4 rounded-full font-bold hover:bg-brand-light transition">Submit Your CV</button>
          </div>
        </div>
      </section>

      {modalOpen && <EnquiryModal type={activeEnquiryType} onClose={() => setModalOpen(false)} />}
    </div>
  );
};

export default Home;

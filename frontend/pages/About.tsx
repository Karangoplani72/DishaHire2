

import React from 'react';
import { motion } from 'framer-motion';
const MotionDiv = (motion as any).div;
import { Heart, Target, Users, Gem } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Sub-Hero */}
      <section className="bg-brand-dark text-white py-20 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl sm:text-7xl font-serif font-bold mb-6">Our Story</h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl leading-relaxed">
              DishaHire Consultancy is a recruitment and human resource firm focused on delivering end-to-end talent acquisition solutions that matter.
            </p>
          </MotionDiv>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 sm:gap-20 items-center">
          <div className="space-y-6 sm:space-y-8">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark">Our Philosophy</h2>
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg font-serif italic">
              "We work closely with employers to understand their workforce needs and provide candidates who are technically qualified, culturally aligned, and ready to contribute from day one."
            </p>
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
              Our name, <span className="text-brand-gold font-bold">'Disha'</span>, signifies direction. We believe in pointing both businesses and individuals toward the path of sustainable success.
            </p>
            <div className="grid grid-cols-2 gap-6 sm:gap-8 pt-6">
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-serif font-bold text-brand-gold">10+</div>
                <div className="text-[9px] font-black uppercase tracking-widest text-brand-dark">Years Expertise</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-serif font-bold text-brand-gold">100%</div>
                <div className="text-[9px] font-black uppercase tracking-widest text-brand-dark">Ethical Alignment</div>
              </div>
            </div>
          </div>
          <div className="relative mt-8 md:mt-0">
            <img 
              src="https://images.unsplash.com/photo-1521791136064-7986c2923216?auto=format&fit=crop&q=80&w=800" 
              alt="Team Meeting" 
              className="rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl grayscale"
            />
            <div className="absolute -bottom-8 -left-4 sm:-bottom-10 sm:-left-10 bg-brand-gold p-6 sm:p-8 rounded-2xl shadow-xl hidden sm:block">
              <p className="text-brand-dark font-serif font-bold text-xl sm:text-2xl italic">"Excellence is not an act, but a habit."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 sm:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-24 space-y-4">
            <h2 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] text-brand-gold">Our Foundation</h2>
            <h3 className="text-3xl sm:text-5xl font-serif font-bold text-brand-dark">Core Values</h3>
            <div className="w-16 sm:w-20 h-1 bg-brand-gold mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
            {[
              { icon: <Heart size={32}/>, title: 'Ethics', desc: 'Transparent dealings with every stakeholder.' },
              { icon: <Gem size={32}/>, title: 'Quality', desc: 'Rigorous vetting processes for all placements.' },
              { icon: <Target size={32}/>, title: 'Success', desc: 'Driving measurable results for partners.' },
              { icon: <Users size={32}/>, title: 'Partnership', desc: 'Focused on long-term shared growth.' }
            ].map((v) => (
              <MotionDiv 
                whileHover={{ y: -10 }}
                key={v.title} 
                className="p-8 sm:p-12 bg-brand-dark rounded-[2.5rem] sm:rounded-[3rem] text-center group transition-all duration-500 shadow-2xl border border-white/5"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 sm:border-4 border-brand-gold rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-dark transition-all duration-500">
                  {/* Fixed Type Error: Casting to ReactElement with any props to allow 'size' property in cloneElement */}
                  {React.cloneElement(v.icon as React.ReactElement<any>, { size: 28 })}
                </div>
                <h4 className="text-xl sm:text-2xl font-serif font-bold text-white mb-3 sm:mb-4 group-hover:text-brand-gold transition-colors">{v.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

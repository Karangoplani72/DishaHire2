
import React from 'react';
// Fixed: Using any casting for motion component to bypass property missing errors
import { motion } from 'framer-motion';
const MotionDiv = (motion as any).div;
import { Heart, Target, Users, Gem } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Sub-Hero */}
      <section className="bg-brand-dark text-white py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">About Us</h1>
            <p className="text-xl text-gray-300 max-w-3xl leading-relaxed">
              DishaHire Consultancy is a recruitment and human resource firm focused on delivering end-to-end talent acquisition solutions that matter.
            </p>
          </MotionDiv>
        </div>
      </section>

      {/* Intro */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl font-serif font-bold text-brand-dark">Our Philosophy</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              We work closely with employers to understand their workforce needs and provide candidates who are technically qualified, culturally aligned, and ready to contribute from day one.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              Our name, <span className="text-brand-gold font-bold">'Disha'</span>, signifies direction. We believe in pointing both businesses and individuals toward the path of sustainable success.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-6">
              <div className="space-y-2">
                <div className="text-4xl font-serif font-bold text-brand-gold">10+</div>
                <div className="text-sm font-bold uppercase tracking-wider text-brand-dark">Years Expertise</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-serif font-bold text-brand-gold">100%</div>
                <div className="text-sm font-bold uppercase tracking-wider text-brand-dark">Ethical Compliance</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1521791136064-7986c2923216?auto=format&fit=crop&q=80&w=800" 
              alt="Team Meeting" 
              className="rounded-3xl shadow-2xl grayscale"
            />
            <div className="absolute -bottom-10 -left-10 bg-brand-gold p-8 rounded-2xl shadow-xl hidden lg:block">
              <p className="text-brand-dark font-serif font-bold text-2xl italic">"Excellence is not an act, but a habit."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-brand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-brand-dark">Our Core Values</h2>
            <div className="w-20 h-1 bg-brand-gold mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <Heart className="w-8 h-8"/>, title: 'Ethics', desc: 'Transparent dealings with every stakeholder.' },
              { icon: <Gem className="w-8 h-8"/>, title: 'Quality', desc: 'Rigorous vetting processes for all placements.' },
              { icon: <Target className="w-8 h-8"/>, title: 'Success', desc: 'Driving measurable results for partners.' },
              { icon: <Users className="w-8 h-8"/>, title: 'Partnership', desc: 'Focused on long-term shared growth.' }
            ].map((v) => (
              <div key={v.title} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
                <div className="inline-flex p-4 rounded-xl bg-brand-dark text-brand-gold mb-6">{v.icon}</div>
                <h4 className="font-bold text-xl mb-3 text-brand-dark">{v.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as RouterDOM from 'react-router-dom';
const { useNavigate } = RouterDOM as any;
const MotionDiv = (motion as any).div;
const MotionButton = (motion as any).button;
import { 
  ArrowRight, 
  ShieldCheck, 
  X, 
  Laptop, 
  Stethoscope, 
  Landmark, 
  Factory, 
  TrendingUp, 
  UserCheck, 
  ShoppingBag, 
  Plane, 
  GraduationCap, 
  Building, 
  Radio, 
  Megaphone, 
  Truck, 
  Zap, 
  Rocket,
  HelpCircle,
  UserCircle2,
  Briefcase
} from 'lucide-react';
import { INDUSTRIES } from '../constants.tsx';

// Industry to Icon Mapping System
const INDUSTRY_ICONS: Record<string, React.ElementType> = {
  'Information Technology (IT & Tech)': Laptop,
  'Healthcare & Life Sciences': Stethoscope,
  'Banking, Finance & Insurance (BFSI)': Landmark,
  'Manufacturing & Engineering': Factory,
  'Sales & Marketing': TrendingUp,
  'Human Resources & Administration': UserCheck,
  'Retail & E-commerce': ShoppingBag,
  'Hospitality & Travel': Plane,
  'Education & Training': GraduationCap,
  'Construction & Real Estate': Building,
  'Telecom & Networking': Radio,
  'Media, Advertising & Creative': Megaphone,
  'Logistics & Supply Chain': Truck,
  'Energy & Utilities': Zap,
  'Startups & MSME’s': Rocket,
};

const SelectionModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const navigate = useNavigate();

  const handleSelect = (tab: 'seeker' | 'employer') => {
    navigate('/contact', { state: { tab } });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/95 backdrop-blur-md">
      <MotionDiv 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-[3rem] overflow-hidden max-w-2xl w-full shadow-4xl relative"
      >
        <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
          <X size={24} />
        </button>

        <div className="p-10 sm:p-16 text-center">
          <h3 className="text-3xl sm:text-4xl font-serif font-bold text-brand-dark mb-4">How can we assist you?</h3>
          <p className="text-gray-500 mb-12 font-serif italic">Select your professional path to continue</p>

          <div className="grid sm:grid-cols-2 gap-6">
            <button 
              onClick={() => handleSelect('seeker')}
              className="group p-8 rounded-[2rem] border-2 border-gray-100 hover:border-brand-gold hover:bg-brand-light transition-all text-center space-y-4"
            >
              <div className="w-16 h-16 bg-brand-gold/10 text-brand-gold rounded-2xl flex items-center justify-center mx-auto group-hover:bg-brand-gold group-hover:text-white transition-all">
                <UserCircle2 size={32} />
              </div>
              <h4 className="text-xl font-serif font-bold text-brand-dark">I am a Candidate</h4>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black">Looking for opportunities</p>
            </button>

            <button 
              onClick={() => handleSelect('employer')}
              className="group p-8 rounded-[2rem] border-2 border-gray-100 hover:border-brand-gold hover:bg-brand-light transition-all text-center space-y-4"
            >
              <div className="w-16 h-16 bg-brand-gold/10 text-brand-gold rounded-2xl flex items-center justify-center mx-auto group-hover:bg-brand-gold group-hover:text-white transition-all">
                <Briefcase size={32} />
              </div>
              <h4 className="text-xl font-serif font-bold text-brand-dark">I am an Employer</h4>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black">Looking for elite talent</p>
            </button>
          </div>
        </div>
      </MotionDiv>
    </div>
  );
};

const Home: React.FC = () => {
  const [selectionOpen, setSelectionOpen] = useState(false);

  return (
    <div className="overflow-hidden">
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center bg-brand-dark overflow-hidden px-4 sm:px-6">
        <div className="absolute inset-0 z-0 opacity-20">
           <div className="absolute top-0 right-0 w-[400px] h-[400px] sm:w-[800px] sm:h-[800px] bg-brand-gold/10 rounded-full blur-[80px] sm:blur-[120px] -translate-y-1/2 translate-x-1/2" />
        </div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10 py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <MotionDiv initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-6 sm:space-y-10 text-center lg:text-left">
              <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                <ShieldCheck size={14} className="sm:size-[16px]" />
                <span>Executive Sourcing Excellence</span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl lg:text-8xl font-serif font-bold text-white leading-[1.1] sm:leading-[0.9] tracking-tight">
                Right Talent, <br className="hidden sm:block"/><span className="text-brand-gold italic">Right Direction.</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-xl mx-auto lg:mx-0 font-serif italic">
                Architecting the bridge between organizational ambitions and high-tier professional mastery.
              </p>
              
              <div className="pt-4 flex justify-center lg:justify-start">
                <MotionButton 
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectionOpen(true)} 
                  className="bg-brand-gold text-brand-dark w-full sm:w-auto px-10 sm:px-14 py-5 sm:py-6 rounded-full font-bold text-lg sm:text-xl flex items-center justify-center group hover:bg-yellow-500 transition-all shadow-xl shadow-brand-gold/10"
                >
                  Consult With Us <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform" />
                </MotionButton>
              </div>
            </MotionDiv>

            <MotionDiv 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 1 }}
              className="hidden lg:block relative"
            >
               <img 
                 src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200" 
                 className="rounded-[4rem] shadow-2xl grayscale brightness-75 border border-white/10" 
                 alt="Professional Consulting" 
               />
               <div className="absolute bottom-10 left-10 p-8 bg-brand-dark/80 backdrop-blur-xl rounded-[2rem] border border-white/10 max-w-xs">
                  <p className="text-white font-serif italic text-lg leading-relaxed">"Strategic alignment is the catalyst for growth."</p>
               </div>
            </MotionDiv>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-24 space-y-4">
            <h2 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] text-brand-gold">Our Expertise</h2>
            <h3 className="text-3xl sm:text-5xl font-serif font-bold text-brand-dark">Industries We Serve</h3>
            <div className="w-16 sm:w-20 h-1 bg-brand-gold mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
            {INDUSTRIES.map((industry) => {
              const IconComponent = INDUSTRY_ICONS[industry] || HelpCircle;
              return (
                <MotionDiv 
                  whileHover={{ y: -10 }}
                  key={industry} 
                  className="p-10 sm:p-12 bg-brand-dark rounded-[2.5rem] sm:rounded-[3rem] text-center group transition-all duration-500 shadow-2xl border border-white/5"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 sm:border-4 border-brand-gold rounded-full flex items-center justify-center mx-auto mb-8 sm:mb-10 text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-dark transition-all duration-500">
                    <IconComponent size={32} className="sm:size-[36px]" />
                  </div>
                  <p className="text-lg sm:text-xl font-serif font-bold text-white group-hover:text-brand-gold transition-colors leading-snug">{industry}</p>
                </MotionDiv>
              );
            })}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectionOpen && <SelectionModal onClose={() => setSelectionOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Home;

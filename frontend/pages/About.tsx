
import React from 'react';
import { Heart, Target, Users, Gem } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div>
      <section className="bg-brand-dark text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-serif font-bold mb-6">Our Story</h1>
          <p className="text-xl text-gray-300 max-w-3xl leading-relaxed">
            DishaHire Consultancy provides end-to-end talent acquisition solutions, focusing on technical excellence and organizational alignment.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold text-brand-dark">Direction for Success</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              'Disha' means direction. We guide businesses and individuals toward sustainable growth through ethical recruitment practices and high-quality sourcing.
            </p>
          </div>
          <div className="bg-gray-100 h-80 rounded-3xl"></div>
        </div>
      </section>

      <section className="py-20 bg-brand-light">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <Heart/>, title: 'Ethics', desc: 'Transparent dealings.' },
              { icon: <Gem/>, title: 'Quality', desc: 'Rigorous vetting.' },
              { icon: <Target/>, title: 'Results', desc: 'Measurable success.' },
              { icon: <Users/>, title: 'Partnership', desc: 'Long-term focus.' }
            ].map((v) => (
              <div key={v.title} className="bg-white p-8 rounded-2xl shadow-sm text-center">
                <div className="inline-flex p-3 rounded-lg bg-brand-dark text-brand-gold mb-4">{v.icon}</div>
                <h4 className="font-bold text-lg text-brand-dark mb-2">{v.title}</h4>
                <p className="text-gray-500 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

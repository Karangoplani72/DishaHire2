
import React from 'react';
import { COMMERCIAL_TERMS } from '../constants';
import { Info, ShieldAlert, CreditCard } from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <div className="bg-white">
      <section className="bg-brand-dark text-white py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">Commercial Terms</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">Transparency and trust at the core of our business relationship.</p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="overflow-hidden border border-gray-200 rounded-3xl shadow-xl">
            <div className="bg-brand-light p-8 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold text-brand-dark">Service Fee Structure</h2>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-gold bg-brand-dark px-3 py-1 rounded">Annual Salary Based</span>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-[0.2em]">
                  <th className="px-8 py-5 font-bold">Level</th>
                  <th className="px-8 py-5 font-bold">Salary Range</th>
                  <th className="px-8 py-5 font-bold text-right">Service Charge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {COMMERCIAL_TERMS.map((term) => (
                  <tr key={term.level} className="hover:bg-gray-50 transition">
                    <td className="px-8 py-6 font-bold text-brand-dark">{term.level}</td>
                    <td className="px-8 py-6 text-gray-500">{term.range}</td>
                    <td className="px-8 py-6 text-right font-serif font-bold text-brand-gold text-lg">{term.charges}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-brand-light p-10 rounded-3xl border border-brand-gold/10 space-y-4">
              <div className="w-12 h-12 bg-brand-dark text-brand-gold rounded-xl flex items-center justify-center">
                <ShieldAlert size={24} />
              </div>
              <h3 className="text-xl font-bold text-brand-dark">Replacement Guarantee</h3>
              <p className="text-gray-600 leading-relaxed">
                We offer a comprehensive <span className="text-brand-dark font-bold">45-day replacement period</span>. If a candidate leaves or fails to perform within this timeframe, we provide a replacement at no additional cost.
              </p>
            </div>

            <div className="bg-brand-light p-10 rounded-3xl border border-brand-gold/10 space-y-4">
              <div className="w-12 h-12 bg-brand-dark text-brand-gold rounded-xl flex items-center justify-center">
                <CreditCard size={24} />
              </div>
              <h3 className="text-xl font-bold text-brand-dark">Payment Period</h3>
              <p className="text-gray-600 leading-relaxed">
                Invoices are payable <span className="text-brand-dark font-bold">within 10 days</span> from the candidate's joining date. This ensures swift processing and continuous support during the onboarding phase.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-6 bg-brand-dark/5 rounded-2xl border border-brand-dark/10">
            <Info className="text-brand-dark flex-shrink-0" />
            <p className="text-xs text-gray-500 italic">
              * GST will be applicable over and above the mentioned charges as per government regulations. Terms are subject to mutual agreement via the Master Services Agreement (MSA).
            </p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Terms;

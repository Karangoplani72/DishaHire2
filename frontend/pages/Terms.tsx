
import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <section className="bg-brand-dark text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-serif font-bold mb-6">Commercial Terms</h1>
          <p className="text-gray-400 font-serif italic text-lg">Transparency and integrity in every strategic engagement.</p>
        </div>
      </section>
      
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark mb-6">Standard Engagement Protocol</h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-8">
                DishaHire operates on a performance-based consultancy model. Our terms are designed to ensure mutual commitment and successful outcomes for both our corporate partners and candidates.
              </p>
              
              <div className="grid gap-6">
                {[
                  { title: "Placement Fees", detail: "Calculated as a fixed percentage of the candidate's total annual CTC, payable upon successful joining." },
                  { title: "Service Guarantee", detail: "Standard replacement guarantee periods apply to all full-time mandates to ensure organizational stability." },
                  { title: "Confidentiality", detail: "Absolute protection of corporate strategy and candidate privacy is maintained through NDA-level standards." },
                  { title: "Exclusivity", detail: "Preferential sourcing pipelines are activated for exclusive talent mandates." }
                ].map((item, idx) => (
                  <div key={idx} className="p-6 bg-brand-light border border-gray-100 rounded-2xl flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center font-bold text-sm flex-shrink-0">
                      0{idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-dark uppercase tracking-wider text-xs mb-1">{item.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100 text-center">
              <p className="text-gray-400 text-sm italic font-serif">
                Specific engagement terms are detailed in our signed master service agreements (MSA).
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;

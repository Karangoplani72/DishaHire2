
import React from 'react';
import { COMMERCIAL_TERMS } from '../constants.tsx';

const Terms: React.FC = () => {
  return (
    <div className="py-24 max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-serif font-bold text-brand-dark mb-12">Commercial Terms</h1>
      <div className="border rounded-2xl overflow-hidden mb-12">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left font-bold text-sm text-gray-500">Level</th>
              <th className="px-6 py-4 text-right font-bold text-sm text-gray-500">Service Charge</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {COMMERCIAL_TERMS.map(t => (
              <tr key={t.level}>
                <td className="px-6 py-4 font-bold text-brand-dark">{t.level}</td>
                <td className="px-6 py-4 text-right text-brand-gold font-serif font-bold">{t.charges}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-brand-light p-8 rounded-2xl border border-brand-gold/10">
        <h3 className="font-bold text-lg mb-4">Service Guarantee</h3>
        <p className="text-gray-600">We offer a 45-day replacement period for all successful placements.</p>
      </div>
    </div>
  );
};

export default Terms;

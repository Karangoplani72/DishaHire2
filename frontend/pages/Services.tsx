
import React from 'react';
import { Briefcase, UserPlus, ClipboardList } from 'lucide-react';

const Services: React.FC = () => {
  const categories = [
    { title: 'Recruitment & Staffing', icon: <Briefcase/>, desc: 'Permanent and contract staffing for various levels.' },
    { title: 'Talent Sourcing', icon: <UserPlus/>, desc: 'Advanced candidate screening and assessment.' },
    { title: 'HR Consultancy', icon: <ClipboardList/>, desc: 'Strategic manpower planning and policy support.' }
  ];

  return (
    <div>
      <section className="bg-brand-dark text-white py-24 text-center">
        <h1 className="text-5xl font-serif font-bold">Services</h1>
      </section>
      <section className="py-20 max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12">
        {categories.map(c => (
          <div key={c.title} className="p-10 border rounded-3xl hover:shadow-xl transition-all">
            <div className="text-brand-gold mb-6">{c.icon}</div>
            <h3 className="text-2xl font-serif font-bold text-brand-dark mb-4">{c.title}</h3>
            <p className="text-gray-600">{c.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Services;

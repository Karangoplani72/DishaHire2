
import React from 'react';
import { Briefcase, UserPlus, ClipboardList, CheckCircle } from 'lucide-react';
import { CONTACT_INFO } from '../constants.tsx';

const Services: React.FC = () => {
  const serviceCategories = [
    {
      title: 'Recruitment & Staffing',
      icon: <Briefcase className="w-8 h-8 sm:w-10 sm:h-10" />,
      items: ['Permanent Staffing', 'Contract & Temporary Staffing', 'Bulk Hiring Solutions'],
      desc: 'Scalable solutions for teams of all sizes, from niche startups to global enterprises.'
    },
    {
      title: 'Talent Sourcing',
      icon: <UserPlus className="w-8 h-8 sm:w-10 sm:h-10" />,
      items: ['Resume Screening & Shortlisting', 'Candidate Assessment & Interviews', 'Background Verification Support'],
      desc: 'Expert-led discovery of top-tier talent using advanced sourcing technologies.'
    },
    {
      title: 'HR Consultancy',
      icon: <ClipboardList className="w-8 h-8 sm:w-10 sm:h-10" />,
      items: ['HR Policy Support', 'Manpower Planning', 'Employee Onboarding Assistance'],
      desc: 'Strategic guidance on organizational structure, policy, and long-term HR strategy.'
    }
  ];

  return (
    <div className="bg-white">
      <section className="bg-brand-dark text-white py-20 sm:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-7xl font-serif font-bold mb-6">Our Services</h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">Comprehensive human resource solutions tailored to your business goals.</p>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-16 sm:space-y-24">
          {serviceCategories.map((service, idx) => (
            <div key={service.title} className={`flex flex-col lg:flex-row gap-10 lg:gap-16 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="flex-1 space-y-6 sm:space-y-8 w-full">
                <div className="inline-flex p-3 sm:p-4 rounded-2xl bg-brand-light text-brand-gold border border-brand-gold/20">
                  {service.icon}
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-dark">{service.title}</h2>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">{service.desc}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {service.items.map((item) => (
                    <div key={item} className="flex items-center space-x-3 p-3 sm:p-4 bg-brand-light rounded-xl border border-gray-100">
                      <CheckCircle className="text-brand-gold flex-shrink-0" size={18} />
                      <span className="font-bold text-brand-dark text-[13px] sm:text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 w-full">
                <div className="relative">
                   <div className="absolute -inset-2 sm:-inset-4 bg-brand-gold/10 rounded-[2rem] sm:rounded-3xl blur-xl" />
                   <img 
                    src={`https://images.unsplash.com/photo-${idx === 0 ? '1486406146926-c627a92ad1ab' : idx === 1 ? '1504384308090-c894fdcc538d' : '1600880292203-757bb62b4baf'}?auto=format&fit=crop&q=80&w=800`}
                    alt={service.title}
                    className="relative z-10 rounded-[2rem] sm:rounded-3xl shadow-2xl grayscale w-full object-cover"
                   />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-brand-dark text-white text-center px-4">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold">Ready to discuss your requirements?</h2>
          <p className="text-sm sm:text-base text-gray-400">Our senior consultants are available for a one-on-one session to understand your hiring goals.</p>
          <a 
            href={CONTACT_INFO.whatsapp} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block w-full sm:w-auto bg-brand-gold text-brand-dark px-10 py-4 rounded-full font-bold hover:bg-yellow-500 transition shadow-lg text-sm sm:text-base"
          >
            Schedule a Meeting
          </a>
        </div>
      </section>
    </div>
  );
};

export default Services;

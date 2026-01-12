
import React from 'react';
import { Briefcase, Users, FileCheck, Building2, TrendingUp, ShieldCheck } from 'lucide-react';

export const BRAND_COLORS = {
  DARK: '#0d3d3b',
  GOLD: '#b08d3e',
  TEXT_GOLD: '#c7a354',
};

export const LOGO_URL = 'https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/public/og.png'; // Placeholder for the actual logo asset if not provided locally

export const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Jobs', href: '/jobs' },
  { name: 'Terms', href: '/terms' },
];

export const INDUSTRIES = [
  'IT & Technology',
  'BPO & Customer Support',
  'Manufacturing',
  'Sales & Marketing',
  'Healthcare',
  'Finance & Accounts'
];

export const PROCESS_STEPS = [
  { icon: <Building2 className="w-8 h-8" />, title: 'Requirements', desc: 'Understanding client goals & culture' },
  { icon: <TrendingUp className="w-8 h-8" />, title: 'Sourcing', desc: 'Deep-dive talent hunting across channels' },
  { icon: <FileCheck className="w-8 h-8" />, title: 'Screening', desc: 'Rigorous assessment & technical vetting' },
  { icon: <Users className="w-8 h-8" />, title: 'Coordination', desc: 'Seamless interview management' },
  { icon: <Briefcase className="w-8 h-8" />, title: 'Placement', desc: 'Final selection and offer support' },
  { icon: <ShieldCheck className="w-8 h-8" />, title: 'Follow-up', desc: 'Post-placement success tracking' },
];

export const COMMERCIAL_TERMS = [
  { level: 'Junior Level', range: '1 Lac to 4 Lac', charges: '5.50%' },
  { level: 'Middle Level', range: '4 Lac to 8 Lac', charges: '6.50%' },
  { level: 'Higher Level', range: '10 Lac and above', charges: '8.33%' },
];

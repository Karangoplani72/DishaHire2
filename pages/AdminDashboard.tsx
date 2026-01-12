
import React, { useState } from 'react';
import { LayoutDashboard, Users, Briefcase, MessageSquare, LogOut, Search, Bell, CheckCircle, Trash2, Mail } from 'lucide-react';
import { EnquiryType, Enquiry } from '../types.ts';

const MOCK_ENQUIRIES: Enquiry[] = [
  { id: '1', type: EnquiryType.EMPLOYER, name: 'Sanjay Gupta', email: 'sanjay@fincorp.com', phone: '9820098200', message: 'Need to hire 5 React devs urgently.', status: 'PENDING', priority: 'HIGH', company: 'FinCorp', createdAt: '2024-05-01 10:00 AM' },
  { id: '2', type: EnquiryType.CANDIDATE, name: 'Priya Sharma', email: 'priya@example.com', phone: '9123456789', message: 'Looking for remote architect roles.', status: 'PENDING', experience: '12 Years', createdAt: '2024-05-01 11:30 AM' },
];

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'enquiries' | 'jobs' | 'content'>('overview');

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-brand-dark text-white flex flex-col">
        <div className="p-8 border-b border-white/5">
           <h2 className="text-xl font-serif font-bold tracking-widest">DISHA<span className="text-brand-gold">ADMIN</span></h2>
        </div>
        <nav className="flex-grow py-8 space-y-2">
          {[
            { id: 'overview', icon: <LayoutDashboard size={20}/>, label: 'Overview' },
            { id: 'enquiries', icon: <MessageSquare size={20}/>, label: 'Enquiries' },
            { id: 'jobs', icon: <Briefcase size={20}/>, label: 'Job Listings' },
            { id: 'content', icon: <Users size={20}/>, label: 'Content/Blogs' },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center space-x-4 px-8 py-4 transition ${
                activeTab === item.id ? 'bg-brand-gold text-brand-dark font-bold' : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              {item.icon}
              <span className="text-sm uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-8 border-t border-white/5">
          <button onClick={() => window.location.href = '#/'} className="flex items-center space-x-4 text-gray-400 hover:text-white transition w-full">
            <LogOut size={20} />
            <span className="text-sm font-bold uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search enquiries, jobs..." className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-gray-200 outline-none text-sm" />
          </div>
          <div className="flex items-center space-x-6">
            <button className="relative text-gray-400 hover:text-brand-dark">
              <Bell size={24} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center space-x-3 border-l border-gray-100 pl-6">
              <div className="text-right">
                <p className="text-sm font-bold text-brand-dark">Admin User</p>
                <p className="text-[10px] uppercase text-gray-400 font-bold">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-gold text-brand-dark flex items-center justify-center font-bold">AU</div>
            </div>
          </div>
        </header>

        {/* Dynamic View */}
        <main className="p-10">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Enquiries</p>
                  <p className="text-4xl font-serif font-bold text-brand-dark">128</p>
                  <p className="text-xs text-green-500 mt-2 font-bold">+12% this week</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Active Jobs</p>
                  <p className="text-4xl font-serif font-bold text-brand-dark">24</p>
                  <p className="text-xs text-gray-400 mt-2">Across 6 industries</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Success Rate</p>
                  <p className="text-4xl font-serif font-bold text-brand-dark">94%</p>
                  <p className="text-xs text-green-500 mt-2 font-bold">Target achieved</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Pending Replies</p>
                  <p className="text-4xl font-serif font-bold text-brand-dark">12</p>
                  <p className="text-xs text-red-500 mt-2 font-bold">Action required</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-xl font-serif font-bold text-brand-dark">Recent Activity</h3>
                </div>
                <div className="p-0">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400">
                      <tr>
                        <th className="px-8 py-4">Action</th>
                        <th className="px-8 py-4">User</th>
                        <th className="px-8 py-4">Status</th>
                        <th className="px-8 py-4">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {[1,2,3].map(i => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-8 py-4 font-bold text-brand-dark">New Job Posted: Senior Dev</td>
                          <td className="px-8 py-4 text-gray-500">Editor Michael</td>
                          <td className="px-8 py-4"><span className="text-[10px] px-2 py-1 bg-green-100 text-green-700 font-bold rounded">SUCCESS</span></td>
                          <td className="px-8 py-4 text-gray-400">2 hours ago</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-bold text-brand-dark mb-8">Enquiry Inbox</h2>
              {MOCK_ENQUIRIES.map((enq) => (
                <div key={enq.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between group">
                  <div className="flex items-start space-x-6">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold shadow-sm ${
                      enq.type === EnquiryType.EMPLOYER ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {enq.type === EnquiryType.EMPLOYER ? 'E' : 'C'}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-4">
                        <h4 className="text-lg font-bold text-brand-dark">{enq.name}</h4>
                        {enq.priority === 'HIGH' && <span className="text-[10px] px-2 py-1 bg-red-100 text-red-600 font-bold rounded">URGENT</span>}
                        <span className="text-[10px] text-gray-400">{enq.createdAt}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 font-medium">
                        <span className="flex items-center space-x-1"><Mail size={14}/> <span>{enq.email}</span></span>
                        {enq.company && <span>• {enq.company}</span>}
                        {enq.experience && <span>• {enq.experience} exp</span>}
                      </div>
                      <p className="text-sm text-gray-600 max-w-2xl bg-gray-50 p-4 rounded-xl italic">"{enq.message}"</p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-brand-dark text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center justify-center gap-2">
                      Reply via Email
                    </button>
                    <div className="flex gap-2">
                       <button className="flex-1 bg-green-50 text-green-700 text-xs font-bold px-3 py-2 rounded-lg flex items-center justify-center border border-green-100">
                        <CheckCircle size={14} className="mr-1"/> Mark Replied
                      </button>
                      <button className="p-2 bg-red-50 text-red-600 rounded-lg border border-red-100">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'jobs' && (
             <div className="bg-white p-12 rounded-3xl text-center space-y-4 shadow-sm border border-gray-100">
                <Briefcase className="w-16 h-16 text-brand-gold mx-auto opacity-20" />
                <h3 className="text-2xl font-serif font-bold text-brand-dark">Job Management CRUD</h3>
                <p className="text-gray-400 max-w-sm mx-auto">This section allows admins to Add, Edit, and Delete professional job listings visible on the public portal.</p>
                <button className="bg-brand-dark text-white px-8 py-3 rounded-xl font-bold">Post New Opening</button>
             </div>
          )}

          {activeTab === 'content' && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                <div className="text-xs font-bold uppercase tracking-widest text-brand-gold">Feedback Moderation</div>
                <p className="text-gray-400 text-sm">Approve or reject public testimonials. Add admin responses to build trust.</p>
                <button className="text-brand-dark font-bold border-b border-brand-dark pb-1 text-sm">Manage Feedbacks (8 pending)</button>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                <div className="text-xs font-bold uppercase tracking-widest text-brand-gold">Insights & Blog</div>
                <p className="text-gray-400 text-sm">Write career tips and hiring insights to position DishaHire as a thought leader.</p>
                <button className="text-brand-dark font-bold border-b border-brand-dark pb-1 text-sm">Create Article</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

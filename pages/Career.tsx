
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, BookOpen, Loader2 } from 'lucide-react';
import { db } from '../utils/db.ts';

const Career: React.FC = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.getBlogs().then(data => {
      setBlogs(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-brand-light min-h-screen">
      <section className="bg-brand-dark text-white py-32 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-6xl font-serif font-bold mb-6">Career Insights</h1>
          <p className="text-xl text-gray-400 font-serif italic">Strategies for the modern workplace, curated by our experts.</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-24">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-gold" size={48} /></div>
        ) : blogs.length > 0 ? (
          <div className="grid gap-16">
            {blogs.map((blog, idx) => (
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={blog._id} 
                className="bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100 hover:shadow-2xl transition-all"
              >
                <div className="flex items-center gap-6 mb-8">
                  <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-gold">
                    <Calendar size={14} /> {new Date(blog.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <User size={14} /> {blog.author}
                  </span>
                </div>
                <h2 className="text-4xl font-serif font-bold text-brand-dark mb-6">{blog.title}</h2>
                <p className="text-xl text-gray-600 font-serif italic leading-relaxed mb-8">{blog.excerpt}</p>
                <div className="h-px bg-gray-100 w-full mb-8" />
                <div className="prose max-w-none text-gray-700 leading-loose">
                  {blog.content}
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <BookOpen size={48} className="mx-auto text-gray-200 mb-6" />
            <p className="text-gray-400 font-serif italic text-xl">Our editorial team is currently crafting new insights. Check back soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Career;

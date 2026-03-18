import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function construction({ title, onBack }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex flex-col items-center justify-center bg-[#fdfcfb] px-6 text-center"
    >
      {/* Aesthetic Icon */}
      <div className="mb-8 p-4 bg-white rounded-full shadow-sm border border-slate-50">
        <Sparkles className="w-8 h-8 text-pink-300 animate-pulse" />
      </div>

      {/* Dynamic Title */}
      <div>
      <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic text-slate-900 mb-4">
        {title}</h1>
      </div>
      
      {/* The Aesthetic "In Construction" message */}
      <div className="max-w-xs md:max-w-md space-y-6">
        <p className="text-slate-400 text-sm leading-relaxed italic">
          "Currently being curated with love. We are perfecting every detail of your {title.toLowerCase()} experience to ensure it radiates perfection."
        </p>
        
        <div className="h-[1px] w-12 bg-pink-100 mx-auto" />
        
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-pink-500">
          Coming Soon
        </p>

        {/* Back Button */}
        <button 
          onClick={onBack}
          className="mt-8 flex items-center cursor-pointer justify-center gap-2 mx-auto text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 border-b border-slate-800 pb-1 hover:text-pink-600 hover:border-pink-600 transition-all"
        >
          <ArrowLeft className="w-3 h-3" /> Return to Boutique
        </button>
      </div>
    </motion.div>
  );
}
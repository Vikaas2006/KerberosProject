import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 border-b border-emerald-500/20 py-8 px-4"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
            <Shield className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white font-display">
              Kerberos <span className="text-emerald-500">Protocol</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium mt-1">
              Advanced Authentication Simulation
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Secured System</span>
          </div>
          <div className="px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">V3.0 Beta</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;

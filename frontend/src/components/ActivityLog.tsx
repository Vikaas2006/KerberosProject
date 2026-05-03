import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Clock, Shield, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { LogEntry } from '../types/types';

interface ActivityLogProps {
  logs: LogEntry[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ logs }) => {
  return (
    <div className="bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Log Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          <div className="ml-4 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-300 font-display uppercase tracking-widest">Protocol Monitor</h3>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Live Feed</span>
        </div>
      </div>

      {/* Log Content */}
      <div className="p-6 max-h-[500px] overflow-y-auto font-mono scrollbar-hide">
        {logs.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-600">
            <Terminal className="w-8 h-8 mb-4 opacity-20" />
            <p className="text-sm italic">Waiting for system events...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {logs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-4 group"
                >
                  <div className="flex flex-col items-center gap-2 mt-1">
                    <div className={`p-1.5 rounded-lg border ${
                      log.status === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                      log.status === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                      log.status === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                      'bg-blue-500/10 border-blue-500/20 text-blue-500'
                    }`}>
                      {log.status === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                       log.status === 'error' ? <AlertCircle className="w-3.5 h-3.5" /> :
                       log.status === 'warning' ? <Shield className="w-3.5 h-3.5" /> :
                       <Shield className="w-3.5 h-3.5" />}
                    </div>
                    {index !== logs.length - 1 && <div className="w-px h-full bg-slate-800"></div>}
                  </div>

                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{log.actor}</span>
                      <ChevronRight className="w-3 h-3 text-slate-700" />
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{log.timestamp}</span>
                      </div>
                    </div>
                    <p className={`text-xs leading-relaxed ${
                      log.status === 'success' ? 'text-emerald-400' :
                      log.status === 'error' ? 'text-rose-400' :
                      log.status === 'warning' ? 'text-amber-400' :
                      'text-slate-300'
                    }`}>
                      <span className="opacity-50 mr-2">$</span>
                      {log.action}
                    </p>
                  </div>
                </motion.div>
              )).reverse()}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Log Footer */}
      <div className="bg-slate-900/50 border-t border-slate-800 p-4">
        <p className="text-[10px] text-slate-500 text-center font-medium italic">
          Encryption: AES-256 | Protocol: Kerberos v5 | Transport: TLS 1.3
        </p>
      </div>
    </div>
  );
};

export default ActivityLog;

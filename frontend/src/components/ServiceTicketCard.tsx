import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

interface ServiceTicketCardProps {
  onRequestServiceTicket: () => Promise<void>;
  loading: boolean;
  error: string | null;
  isActive: boolean;
  hasTGT: boolean;
  tgtExpiry: string | null;
}

const ServiceTicketCard: React.FC<ServiceTicketCardProps> = ({
  onRequestServiceTicket,
  loading,
  error,
  isActive,
  hasTGT,
  tgtExpiry,
}) => {
  if (!isActive && !hasTGT) {
    return (
      <div className="disabled-step">
        <div className="bg-slate-800/50 rounded-2xl card-shadow p-8 border-l-4 border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <Ticket className="w-6 h-6 text-slate-500" />
            <h2 className="text-2xl font-bold text-slate-500 font-display">Step 2: Service Ticket Request</h2>
          </div>
          <p className="text-slate-500 font-medium italic">Requirement: Valid TGT token from Step 1</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`bg-slate-800/80 rounded-2xl card-shadow p-8 border-l-4 overflow-hidden relative ${isActive ? 'border-amber-500 active-step' : 'border-slate-700'}`}>
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${isActive ? 'bg-amber-500/10' : 'bg-slate-700/50'}`}>
              <Ticket className={`w-6 h-6 ${isActive ? 'text-amber-500' : 'text-slate-500'}`} />
            </div>
            <div>
              <h2 className={`text-2xl font-bold font-display tracking-tight ${isActive ? 'text-white' : 'text-slate-400'}`}>Step 2: Request Service Ticket</h2>
              <p className="text-amber-500/60 text-[10px] font-bold uppercase tracking-widest mt-1">Client ⟷ Ticket Granting Server (TGS)</p>
            </div>
          </div>

          {hasTGT && (
            <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <div className="text-left">
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">TGT Verified</p>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-500/60" />
                  <p className="text-[10px] text-slate-300">Exp: {tgtExpiry}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="text-slate-300 mb-8 text-sm leading-relaxed max-w-2xl">
          Use your Ticket Granting Ticket (TGT) to request a Service Ticket from the TGS. This ticket is required to access specific services without re-entering your password.
        </p>

        <div className="flex flex-col md:flex-row gap-6 items-center">
          <motion.button
            whileHover={isActive ? { scale: 1.01 } : {}}
            whileTap={isActive ? { scale: 0.99 } : {}}
            onClick={onRequestServiceTicket}
            disabled={loading || !isActive}
            className={`flex-1 w-full md:w-auto px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg ${
              isActive 
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-amber-900/10' 
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-slate-900 border-t-transparent rounded-full"></div>
                <span className="tracking-wide">Contacting TGS...</span>
              </>
            ) : (
              <>
                <span className="tracking-wide">Request Service Ticket</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>

          <div className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-amber-500 text-xs mt-0.5">💡</span>
              <p className="text-[11px] text-slate-400 italic leading-relaxed">
                "The TGS verifies that your TGT is authentic and has not expired before issuing a ticket specifically for the requested service."
              </p>
            </div>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl"
          >
            <p className="text-xs font-medium">{error}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ServiceTicketCard;

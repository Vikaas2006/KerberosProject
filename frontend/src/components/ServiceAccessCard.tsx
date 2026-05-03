import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, ExternalLink, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

interface ServiceAccessCardProps {
  onAccessResource: () => Promise<void>;
  loading: boolean;
  error: string | null;
  isActive: boolean;
  hasServiceTicket: boolean;
  protectedData: any;
  serviceTicketExpiry: string | null;
}

const ServiceAccessCard: React.FC<ServiceAccessCardProps> = ({
  onAccessResource,
  loading,
  error,
  isActive,
  hasServiceTicket,
  protectedData,
  serviceTicketExpiry,
}) => {
  if (!isActive && !protectedData && !hasServiceTicket) {
    return (
      <div className="disabled-step">
        <div className="bg-slate-800/50 rounded-2xl card-shadow p-8 border-l-4 border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <Server className="w-6 h-6 text-slate-500" />
            <h2 className="text-2xl font-bold text-slate-500 font-display">Step 3: Service Access</h2>
          </div>
          <p className="text-slate-500 font-medium italic">Requirement: Service Ticket from Step 2</p>
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
      <div className={`bg-slate-800/80 rounded-2xl card-shadow p-8 border-l-4 overflow-hidden relative ${protectedData ? 'border-emerald-500' : isActive ? 'border-blue-500 active-step' : 'border-slate-700'}`}>
        {/* Decorative element */}
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 blur-2xl ${protectedData ? 'bg-emerald-500/5' : 'bg-blue-500/5'}`}></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${protectedData ? 'bg-emerald-500/10' : isActive ? 'bg-blue-500/10' : 'bg-slate-700/50'}`}>
              {protectedData ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Server className={`w-6 h-6 ${isActive ? 'text-blue-500' : 'text-slate-500'}`} />}
            </div>
            <div>
              <h2 className={`text-2xl font-bold font-display tracking-tight ${protectedData || isActive ? 'text-white' : 'text-slate-400'}`}>
                Step 3: {protectedData ? 'Access Granted' : 'Service Access'}
              </h2>
              <p className="text-blue-400/60 text-[10px] font-bold uppercase tracking-widest mt-1">Client ⟷ Application Service</p>
            </div>
          </div>

          <AnimatePresence>
            {hasServiceTicket && !protectedData && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-xl"
              >
                <div className="text-right">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">Service Ticket Ready</p>
                  <p className="text-[10px] text-slate-300">Exp: {serviceTicketExpiry}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-blue-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!protectedData ? (
          <div className="space-y-8">
            <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
              Finally, present your Service Ticket to the Application Server. The service will verify the ticket with its shared secret and grant you access to the requested resources.
            </p>

            <motion.button
              whileHover={isActive ? { scale: 1.01 } : {}}
              whileTap={isActive ? { scale: 0.99 } : {}}
              onClick={onAccessResource}
              disabled={loading || !isActive}
              className={`w-full md:w-auto px-12 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg ${
                isActive 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20' 
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span className="tracking-wide">Verifying Access...</span>
                </>
              ) : (
                <>
                  <span className="tracking-wide">Access Secure Service</span>
                  <ExternalLink className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
              {/* Abstract pattern */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #10B981 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-4 h-4 text-emerald-500" />
                <h3 className="text-lg font-bold text-emerald-400 font-display uppercase tracking-wider">Protected Response</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Service Entity</p>
                  <p className="text-emerald-400 font-bold">{protectedData.service}</p>
                </div>
                <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Status Code</p>
                  <p className="text-white font-mono">200 OK - AUTHORIZED</p>
                </div>
              </div>
              
              <div className="mt-4 bg-slate-950 rounded-xl p-4 border border-slate-700/50">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Payload Data</p>
                <div className="text-slate-300 font-mono text-xs leading-loose">
                  <span className="text-emerald-500">&gt; </span>
                  {protectedData.secretMessage}
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="bg-emerald-500/10 px-6 py-2 rounded-full border border-emerald-500/20">
                <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Protocol Flow Complete</p>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <p className="text-xs font-medium">{error}</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ServiceAccessCard;

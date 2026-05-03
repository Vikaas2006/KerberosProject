import { motion } from 'framer-motion';
import { LogIn, User, Lock } from 'lucide-react';
import { useState } from 'react';

interface LoginCardProps {
  onLogin: (username: string, password: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  isActive: boolean;
}

const LoginCard: React.FC<LoginCardProps> = ({ onLogin, loading, error, isActive }) => {
  const [username, setUsername] = useState('alice');
  const [password, setPassword] = useState('password123');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(username, password);
  };

  if (!isActive) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.5, y: 0 }}
        className="disabled-step"
      >
        <div className="bg-slate-800/50 rounded-2xl card-shadow p-8 border-l-4 border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <LogIn className="w-6 h-6 text-slate-500" />
            <h2 className="text-2xl font-bold text-slate-500 font-display">Step 1: Authentication</h2>
          </div>
          <p className="text-slate-500 font-medium italic">Requirement: Initial Access Request</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-slate-800/80 rounded-2xl card-shadow p-8 border-l-4 border-emerald-500 active-step overflow-hidden relative">
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-emerald-500/10 rounded-xl">
            <LogIn className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white font-display tracking-tight">Step 1: Authentication</h2>
            <p className="text-emerald-500/60 text-xs font-bold uppercase tracking-widest mt-1">Client ⟷ Authentication Server</p>
          </div>
        </div>

        <p className="text-slate-300 mb-8 text-sm leading-relaxed max-w-2xl">
          Enter your credentials to initiate the Kerberos flow. The Authentication Server (AS) will verify your identity and grant you a Ticket Granting Ticket (TGT).
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <User className="w-3 h-3" /> Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                disabled={loading}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-white transition-all"
              />
              <p className="text-[10px] text-slate-500 mt-2 font-medium">Suggested: <span className="text-emerald-500/60">alice, bob, charlie</span></p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <Lock className="w-3 h-3" /> Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                disabled={loading}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl"
              >
                <p className="text-xs font-medium">{error}</p>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/20"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span className="tracking-wide">Authenticating...</span>
                </>
              ) : (
                <>
                  <span className="tracking-wide">Initialize Login</span>
                  <LogIn className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-700/50">
          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 flex gap-4 items-start">
            <div className="bg-emerald-500/10 p-1.5 rounded-lg mt-0.5">
              <span className="text-emerald-500 text-xs">ℹ️</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="font-bold text-emerald-500 uppercase tracking-tighter mr-1">System Logic:</span> 
              Your credentials are never stored. The AS uses them to verify your identity and generate a session key, providing you with a TGT for subsequent requests.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginCard;

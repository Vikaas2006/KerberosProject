import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginCard from './components/LoginCard';
import ServiceTicketCard from './components/ServiceTicketCard';
import ServiceAccessCard from './components/ServiceAccessCard';
import ActivityLog from './components/ActivityLog';
import { AppState, LogEntry, AuthResponse, ServiceTicketResponse, ServiceAccessResponse } from './types/types';
import { RefreshCw, BookOpen, Layers, Key, ShieldCheck } from 'lucide-react';

// API base URL
const API_BASE_URL = 'http://localhost:5000';

const App: React.FC = () => {
  // Application state
  const [state, setState] = useState<AppState>({
    username: '',
    password: '',
    tgt: null,
    tgtExpiry: null,
    serviceTicket: null,
    serviceTicketExpiry: null,
    protectedData: null,
    currentStep: 1,
    loading: false,
    error: null,
    logs: [],
  });

  // Helper function to add logs
  const addLog = useCallback((actor: string, action: string, status: 'info' | 'success' | 'error' | 'warning') => {
    const timestamp = new Date().toLocaleTimeString();
    const newLog: LogEntry = {
      id: Date.now().toString(),
      actor: actor as any,
      action,
      status,
      timestamp,
    };
    setState((prev) => ({
      ...prev,
      logs: [...prev.logs, newLog],
    }));
  }, []);

  // STEP 1: AUTHENTICATION
  const handleLogin = useCallback(
    async (username: string, password: string) => {
      setState((prev) => ({ ...prev, error: null, loading: true }));
      addLog('Client', 'Initiating authentication request to AS...', 'info');
      try {
        const response = await fetch(`${API_BASE_URL}/as/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        const data: AuthResponse = await response.json();
        if (!data.success) {
          addLog('AS', `Access Denied: ${data.error}`, 'error');
          setState((prev) => ({ ...prev, error: data.error || 'Authentication failed', loading: false }));
          return;
        }
        addLog('AS', `Identity verified. Issuing TGT (TTL: ${data.expiresIn})`, 'success');
        addLog('Client', 'TGT successfully stored in local session', 'success');
        setState((prev) => ({
          ...prev,
          username: data.username || username,
          tgt: data.tgt || null,
          tgtExpiry: data.expiresIn || null,
          currentStep: 2,
          error: null,
          loading: false,
        }));
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Network error';
        addLog('System', `Critical Error: ${errorMsg}`, 'error');
        setState((prev) => ({ ...prev, error: `Connection failure: ${errorMsg}`, loading: false }));
      }
    },
    [addLog]
  );

  // STEP 2: REQUEST SERVICE TICKET
  const handleRequestServiceTicket = useCallback(async () => {
    if (!state.tgt) {
      setState((prev) => ({ ...prev, error: 'Authorization required. Please log in.' }));
      return;
    }
    setState((prev) => ({ ...prev, error: null, loading: true }));
    addLog('Client', 'Presenting TGT to Ticket Granting Server (TGS)', 'info');
    try {
      const response = await fetch(`${API_BASE_URL}/tgs/request-service`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tgt: state.tgt }),
      });
      const data: ServiceTicketResponse = await response.json();
      if (!data.success) {
        addLog('TGS', `Request Rejected: ${data.error}`, 'error');
        setState((prev) => ({ ...prev, error: data.error || 'Request failed', loading: false }));
        return;
      }
      addLog('TGS', `TGT Authentic. Service Ticket issued for ${data.service}`, 'success');
      addLog('Client', 'Service Ticket received and encrypted for transport', 'success');
      setState((prev) => ({
        ...prev,
        serviceTicket: data.serviceTicket || null,
        serviceTicketExpiry: data.expiresIn || null,
        currentStep: 3,
        error: null,
        loading: false,
      }));
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Network error';
      addLog('System', `Critical Error: ${errorMsg}`, 'error');
      setState((prev) => ({ ...prev, error: `Connection failure: ${errorMsg}`, loading: false }));
    }
  }, [state.tgt, addLog]);

  // STEP 3: ACCESS PROTECTED RESOURCE
  const handleAccessResource = useCallback(async () => {
    if (!state.serviceTicket) {
      setState((prev) => ({ ...prev, error: 'Valid Service Ticket required.' }));
      return;
    }
    setState((prev) => ({ ...prev, error: null, loading: true }));
    addLog('Client', 'Attempting resource access with Service Ticket...', 'info');
    try {
      const response = await fetch(`${API_BASE_URL}/service/data?serviceTicket=${encodeURIComponent(state.serviceTicket)}`);
      const data: ServiceAccessResponse = await response.json();
      if (!data.success) {
        addLog('Service', `Authorization Failed: ${data.error}`, 'error');
        setState((prev) => ({ ...prev, error: data.error || 'Access denied', loading: false }));
        return;
      }
      addLog('Service', `Ticket Verified. Handshake complete. Granting access.`, 'success');
      addLog('System', 'Decrypting protected resource data...', 'success');
      setState((prev) => ({
        ...prev,
        protectedData: data.data || null,
        error: null,
        loading: false,
      }));
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Network error';
      addLog('System', `Critical Error: ${errorMsg}`, 'error');
      setState((prev) => ({ ...prev, error: `Connection failure: ${errorMsg}`, loading: false }));
    }
  }, [state.serviceTicket, addLog]);

  // Reset function
  const handleReset = useCallback(() => {
    setState({
      username: '',
      password: '',
      tgt: null,
      tgtExpiry: null,
      serviceTicket: null,
      serviceTicketExpiry: null,
      protectedData: null,
      currentStep: 1,
      loading: false,
      error: null,
      logs: [],
    });
    addLog('System', 'Buffer cleared. Protocol state reset to IDLE.', 'info');
  }, [addLog]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-body selection:bg-emerald-500/30 selection:text-emerald-200">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full py-12 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-12"
        >
          {/* Main Protocol Flow */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <Layers className="w-5 h-5 text-emerald-500" />
              <h2 className="text-xl font-bold text-white font-display tracking-tight uppercase">Protocol Execution</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              <LoginCard
                onLogin={handleLogin}
                loading={state.loading && state.currentStep === 1}
                error={state.currentStep === 1 ? state.error : null}
                isActive={state.currentStep === 1}
              />

              <ServiceTicketCard
                onRequestServiceTicket={handleRequestServiceTicket}
                loading={state.loading && state.currentStep === 2}
                error={state.currentStep === 2 ? state.error : null}
                isActive={state.currentStep === 2}
                hasTGT={!!state.tgt}
                tgtExpiry={state.tgtExpiry}
              />

              <ServiceAccessCard
                onAccessResource={handleAccessResource}
                loading={state.loading && state.currentStep === 3}
                error={state.currentStep === 3 ? state.error : null}
                isActive={state.currentStep === 3}
                hasServiceTicket={!!state.serviceTicket}
                protectedData={state.protectedData}
                serviceTicketExpiry={state.serviceTicketExpiry}
              />
            </div>
          </section>

          {/* Activity Log */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <RefreshCw className={`w-5 h-5 text-amber-500 ${state.loading ? 'animate-spin' : ''}`} />
              <h2 className="text-xl font-bold text-white font-display tracking-tight uppercase">Activity Stream</h2>
            </div>
            <ActivityLog logs={state.logs} />
          </section>

          {/* Reset Action */}
          {state.currentStep >= 3 && state.protectedData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReset}
                className="px-10 py-4 bg-slate-900 border border-slate-700 hover:border-emerald-500/50 text-white font-bold rounded-2xl transition-all flex items-center gap-3 shadow-2xl"
              >
                <RefreshCw className="w-5 h-5 text-emerald-500" />
                <span className="tracking-wide">Restart Simulation Flow</span>
              </motion.button>
            </motion.div>
          )}

          {/* Educational Information Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/50 border border-slate-800 rounded-3xl p-10 relative overflow-hidden"
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <BookOpen className="w-48 h-48 text-emerald-500" />
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-amber-500/10 rounded-2xl">
                <BookOpen className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-2xl font-bold text-white font-display tracking-tight">Understanding the Architecture</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group bg-slate-950/50 rounded-2xl p-6 border border-slate-800 hover:border-emerald-500/30 transition-all duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <Key className="w-5 h-5 text-emerald-500" />
                  <h4 className="font-bold text-white font-display">I. Authentication</h4>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  The client identifies itself to the <span className="text-emerald-500/80">AS</span>. Upon verification, the server issues a <span className="text-emerald-500/80">TGT</span> encrypted with the client's secret key.
                </p>
              </div>
              
              <div className="group bg-slate-950/50 rounded-2xl p-6 border border-slate-800 hover:border-amber-500/30 transition-all duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="w-5 h-5 text-amber-500" />
                  <h4 className="font-bold text-white font-display">II. Ticket Granting</h4>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  The client presents the <span className="text-amber-500/80">TGT</span> to the <span className="text-amber-500/80">TGS</span>. The TGS verifies it and issues a Service Ticket for the desired application.
                </p>
              </div>

              <div className="group bg-slate-950/50 rounded-2xl p-6 border border-slate-800 hover:border-blue-500/30 transition-all duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <Layers className="w-5 h-5 text-blue-500" />
                  <h4 className="font-bold text-white font-display">III. Service Usage</h4>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  The client presents the Service Ticket to the <span className="text-blue-500/80">Application Server</span>, proving they have permission to access the resource.
                </p>
              </div>
            </div>

            <div className="mt-10 p-6 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center gap-6">
              <div className="hidden md:flex p-4 bg-emerald-500/10 rounded-full">
                <ShieldCheck className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  <span className="font-bold text-emerald-500 mr-2 uppercase tracking-tighter">Core Security Benefit:</span> 
                  Passwords are only used once to obtain a TGT. All subsequent steps use expiring tickets, 
                  drastically reducing the risk of credential theft during network transit.
                </p>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default App;

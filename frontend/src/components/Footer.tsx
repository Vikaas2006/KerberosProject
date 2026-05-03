import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-8 px-4 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Kerberos Interactive Simulator. Academic Project.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-slate-500 hover:text-emerald-500 transition-colors text-sm font-medium">Documentation</a>
          <a href="#" className="text-slate-500 hover:text-emerald-500 transition-colors text-sm font-medium">Security Policy</a>
          <a href="#" className="text-slate-500 hover:text-emerald-500 transition-colors text-sm font-medium">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

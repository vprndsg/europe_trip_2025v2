
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-slate-400 py-6 text-center shadow-inner mt-auto">
      <div className="container mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} Trip Planner. Have a great trip!</p>
        <p className="text-sm mt-1">Crafted with care for your adventures.</p>
      </div>
    </footer>
  );
};

export default Footer;

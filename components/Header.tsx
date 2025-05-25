
import React from 'react';
import { CalendarDaysIcon } from './IconComponents';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-slate-800 shadow-2xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-5 flex items-center">
        <CalendarDaysIcon className="w-10 h-10 text-sky-400 mr-4" />
        <h1 className="text-3xl font-bold text-sky-300" style={{ fontFamily: "'Roboto Slab', serif" }}>
          {title}
        </h1>
      </div>
    </header>
  );
};

export default Header;

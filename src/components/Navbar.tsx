// 1. IMPORT THE LINK COMPONENT
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    // A dark, professional top navigation bar using Tailwind
    <nav className="bg-slate-800 text-white p-4 shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        
        {/* App Logo / Title */}
        <div className="text-xl font-bold tracking-wider text-emerald-400">
          WEALTH<span className="text-white">TRACKER</span>
        </div>

        {/* 2. THE ROUTER LINKS */}
        <div className="flex gap-6 font-medium">
          {/* We use 'to' instead of 'href' */}
          <Link 
            to="/" 
            className="hover:text-emerald-400 transition-colors"
          >
            Dashboard
          </Link>
          
          <Link 
            to="/settings" 
            className="hover:text-emerald-400 transition-colors"
          >
            Settings
          </Link>
        </div>

      </div>
    </nav>
  );
}
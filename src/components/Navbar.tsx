// =============================================================
//  src/components/Navbar.tsx
//
//  UPGRADE FROM BEFORE:
//  Using NavLink instead of Link.
//  NavLink is aware of the current active route and applies
//  a special class when the link matches the current URL.
//  This is how navigation highlights work in real apps.
// =============================================================

import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-slate-900 text-white px-6 py-4 shadow-md">
      <div className="max-w-2xl mx-auto flex justify-between items-center">

        {/* Brand */}
        <div className="text-lg font-bold tracking-widest">
          <span className="text-emerald-400">WEALTH</span>
          <span className="text-white">TRACKER</span>
        </div>

        {/* Links */}
        <div className="flex gap-6 text-sm font-medium">
          {/*
            CONCEPT: NavLink's className as a function
            React Router passes { isActive } to the className function.
            We use this to conditionally apply styles — no useState needed!
            This is a callback prop pattern — the library calls YOUR function.
          */}
          <NavLink
            to="/"
            end   // "end" means only match exact "/" not any route starting with "/"
            className={({ isActive }) =>
              isActive
                ? 'text-emerald-400 border-b-2 border-emerald-400 pb-0.5'
                : 'text-slate-400 hover:text-white transition-colors'
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive
                ? 'text-emerald-400 border-b-2 border-emerald-400 pb-0.5'
                : 'text-slate-400 hover:text-white transition-colors'
            }
          >
            Settings
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
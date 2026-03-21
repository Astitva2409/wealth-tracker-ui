// =============================================================
//  src/components/Navbar.tsx
//  Shows logged-in user + Logout. Hidden on /login and /signup.
// =============================================================

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'text-emerald-400 border-b-2 border-emerald-400 pb-0.5'
      : 'text-slate-400 hover:text-white transition-colors';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 shadow-md">
      <div className="max-w-2xl mx-auto flex justify-between items-center">

        <div className="text-lg font-bold tracking-widest">
          <span className="text-emerald-400">WEALTH</span>
          <span className="text-white">TRACKER</span>
        </div>

        <div className="flex items-center gap-5 text-sm font-medium">
          <NavLink to="/" end className={navClass}>Dashboard</NavLink>
          <NavLink to="/transactions" className={navClass}>Transactions</NavLink>
          <NavLink to="/settings" className={navClass}>Settings</NavLink>

          <span className="text-slate-700 select-none">|</span>

          {user && (
            <span className="text-xs text-slate-400">
              Hi,{' '}
              <span className="text-white font-semibold capitalize">{user.name}</span>
            </span>
          )}

          <button
            onClick={handleLogout}
            className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'text-emerald-400 border-b-2 border-emerald-400 pb-0.5'
      : 'text-slate-400 hover:text-white transition-colors';

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 shadow-md">
      <div className="max-w-2xl mx-auto flex justify-between items-center">
        <div className="text-lg font-bold tracking-widest">
          <span className="text-emerald-400">WEALTH</span>
          <span className="text-white">TRACKER</span>
        </div>
        <div className="flex gap-6 text-sm font-medium">
          <NavLink to="/" end className={navClass}>Dashboard</NavLink>
          <NavLink to="/transactions" className={navClass}>Transactions</NavLink>
          <NavLink to="/settings" className={navClass}>Settings</NavLink>
        </div>
      </div>
    </nav>
  );
}
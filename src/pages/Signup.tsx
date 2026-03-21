// =============================================================
//  src/pages/Signup.tsx
//
//  CONCEPTS TAUGHT IN THIS FILE:
//  1. Client-side validation before calling async function
//  2. Password confirmation check — pure derived comparison
//  3. Same async/await + error/loading pattern as Login
// =============================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const navigate   = useNavigate();

  const [name, setName]                   = useState('');
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading]         = useState(false);
  const [error, setError]                 = useState<string | null>(null);

  // CONCEPT: Client-side validation
  // We validate BEFORE hitting the (fake) network.
  // In production: backend also validates — client validation is just UX,
  // never a security measure.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Guard clauses — validate early, return early
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return; // stop here — don't call signup
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await signup(name, email, password);
      navigate('/', { replace: true }); // go to dashboard after signup
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-widest">
            <span className="text-emerald-500">WEALTH</span>
            <span className="text-slate-800">TRACKER</span>
          </h1>
          <p className="text-slate-500 text-sm mt-2">Create your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Get started</h2>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Astitva Singh"
                className="w-full border border-slate-200 bg-slate-50 focus:bg-white p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition"
                required
                autoComplete="name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-slate-200 bg-slate-50 focus:bg-white p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full border border-slate-200 bg-slate-50 focus:bg-white p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition"
                required
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">Confirm password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                // CONCEPT: Inline derived validation styling
                // We compare password !== confirmPassword on every keystroke.
                // No extra state — just a derived boolean driving the class.
                className={`w-full border p-3 rounded-lg text-sm outline-none focus:ring-2 transition bg-slate-50 focus:bg-white ${
                  confirmPassword && password !== confirmPassword
                    ? 'border-rose-300 focus:ring-rose-300'
                    : 'border-slate-200 focus:ring-emerald-400'
                }`}
                required
                autoComplete="new-password"
              />
              {/* Inline mismatch hint — appears as user types */}
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-rose-500 mt-1">Passwords don't match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors mt-2"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
// =============================================================
//  src/pages/Login.tsx
//
//  CONCEPTS TAUGHT IN THIS FILE:
//  1. async/await in form submit handlers
//  2. Error state — catching and displaying API errors
//  3. Loading state — disabling form during network request
//  4. useNavigate — programmatic navigation after login
//  5. useLocation — reading the "return URL" from router state
// =============================================================

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  // ── Form state ────────────────────────────────────────────
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  // CONCEPT: Error + Loading state
  // These are classic UI states for any async operation:
  // - isLoading: true while the request is in-flight → disable button, show spinner
  // - error: non-null when the request fails → show message to user
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  // ── Where to redirect after login ────────────────────────
  // CONCEPT: Reading router state passed via <Navigate state={...}>
  // ProtectedRoute passes { from: location } when redirecting to /login.
  // We read it here so after login we go back to the original page,
  // not always to the dashboard.
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';

  // ── Submit handler ────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);     // clear any previous error
    setIsLoading(true); // start loading

    try {
      // CONCEPT: await in event handler
      // login() returns a Promise. We await it so we can handle
      // success and failure in the same try/catch block.
      await login(email, password);

      // CONCEPT: useNavigate for programmatic navigation
      // After successful login, push user to their original destination.
      // `replace: true` replaces /login in history — back button won't go back to login.
      navigate(from, { replace: true });

    } catch (err) {
      // CONCEPT: Error handling from async operations
      // If login() throws (wrong credentials, network error etc.),
      // we catch it here and show the message to the user.
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      // finally always runs — reset loading state whether success or fail
      setIsLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Brand header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-widest">
            <span className="text-emerald-500">WEALTH</span>
            <span className="text-slate-800">TRACKER</span>
          </h1>
          <p className="text-slate-500 text-sm mt-2">Sign in to your portfolio</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Welcome back</h2>

          {/*
            CONCEPT: Conditional error banner
            Only renders when `error` is not null.
            The && pattern: if left side is truthy, render the right side.
          */}
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                Email
              </label>
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
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-slate-200 bg-slate-50 focus:bg-white p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition"
                required
                autoComplete="current-password"
              />
            </div>

            {/*
              CONCEPT: Disabled state during loading
              When isLoading is true:
              - button is disabled (prevents double-submit)
              - text changes to "Signing in..." for feedback
              - opacity drops to show it's inactive
            */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors mt-2"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Link to signup */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-emerald-600 font-semibold hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Dev hint — remove before production */}
        <p className="text-center text-xs text-slate-400 mt-4">
          Use any email + password (min 6 chars) to sign in
        </p>
      </div>
    </div>
  );
}
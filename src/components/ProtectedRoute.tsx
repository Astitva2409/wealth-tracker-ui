// =============================================================
//  src/components/ProtectedRoute.tsx
//
//  CONCEPT: Route Guards / Protected Routes
//
//  This is one of the most important patterns in React apps.
//  The idea: wrap any route that requires login.
//  If the user IS logged in → render the page normally.
//  If the user is NOT logged in → silently redirect to /login.
//
//  Java analogy: like a Spring Security filter chain interceptor.
//  The request (navigation) is intercepted before reaching the
//  controller (page component). If auth fails, redirect to login.
//
//  HOW TO USE:
//  <Route path="/" element={
//    <ProtectedRoute>       ← wraps the page
//      <Dashboard />
//    </ProtectedRoute>
//  } />
// =============================================================

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // CONCEPT: <Navigate> component
    // This is React Router's way of redirecting programmatically in JSX.
    // `replace` replaces the current history entry instead of pushing a new one —
    // so pressing the back button after login doesn't send you back to /login.
    //
    // `state={{ from: location }}` passes the current URL to the login page,
    // so after successful login, the app can redirect back to where the user
    // originally wanted to go. This is the "return URL" pattern.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated — render the actual page
  return <>{children}</>;
}
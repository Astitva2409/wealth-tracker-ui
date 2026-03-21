// =============================================================
//  src/App.tsx
//
//  CONCEPT: Public vs Protected routes + conditional Navbar
// =============================================================

import { Routes, Route, useLocation } from 'react-router-dom';
import Dashboard      from './pages/Dashboard';
import Settings       from './pages/Settings';
import Transactions   from './pages/Transactions';
import Login          from './pages/Login';
import Signup         from './pages/Signup';
import Navbar         from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const location = useLocation();

  // Hide Navbar on auth pages — derived from URL, no state needed
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  return (
    <div>
      {!isAuthPage && <Navbar />}

      <Routes>
        {/* Public routes */}
        <Route path="/login"  element={<Login />}  />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes — redirect to /login if not authenticated */}
        <Route path="/" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/transactions" element={
          <ProtectedRoute><Transactions /></ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute><Settings /></ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;
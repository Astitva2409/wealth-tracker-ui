// =============================================================
//  src/App.tsx

import { Routes, Route, useLocation } from 'react-router-dom';
import Dashboard      from './pages/Dashboard';
import Settings       from './pages/Settings';
import Transactions   from './pages/Transactions';
import Login          from './pages/Login';
import Signup         from './pages/Signup';
import Navbar         from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary  from './components/ErrorBoundary';

function App() {
    const location = useLocation();
    const isAuthPage = ['/login', '/signup'].includes(location.pathname);

    return (
        <div>
            {!isAuthPage && <Navbar />}

            {/* ErrorBoundary wraps all routes
                Any unhandled error in any page shows our fallback UI
                instead of a blank white screen */}
            <ErrorBoundary>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login"  element={<Login />}  />
                    <Route path="/signup" element={<Signup />} />

                    {/* Protected routes */}
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
            </ErrorBoundary>
        </div>
    );
}

export default App;
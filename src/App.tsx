import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Navbar from './components/Navbar';

function App() {
  return (
    // We wrap the whole app in a generic div so we can stack the Navbar on top
    <div>
      {/* 1. The Navbar sits here. It never disappears. */}
      <Navbar />

      {/* 2. The Routes act as the changing "body" of the page */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default App;
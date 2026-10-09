import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Trace } from './pages/Trace';
import { SharedTrace } from './pages/SharedTrace';
import { Learn } from './pages/Learn';
import { LearnDS } from './pages/LearnDS';

function App() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path) && path !== '/' || (path === '/' && location.pathname === '/') 
    ? 'text-blue-600 font-bold' 
    : 'hover:text-blue-500 font-medium text-gray-600';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b px-6 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Link to="/" className="text-2xl font-extrabold text-blue-700 tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-sm">DSA</div>
            DSA Visualizer
          </Link>
          <nav className="flex gap-4 lg:gap-8 text-sm lg:text-base font-semibold">
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to="/learn" className={isActive('/learn')}>Learn</Link>
            <Link to="/trace" className={isActive('/trace')}>Trace</Link>
            <Link to="/about" className={isActive('/about')}>About</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:ds" element={<LearnDS />} />
          <Route path="/trace" element={<Trace />} />
          <Route path="/s/:id" element={<SharedTrace />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

// ----------------------------------------------------------
// >> APPLICATION << //
// ----------------------------------------------------------

import { useEffect, useState } from 'react';
import Welcome from './components/Welcome';
import Dashboard from './components/Dashboard';
import HistoricalData from './components/HistoricalData';
import NavigationBar from './components/NavigationBar';
import Header from './components/Header';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { Routes, Route } from 'react-router-dom';
import { ClusterProvider } from './contexts/ClusterContext';
import { Toaster } from './components/ui/sonner';
import ToastNotifications from './components/ToastNotifications';

const App = () => {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Toast position state for responsive behavior
  const [toastPosition, setToastPosition] = useState('top-center');

  // ----------------------------------------------------------
  // * USEEFFECT for light/dark mode toggle
  // ----------------------------------------------------------
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // ----------------------------------------------------------
  // * USEEFFECT for responsive toast positioning
  // ----------------------------------------------------------
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 640px)');

    const updateToastPosition = (e) => {
      setToastPosition(e.matches ? 'bottom-right' : 'top-center');
    };

    // Set initial position
    updateToastPosition(mediaQuery);

    // Listen for screen size changes
    mediaQuery.addEventListener('change', updateToastPosition);

    // Cleanup listener
    return () => mediaQuery.removeEventListener('change', updateToastPosition);
  }, []);

  const toggleTheme = () => {
    setIsDark((prevIsDark) => !prevIsDark);
  };

  return (
    <ClusterProvider>
      <div
        className="duration-800 min-h-screen transition-colors"
        style={{
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
        }}
      >
        {/* Global width constraint container */}
        <div className="max-w-9xl relative mx-auto px-10">
          {/* CLERK AUTH CONTROLS WITH THEME TOGGLE */}
          <Header isDark={isDark} toggleTheme={toggleTheme} />

          {/* CONDITIONAL CONTENT WITH ROUTES */}
          <SignedOut>
            <div className="pt-16">
              <Welcome />
            </div>
          </SignedOut>
          <SignedIn>
            {/* SONNER TOAST NOTIFICATIONS - Moved outside to same stacking context as Header */}
            <Toaster
              theme={isDark ? 'dark' : 'light'}
              position={toastPosition}
              className="z-[60]" // Higher than header's z-50
              richColors={true}
              expand={false}
              duration={5000}
              closeButton={false}
            />

            {/* Create a fixed viewport container that starts from top (overlaps with header) */}
            <div className="fixed bottom-0 left-0 right-0 top-0 flex flex-col">
              {/* Scrollable content area with top padding to account for header */}
              <div className="flex-1 overflow-y-auto pb-24 pt-16">
                <div className="max-w-9xl mx-auto">
                  {/* SIMPLE WEBSOCKET TOAST NOTIFICATIONS */}
                  <ToastNotifications />
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/historical" element={<HistoricalData />} />
                  </Routes>
                </div>
              </div>
            </div>
            <NavigationBar />
          </SignedIn>
        </div>
      </div>
    </ClusterProvider>
  );
};

export default App;

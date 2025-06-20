// ----------------------------------------------------------
// >> APPLICATION << //
// ----------------------------------------------------------

import { useEffect, useState } from 'react';
import Welcome from './components/Welcome';
import Dashboard from './components/Dashboard';
import HistoricalData from './components/HistoricalData';
import NavigationBar from './components/NavigationBar';
import Header from './components/Header';
import { SignedIn, SignedOut, useClerk } from '@clerk/clerk-react';
import { Routes, Route } from 'react-router-dom';
import { ClusterProvider } from './contexts/ClusterContext';
import { IconMoon, IconSun } from '@tabler/icons-react';
import FourOhFour from './components/404';

const App = () => {
  const { signOut } = useClerk();
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

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
        {/* TOP RIGHT CONTROLS - Fixed positioning with consistent z-index */}
        <div className="fixed right-4 top-4 z-[60] flex items-center gap-8">
          {/* SIGN OUT BUTTON - Only visible when signed in */}
          <SignedIn>
            <button
              onClick={() =>
                signOut(() => {
                  window.location.href = '/';
                })
              }
              className="duration-800 text-muted-foreground flex justify-center font-semibold transition-colors hover:text-red-700"
              title="Sign Out"
            >
              LOGOUT
            </button>
          </SignedIn>

          {/* DARK MODE TOGGLE */}
          <label className="swap swap-rotate cursor-pointer">
            <input
              type="checkbox"
              checked={isDark}
              onChange={toggleTheme}
              className="sr-only"
            />
            <IconMoon className="duration-800 text-muted-foreground swap-on h-6 w-6 transition-all" />
            <IconSun className="duration-800 text-muted-foreground swap-off h-6 w-6 transition-all" />
          </label>
        </div>

        {/* CLERK AUTH CONTROLS */}
        <Header />

        {/* CONDITIONAL CONTENT WITH ROUTES */}
        <SignedOut>
          <div className="pt-16">
            <Welcome />
          </div>
        </SignedOut>
        <SignedIn>
          {/* Create a fixed viewport container that accounts for header and nav */}
          <div className="fixed bottom-0 left-0 right-0 top-16 flex flex-col">
            {/* Scrollable content area that stops at navigation bar */}
            <div className="flex-1 overflow-y-auto pb-24">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/historical" element={<HistoricalData />} />
                <Route path="*" element={<FourOhFour />} />
              </Routes>
            </div>
          </div>
          <NavigationBar />
        </SignedIn>
      </div>
    </ClusterProvider>
  );
};

export default App;

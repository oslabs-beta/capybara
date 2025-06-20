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

const App = () => {
  const { signOut } = useClerk();
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

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
        {/* Fixed Top Right Controls - Using your existing constrained approach */}
        <div className="fixed left-0 right-0 top-3 z-[60]">
          <div className="max-w-9xl mx-auto px-4">
            <div className="flex items-center justify-end gap-8">
              {/* SIGN OUT BUTTON - Only visible when signed in */}
              <SignedIn>
                <button
                  onClick={() =>
                    signOut(() => {
                      window.location.href = '/';
                    })
                  }
                  className="duration-800 text-muted-foreground flex justify-center text-sm font-semibold transition-colors hover:text-red-500/70 sm:text-lg"
                  title="Sign Out"
                >
                  logout
                </button>
              </SignedIn>

              {/* DARK MODE TOGGLE */}
              <label className="swap swap-rotate cursor-pointer hover:[&_.swap-off]:text-amber-500 hover:[&_.swap-on]:text-yellow-200/90">
                <input
                  type="checkbox"
                  checked={isDark}
                  onChange={toggleTheme}
                  className="sr-only"
                />
                <IconMoon className="duration-800 text-muted-foreground swap-on transition-all" />
                <IconSun className="duration-800 text-muted-foreground swap-off transition-all" />
              </label>
            </div>
          </div>
        </div>

        {/* Global width constraint container */}
        <div className="max-w-9xl relative mx-auto px-10">
          {/* CLERK AUTH CONTROLS */}
          <Header />

          {/* CONDITIONAL CONTENT WITH ROUTES */}
          <SignedOut>
            <div className="pt-16">
              <Welcome />
            </div>
          </SignedOut>
          <SignedIn>
            {/* Create a fixed viewport container that starts from top (overlaps with header) */}
            <div className="fixed bottom-0 left-0 right-0 top-0 flex flex-col">
              {/* Scrollable content area with top padding to account for header */}
              <div className="flex-1 overflow-y-auto pb-24 pt-16">
                <div className="max-w-9xl mx-auto">
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

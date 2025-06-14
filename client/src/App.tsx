// ----------------------------------------------------------
// >> APPLICATION << //
// ----------------------------------------------------------

import { useEffect, useState } from 'react';
import Welcome from './components/Welcome';
import Dashboard from './components/Dashboard';
import HistoricalData from './components/HistoricalData';
import NavigationBar from './components/NavigationBar';
import sunIcon from './assets/sun.svg';
// import moonIcon from './assets/moon.svg';
import Header from './components/Header';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { Routes, Route } from 'react-router-dom';
import { ClusterProvider } from './contexts/ClusterContext';

const App = () => {
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
    <div
      className="duration-800 min-h-screen transition-colors"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      {/* DARK MODE TOGGLE */}
      <label className="swap swap-rotate text-foreground fixed right-4 top-4 z-[60]">
        <input type="checkbox" checked={isDark} onChange={toggleTheme} />
        <svg
          className="swap-on h-6 w-6"
          viewBox="0 0 1080 1080"
          fill="currentColor"
        >
          <g transform="matrix(45 0 0 45 540 540)">
            <path
              transform="translate(-12.03, -12.02)"
              d="M 21.64 13 C 21.345489690118693 12.756565956625769 20.938003585529355 12.702234476013857 20.59 12.86 C 19.532579267930775 13.343886912812305 18.382874261327892 13.592932804450319 17.22 13.59 C 12.742234203361669 13.584590052369732 9.107467707762853 9.967684817191547 9.08 5.489999999999998 C 9.084559989775768 4.815832695404561 9.168470807420714 4.144546154245001 9.330000000000002 3.490000000000001 C 9.399795059946166 3.134760947570775 9.272138100033237 2.769539878645109 8.996241597057162 2.5351315716052865 C 8.720345094081088 2.3007232645654643 8.339299485947288 2.2337383922183447 8 2.36 C 3.676708080566536 4.3039770392492676 1.2771250535708685 8.983800358760568 2.2218369504570754 13.628950429710773 C 3.1665488473432823 18.27410050066098 7.203435217276313 21.64490061955506 11.942604015206207 21.7457909287763 C 16.6817728131361 21.846681237997544 20.858456041691692 18.65073658678878 22 14.050000000000006 C 22.10309571247939 13.65941392177139 21.96106557407031 13.24515935141157 21.64 13 Z M 12.14 19.69 C 8.701293630528902 19.665736497294102 5.648789616671902 17.483173371915523 4.513682588723224 14.23712619910577 C 3.3785755607745465 10.991079026296017 4.405767818360107 7.381890943522873 7.079999999999998 5.219999999999999 L 7.08 5.49 C 7.085512443637961 11.087882444453111 11.62211755554688 15.624487556362036 17.21999999999999 15.63 C 17.925884289356596 15.632589341026572 18.629978385665446 15.558827102365646 19.32 15.410000000000002 C 17.913592464216382 18.070653034343096 15.149492115166662 19.733732910094464 12.14 19.73 Z"
            />
          </g>
        </svg>
        <img
          src={sunIcon}
          alt="Light Mode"
          className="swap-off h-6 w-6"
          style={{
            filter:
              'brightness(0) saturate(100%) invert(27%) sepia(18%) saturate(1156%) hue-rotate(329deg) brightness(94%) contrast(93%)',
          }}
        />
      </label>

      {/* CLERK AUTH CONTROLS */}
      <Header />

      {/* CONDITIONAL CONTENT WITH ROUTES */}
      <SignedOut>
        <div className="pt-16">
          <Welcome />
        </div>
      </SignedOut>
      <SignedIn>
        <ClusterProvider>
          {/* Create a fixed viewport container that accounts for header and nav */}
          <div className="fixed bottom-0 left-0 right-0 top-16 flex flex-col">
            {/* Scrollable content area that stops at navigation bar */}
            <div className="flex-1 overflow-y-auto pb-24">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/historical" element={<HistoricalData />} />
              </Routes>
            </div>
          </div>
          <NavigationBar />
        </ClusterProvider>
      </SignedIn>
    </div>
  );
};

export default App;

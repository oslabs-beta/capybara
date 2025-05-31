// ----------------------------------------------------------
// >> APP COMPONENT << //
// ----------------------------------------------------------
import { useEffect } from 'react';
import TestComponent from './components/TestComponent';
import Dashboard from './components/Dashboard';
import { Button } from './components/ui/button';

const App = () => {
  // ----------------------------------------------------------
  // ** SAVE THEME TO LOCAL STORAGE ** //
  // ----------------------------------------------------------
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // ----------------------------------------------------------
  // ** TOGGLE THEME ** //
  // ----------------------------------------------------------
  const toggleTheme = () => {
    const htmlClasses = document.documentElement.classList;
    if (htmlClasses.contains('dark')) {
      htmlClasses.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      htmlClasses.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  // ----------------------------------------------------------
  // >> COMPONENT RENDERING << //
  // ----------------------------------------------------------
  return (
    <div
      className="duration-800 scrollbar-hide transition-colors"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      <Button className="fixed right-4 top-4 z-50" onClick={toggleTheme}>
        Toggle Theme
      </Button>
      <TestComponent />
      <Dashboard />
    </div>
  );
};

export default App;

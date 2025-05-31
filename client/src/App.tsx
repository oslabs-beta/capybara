// ----------------------------------------------------------
// >> APP COMPONENT << //
// ----------------------------------------------------------
import { useEffect } from 'react';
import TestComponent from './components/TestComponent';
import Metrics from './components/Metrics';

const App = () => {
  // ** Saved Theme To Local Storage
  //  !! To be completed //
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  //  !! To be completed //

  // ----------------------------------------------------------
  // >> COMPONENT RENDERING << //
  // ----------------------------------------------------------
  return (
    <>
      <TestComponent />
      <Metrics />
    </>
  );
};

export default App;

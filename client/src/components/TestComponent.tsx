// ----------------------------------------------------------
// >> TEST COMPONENT << //
// ----------------------------------------------------------
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typewriter } from 'react-simple-typewriter';
import { Button } from '@/components/ui/button';

const TestComponent: React.FC = () => {
  // Add notification when frontend connects to server
  const [isConnected, setIsConnected] = useState(false);
  const [showTypewriter, setShowTypewriter] = useState(false);

  // ----------------------------------------------------------
  // * Show typewriter effect for second part of the text after initial delay
  // ----------------------------------------------------------
  useEffect(() => {
    const timer = setTimeout(() => setShowTypewriter(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // ----------------------------------------------------------
  // * Polling the server every 5 seconds to check if it's connected
  // ----------------------------------------------------------
  useEffect(() => {
    const connectedToServer = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/status`,
        );
        if (response.status === 200) {
          setIsConnected(true);
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error('Error connecting to server:', error);
      }
    };

    // Try to connect to server every 5 seconds (Render take ~23s to cold start)
    const intervalId = setInterval(connectedToServer, 5000);

    // cleanup function to clear the interval upon successful connection
    return () => clearInterval(intervalId);
  }, []);

  // ----------------------------------------------------------
  // * Theme toggle function
  // ----------------------------------------------------------
  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  // ----------------------------------------------------------
  // >> COMPONENT RENDERING << //
  // ----------------------------------------------------------
  return (
    <div
      className="duration-800 ml-32 grid h-screen grid-cols-2 items-center transition-colors"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      <div className="flex justify-end">
        <img src="/cofybara.png" alt="Cofybara" />
      </div>
      <div className="w-full justify-start">
        <p
          className="text-left text-9xl font-extrabold"
          style={{ color: 'var(--primary)' }}
        >
          hello
          {isConnected && (
            <span className="ml-2 inline-block h-4 w-4 rounded-full bg-pink-200"></span>
          )}
        </p>
        <p className="ml-1 text-left text-2xl">
          <Typewriter words={['Sit tight while my devs']} typeSpeed={70} />
          {showTypewriter && (
            <span
              className="ml-1 font-bold"
              style={{ color: 'var(--primary)' }}
            >
              <Typewriter
                words={[
                  'Wenjun,',
                  'Steven,',
                  '& Amit...',
                  'make some coffee!',
                  'work their magic!',
                  'invent new features!',
                  'finalize the code!',
                  'get ready to launch!',
                  'fix one more bug!',
                  'warm up the server!',
                  'perform final checks!',
                  'prepare for takeoff!',
                ]}
                cursor
                loop
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </span>
          )}
        </p>

        {/* Theme Toggle Button */}
        <Button onClick={toggleTheme}>Toggle Theme TEST</Button>

        {/* Example to test toggle button
        <div
          className="mt-4 rounded border p-4"
          style={{
            backgroundColor: 'var(--background)',
            color: 'var(--foreground)',
          }}
        ></div> */}
      </div>
    </div>
  );
};

export default TestComponent;

// ----------------------------------------------------------
// >> WELCOME PAGE << //
// ----------------------------------------------------------
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typewriter } from 'react-simple-typewriter';

const Welcome: React.FC = () => {
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
  // >> COMPONENT RENDERING << //
  // ----------------------------------------------------------
  return (
    <div
      className="duration-800 fixed inset-0 overflow-hidden px-4 py-8 transition-colors md:px-8 lg:px-16"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
        paddingTop: '5rem', // Account for header height
      }}
    >
      <div className="mx-auto h-full max-w-7xl">
        {/* Mobile Layout - Stacked */}
        <div className="flex h-full flex-col items-center justify-center gap-1 md:hidden">
          <div className="flex justify-center">
            <img
              src="/coffybara.png"
              alt="Coffybara"
              className="h-auto w-full max-w-xs"
            />
          </div>
          <div className="w-full px-4 text-center">
            <p
              className="mb-4 text-6xl font-extrabold sm:text-7xl"
              style={{ color: 'var(--primary)' }}
            >
              coffybara
              {isConnected && (
                <span className="ml-2 inline-block h-3 w-3 rounded-full bg-pink-200"></span>
              )}
            </p>
            <p className="text-md sm:text-lg">
              {showTypewriter && (
                <span
                  className="ml-1 mt-2 block font-bold"
                  style={{ color: 'var(--secondary)' }}
                >
                  <Typewriter
                    words={[
                      "We're here to keep your Kubernetes in check!",
                      'Real-time event detection? Check!',
                      'AI-powered insights? Double-check!',
                      'Slack notifications at your service!',
                      "Sit back and relax, we've got your back!",
                      'Trouble brewing? Not on our watch!',
                      "Let's keep those clusters healthy!",
                      "We've got the caffeine for your code!",
                      'Infrastructure hiccups? Not anymore!',
                      'Enjoy the peace of mind, your cluster is in good paws!',
                      'Your life, simplified by me!',
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
          </div>
        </div>

        {/* Desktop Layout - Side by Side */}
        <div className="hidden md:-mx-10 md:grid md:h-full md:grid-cols-2 md:items-center md:justify-center">
          <div className="flex justify-center lg:justify-end">
            <img
              src="/coffybara.png"
              alt="Coffybara"
              className="h-auto w-full max-w-md lg:max-w-lg xl:max-w-xl"
            />
          </div>
          <div className="flex w-full flex-col justify-center">
            <p
              className="mb-4 text-left text-6xl font-extrabold lg:text-8xl xl:text-9xl"
              style={{ color: 'var(--primary)' }}
            >
              coffybara
              {isConnected && (
                <span className="ml-2 inline-block h-4 w-4 rounded-full bg-pink-200"></span>
              )}
            </p>
            <p className="xxl:text-2xl text-md ml-1 text-left xl:text-xl">
              {showTypewriter && (
                <span
                  className="ml-1 font-bold"
                  style={{ color: 'var(--secondary)' }}
                >
                  <Typewriter
                    words={[
                      "We're here to keep your Kubernetes in check!",
                      'Real-time event detection? Check!',
                      'AI-powered insights? Double-check!',
                      'Slack notifications at your service!',
                      "Sit back and relax, we've got your back!",
                      'Trouble brewing? Not on our watch!',
                      "Let's keep those clusters healthy!",
                      "We've got the caffeine for your code!",
                      'Infrastructure hiccups? Not anymore!',
                      'Enjoy the peace of mind, your cluster is in good paws!',
                      'Your life, simplified by me!',
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

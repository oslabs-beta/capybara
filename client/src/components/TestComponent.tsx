// ----------------------------------------------------------
// >> TEST COMPONENT << //
// ----------------------------------------------------------
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typewriter } from "react-simple-typewriter";

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
        console.error("Error connecting to server:", error);
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
    <div className="ml-32 grid h-screen grid-cols-2 items-center">
      <div className="flex justify-end">
        <img src="/cofybara.png" alt="Cofybara" />
      </div>
      <div className="w-full justify-start">
        <p className="text-left text-9xl font-extrabold text-yellow-700">
          hello
          {isConnected && (
            <span className="ml-2 inline-block h-4 w-4 rounded-full bg-pink-200"></span>
          )}
        </p>
        <p className="ml-1 text-left text-2xl">
          <Typewriter words={["Sit tight while my devs"]} typeSpeed={70} />
          {showTypewriter && (
            <span className="ml-1 font-bold text-yellow-700">
              <Typewriter
                words={[
                  "Wenjun,",
                  "Steven,",
                  "& Amit...",
                  "make some coffee!",
                  "work their magic!",
                  "invent new features!",
                  "finalize the code!",
                  "get ready to launch!",
                  "fix one more bug!",
                  "warm up the server!",
                  "perform final checks!",
                  "prepare for takeoff!",
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
  );
};

export default TestComponent;

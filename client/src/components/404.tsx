// ----------------------------------------------------------
// >> 404 & HEARTBREAKS << //
// ----------------------------------------------------------
import { useState, useEffect } from 'react';

// Array of 404 images
const images404 = [
  '/coffybara404-0.png',
  '/coffybara404-1.png',
  '/coffybara404-2.png',
  '/coffybara404-3.png',
  '/coffybara404-4.png',
];

const FourOhFour = () => {
  const [randomImage, setRandomImage] = useState('');

  useEffect(() => {
    // Select random image when component mounts
    const randomIndex = Math.floor(Math.random() * images404.length);
    setRandomImage(images404[randomIndex]);
  }, []);

  return (
    <main
      className="flex h-screen w-full flex-col items-center justify-center"
      style={{
        backgroundColor: 'var(--background)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Large 404 Text with Overlaid Badge */}
      <div className="relative">
        <h1
          className="text-9xl font-extrabold tracking-widest"
          style={{ color: 'var(--foreground)' }}
        >
          404
        </h1>

        {/* Rotated Badge positioned over the "0" */}
        <div
          className="absolute left-1/2 top-2/3 -translate-x-1/2 rotate-12 transform rounded px-2 py-1 text-sm"
          style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
            zIndex: 10,
          }}
        >
          Page Not Found
        </div>
      </div>

      {/* Coffybara Image */}
      {randomImage && (
        <div className="mb-5 mt-8">
          <img
            src={randomImage}
            alt="Confused Coffybara"
            className="h-auto w-full max-w-xs sm:max-w-sm"
          />
        </div>
      )}

      {/* Description Text */}
      <p
        className="mx-auto mb-8 max-w-2xl px-4 text-center text-lg leading-relaxed sm:text-xl"
        style={{ color: 'var(--muted-foreground)' }}
      >
        Don't worry, even the best explorers sometimes take unexpected detours.
        Let's get you back to where you need to be.
      </p>

      {/* Dashboard Link */}
      <div className="mt-5">
        <a
          href="/dashboard"
          className="text-lg font-medium"
          style={{ color: 'var(--foreground)' }}
        >
          Dashboard
        </a>
      </div>
    </main>
  );
};

export default FourOhFour;

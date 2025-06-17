// ----------------------------------------------------------
// >> 404 & HEARTBREAKS << //
// ----------------------------------------------------------
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  useEffect(() => {
    // Select random image when component mounts
    const randomIndex = Math.floor(Math.random() * images404.length);
    setRandomImage(images404[randomIndex]);
  }, []);

  return (
    <main
      className="duration-800 flex w-full flex-col items-center justify-center px-4 py-4 transition-colors"
      style={{
        backgroundColor: 'var(--background)',
        fontFamily: 'var(--font-sans)',
        minHeight: 'calc(100vh - 64px - 120px)', // Account for header (64px) and navbar area (120px)
        height: 'calc(100vh - 64px - 120px)',
        maxHeight: 'calc(100vh - 64px - 120px)', // Ensure it never exceeds available space
      }}
    >
      {/* Large 404 Text with Overlaid Badge */}
      <div className="relative flex-shrink-0">
        <h1
          className="text-4xl font-extrabold tracking-widest sm:text-6xl md:text-8xl lg:text-9xl xl:text-[10rem]"
          style={{ color: 'var(--foreground)' }}
        >
          404
        </h1>

        {/* Rotated Badge positioned over the "0" */}
        <div
          className="absolute left-1/2 top-2/3 -translate-x-1/2 rotate-12 transform rounded px-2 py-1 text-xs whitespace-nowrap sm:text-sm md:text-base lg:text-lg"
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
        <div className="my-4 flex-shrink-0 sm:my-6">
          <img
            src={randomImage}
            alt="Confused Coffybara"
            className="h-auto w-full max-w-[200px] sm:max-w-[250px] md:max-w-xs lg:max-w-sm xl:max-w-md"
          />
        </div>
      )}

      {/* Description Text */}
      <p
        className="mx-auto mb-4 max-w-2xl text-center text-sm leading-relaxed sm:mb-6 sm:text-base md:text-lg lg:text-xl xl:text-2xl"
        style={{ color: 'var(--muted-foreground)' }}
      >
        Don't worry, even the best explorers sometimes take unexpected detours.
        Let's get you back to where you need to be.
      </p>

      {/* Dashboard Button */}
      <div className="flex-shrink-0">
        <Button 
          onClick={() => navigate('/')}
          size="lg"
          className="text-sm font-medium sm:text-base md:text-lg lg:text-xl px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4"
        >
          Go to Dashboard
        </Button>
      </div>
    </main>
  );
};

export default FourOhFour;

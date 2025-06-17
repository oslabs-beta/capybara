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
      className="flex h-screen w-full flex-col items-center justify-center"
      style={{
        backgroundColor: 'var(--background)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Large 404 Text with Overlaid Badge */}
      <div className="relative">
        <h1
          className="text-6xl font-extrabold tracking-widest sm:text-8xl md:text-9xl lg:text-[12rem] xl:text-[15rem]"
          style={{ color: 'var(--foreground)' }}
        >
          404
        </h1>

        {/* Rotated Badge positioned over the "0" */}
        <div
          className="absolute left-1/2 top-2/3 -translate-x-1/2 rotate-12 transform rounded px-2 py-1 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl"
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
            className="h-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
          />
        </div>
      )}

      {/* Description Text */}
      <p
        className="mx-auto mb-8 max-w-2xl px-4 text-center text-lg leading-relaxed sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
        style={{ color: 'var(--muted-foreground)' }}
      >
        Don't worry, even the best explorers sometimes take unexpected detours.
        Let's get you back to where you need to be.
      </p>

      {/* Dashboard Button */}
      <div className="mt-5">
        <Button 
          onClick={() => navigate('/')}
          size="lg"
          className="text-lg font-medium sm:text-xl md:text-2xl lg:text-3xl px-6 py-3 md:px-8 md:py-4 lg:px-10 lg:py-5"
        >
          Go to Dashboard
        </Button>
      </div>
    </main>
  );
};

export default FourOhFour;

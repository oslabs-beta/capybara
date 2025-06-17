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

const FourOhFour: React.FC = () => {
  const [randomImage, setRandomImage] = useState<string>('');

  useEffect(() => {
    // Select a random image when component mounts
    const randomIndex = Math.floor(Math.random() * images404.length);
    setRandomImage(images404[randomIndex]);
  }, []);

  return (
    <div 
      className="flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:px-6 md:px-8"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)'
      }}
    >
      <h1 
        className="mb-6 text-center text-2xl font-bold sm:mb-8 sm:text-3xl md:text-4xl lg:text-5xl"
        style={{
          color: 'var(--foreground)',
          fontFamily: 'var(--font-sans)'
        }}
      >
        404 - Oops, this is not what you were looking for.
      </h1>
      {randomImage && (
        <img
          src={randomImage}
          alt="Confused Coffybara"
          className="h-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
          style={{
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-lg)'
          }}
        />
      )}
      <p 
        className="mt-4 text-center text-base sm:mt-6 sm:text-lg md:text-xl"
        style={{
          color: 'var(--muted-foreground)',
          fontFamily: 'var(--font-sans)'
        }}
      >
        Even our capybara is confused! Let's get you back on track.
      </p>
    </div>
  );
};

export default FourOhFour;

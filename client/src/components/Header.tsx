// ----------------------------------------------------------
// >> HEADER << //
// ----------------------------------------------------------

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useUser,
} from '@clerk/clerk-react';
import React from 'react';

const Header: React.FC = () => {
  const { user } = useUser();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header
      className="duration-800 fixed left-0 right-0 top-0 z-50 flex items-center justify-start gap-4 px-4 py-4 transition-colors"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--primary)',
      }}
    >
      <SignedOut>
        <div
          className="flex gap-4 text-lg font-bold sm:text-xl"
          style={{
            color: 'var(--primary)',
          }}
        >
          <SignInButton
            mode="modal" // opens in popup
            afterSignInUrl="/" // redirect
            redirectUrl="/" // Optional redirect
          />{' '}
          /
          <SignUpButton
            mode="modal" // opens in popup
            afterSignUpUrl="/" // redirect
            redirectUrl="/" // Optional redirect
          />
        </div>
      </SignedOut>
      <SignedIn>
        <div
          className="text-3xl"
          style={{
            color: 'var(--primary)',
          }}
        >
          {getGreeting()},{' '}
          {user?.firstName ||
            user?.fullName ||
            user?.primaryEmailAddress?.emailAddress}
          !
        </div>
      </SignedIn>
    </header>
  );
};

export default Header;

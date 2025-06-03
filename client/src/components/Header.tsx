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

  return (
    <header className="flex items-center justify-start gap-4 px-4 py-4">
      <SignedOut>
        <SignInButton />
        <SignUpButton />
      </SignedOut>
      <SignedIn>
        <div className="text-xl font-bold">
          Welcome,{' '}
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

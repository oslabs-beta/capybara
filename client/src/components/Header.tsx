// ----------------------------------------------------------
// >> COMPACT HEADER << //
// ----------------------------------------------------------

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useUser,
  useClerk,
} from '@clerk/clerk-react';
import React from 'react';
import { IconMoon, IconSun } from '@tabler/icons-react';

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDark, toggleTheme }) => {
  const { user } = useUser();
  const { signOut } = useClerk();

  const getWhimsicalGreeting = (isMobile = false) => {
    const hour = new Date().getHours();
    const day = new Date().getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = day === 0 || day === 6;

    // Mobile versions (shorter)
    const mobileGreetings = {
      lateNight: [
        'Still up',
        'Night owl',
        'Burning the midnight oil',
        'Late shift',
      ],
      earlyMorning: [
        'Rise and grind',
        'Early bird',
        'Fresh brew time',
        'Dawn patrol',
      ],
      morning: ['Good morning', 'Coffee time', 'Ready to perk up', 'Morning'],
      lunch: [
        'Midday fuel up',
        'Lunch break',
        'Refill time',
        'Time to charge up,',
      ],
      afternoon: [
        'Good afternoon',
        'Post lunch mode',
        'Energy flowing',
        'Afternoon',
      ],
      evening: ['Good evening', 'Wind down time', 'Evening zen', 'Evening'],
      night: ['Late session', 'Night shift', 'Final check', 'Almost bedtime'],
    };

    // Desktop versions (longer, more whimsical)
    const desktopGreetings = {
      lateNight: [
        'Burning the midnight oil',
        'Still brewing something',
        'Night owl mode activated',
        'Late night cluster whispering',
        'The coffybara never sleeps',
      ],
      earlyMorning: [
        'Rise and grind',
        'Fresh brew incoming',
        'Morning cluster check',
        'Early bird gets the coffee',
        'Dawn patrol reporting',
      ],
      morning: [
        'Good morning',
        'Morning coffee ready',
        'Ready to caffeinate your code',
        'Morning monitoring maestro',
        'Time to perk up',
      ],
      lunch: [
        'Midday fuel up',
        'Lunch break monitoring',
        'Afternoon pick me up time',
        'Time to refill that cup',
        'Keeping things brewing',
      ],
      afternoon: [
        'Good afternoon',
        'Afternoon cluster check',
        'Post-lunch productivity',
        'Keeping the energy flowing',
        'Afternoon monitoring zen',
      ],
      evening: [
        'Good evening',
        'Winding down with monitoring',
        'Evening cluster zen',
        'Time to relax and monitor',
        'Smooth sailing this evening',
      ],
      night: [
        'Night shift activated',
        'Late night monitoring',
        'Almost time for bed',
        'Final cluster check',
        'Keeping watch tonight',
      ],
    };

    const greetings = isMobile ? mobileGreetings : desktopGreetings;

    // Weekend variations
    const weekendVariations = {
      morning: isWeekend
        ? isMobile
          ? ['Weekend vibes', 'Lazy Saturday', 'Sunday funday']
          : [
              'Weekend monitoring mode',
              'Lazy Saturday cluster check',
              'Sunday funday monitoring',
            ]
        : [],
      afternoon: isWeekend
        ? isMobile
          ? ['Weekend mode', 'Chill Saturday', 'Sunday relaxation']
          : [
              'Weekend afternoon vibes',
              'Saturday chill monitoring',
              'Sunday relaxation mode',
            ]
        : [],
      evening: isWeekend
        ? isMobile
          ? ['Weekend evening', 'Saturday night', 'Sunday night']
          : [
              'Saturday night monitoring',
              'Sunday evening wind down',
              'Weekend evening cluster zen',
            ]
        : [],
    };

    let timeBasedGreetings: string[] = [];

    if (hour >= 0 && hour < 5) {
      timeBasedGreetings = greetings.lateNight;
    } else if (hour >= 5 && hour < 9) {
      timeBasedGreetings = [
        ...greetings.earlyMorning,
        ...weekendVariations.morning,
      ];
    } else if (hour >= 9 && hour < 12) {
      timeBasedGreetings = [...greetings.morning, ...weekendVariations.morning];
    } else if (hour >= 12 && hour < 14) {
      timeBasedGreetings = greetings.lunch;
    } else if (hour >= 14 && hour < 18) {
      timeBasedGreetings = [
        ...greetings.afternoon,
        ...weekendVariations.afternoon,
      ];
    } else if (hour >= 18 && hour < 22) {
      timeBasedGreetings = isWeekend
        ? [...greetings.evening, ...weekendVariations.evening]
        : greetings.evening;
    } else {
      timeBasedGreetings = greetings.night;
    }

    // Create a stable key for this session and time period
    const sessionKey = `greeting_${isMobile ? 'mobile' : 'desktop'}_${hour >= 0 && hour < 5 ? 'lateNight' : hour >= 5 && hour < 9 ? 'earlyMorning' : hour >= 9 && hour < 12 ? 'morning' : hour >= 12 && hour < 14 ? 'lunch' : hour >= 14 && hour < 18 ? 'afternoon' : hour >= 18 && hour < 22 ? 'evening' : 'night'}`;

    // Check if we already have a greeting for this session and time period
    let randomGreeting = sessionStorage.getItem(sessionKey);

    if (!randomGreeting || !timeBasedGreetings.includes(randomGreeting)) {
      // Generate a new greeting and store it
      randomGreeting =
        timeBasedGreetings[
          Math.floor(Math.random() * timeBasedGreetings.length)
        ];
      sessionStorage.setItem(sessionKey, randomGreeting);
    }

    return randomGreeting;
  };

  const getDisplayName = () => {
    return (
      user?.firstName ||
      user?.fullName?.split(' ')[0] || // Just first name from full name
      user?.primaryEmailAddress?.emailAddress?.split('@')[0] || // Username from email
      'friend'
    ); // Fallback
  };

  return (
    <header
      className="duration-800 fixed left-0 right-0 top-0 z-50 flex items-center justify-between gap-4 px-4 pt-2 backdrop-blur-md transition-colors"
      style={{
        backgroundColor: 'transparent',
        color: 'var(--primary)',
      }}
    >
      <div className="main-content-wrapper">
        <div className="flex items-center justify-between py-1">
          {/* Left side content */}
          <div className="flex-1">
            <SignedOut>
              <div
                className="flex gap-4 text-base font-bold sm:text-lg"
                style={{
                  color: 'var(--primary)',
                }}
              >
                <SignInButton mode="modal" /> /
                <SignUpButton mode="modal" />
              </div>
            </SignedOut>
            <SignedIn>
              {/* Enhanced Responsive Greeting */}
              <div
                className="text-lg font-semibold italic sm:text-xl md:text-xl lg:text-2xl xl:text-2xl"
                style={{
                  color: 'var(--primary)',
                }}
              >
                {/* Mobile version - shorter greeting */}
                <span className="block sm:hidden">
                  {getWhimsicalGreeting(true)}, {getDisplayName()}!
                </span>
                {/* Desktop version - full greeting */}
                <span className="hidden sm:block">
                  {getWhimsicalGreeting(false)}, {getDisplayName()}!
                </span>
              </div>
            </SignedIn>
          </div>

          {/* Right side controls - Always present */}
          <div className="flex flex-shrink-0 items-center gap-6">
            {/* SIGN OUT BUTTON - Only visible when signed in */}
            <SignedIn>
              <button
                onClick={() =>
                  signOut(() => {
                    window.location.href = '/';
                  })
                }
                className="duration-800 text-muted-foreground flex justify-center text-sm font-semibold transition-colors hover:text-red-500/70 sm:text-lg"
                title="Sign Out"
              >
                logout
              </button>
            </SignedIn>

            {/* DARK MODE TOGGLE - Always visible */}
            <label className="swap swap-rotate cursor-pointer hover:[&_.swap-off]:text-amber-500 hover:[&_.swap-on]:text-yellow-200/90">
              <input
                type="checkbox"
                checked={isDark}
                onChange={toggleTheme}
                className="sr-only"
              />
              <IconMoon className="duration-800 text-muted-foreground swap-on transition-all" />
              <IconSun className="duration-800 text-muted-foreground swap-off transition-all" />
            </label>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

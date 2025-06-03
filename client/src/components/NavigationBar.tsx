// ----------------------------------------------------------
// >> NAVIGATION BAR << //
// ----------------------------------------------------------
import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  IconLayoutNavbarCollapse,
  IconLogout,
  IconSettings,
  IconUser,
  IconHome,
  IconAi,
  IconHistory,
  IconBellCheck,
  IconX,
} from '@tabler/icons-react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
} from 'motion/react';
import { useClerk, UserProfile } from '@clerk/clerk-react';

const NavigationBar: React.FC = () => {
  const { signOut } = useClerk();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const links = [
    {
      title: 'Home',
      icon: (
        <IconHome className="h-full w-full text-[var(--foreground-muted)] dark:text-[var(--foreground-muted-dark)]" />
      ),
      href: '/client/src/App.tsx',
    },
    {
      title: 'Historical Data',
      icon: (
        <IconHistory className="h-full w-full text-[var(--foreground-muted)] dark:text-[var(--foreground-muted-dark)]" />
      ),
      href: '#',
    },
    {
      title: 'AI Assistant',
      icon: (
        <IconAi className="h-full w-full text-[var(--foreground-muted)] dark:text-[var(--foreground-muted-dark)]" />
      ),
      href: '#',
    },
    {
      title: 'Notifications',
      icon: (
        <IconBellCheck className="h-full w-full text-[var(--foreground-muted)] dark:text-[var(--foreground-muted-dark)]" />
      ),
      href: '#',
    },
    {
      title: 'Profile',
      icon: (
        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="flex h-full w-full items-center justify-center"
        >
          <IconUser className="h-full w-full text-[var(--foreground-muted)] dark:text-[var(--foreground-muted-dark)]" />
        </button>
      ),
      href: '#',
      onClick: () => setIsProfileModalOpen(true),
    },
    {
      title: 'Settings',
      icon: (
        <IconSettings className="h-full w-full text-[var(--foreground-muted)] dark:text-[var(--foreground-muted-dark)]" />
      ),
      href: '#',
    },
    {
      title: 'Log Out',
      icon: (
        <button
          onClick={() => signOut(() => (window.location.href = '/'))}
          className="flex h-full w-full items-center justify-center"
        >
          <IconLogout className="h-full w-full text-[var(--foreground-muted)] dark:text-[var(--foreground-muted-dark)]" />
        </button>
      ),
      href: '#',
    },
  ];

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <FloatingDock
          items={links}
          desktopClassName="fixed bottom-4"
          mobileClassName="fixed bottom-4 right-4"
        />
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            onClick={() => setIsProfileModalOpen(false)}
          >
            {/* Background overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 max-h-[90vh] max-w-[90vw] overflow-auto rounded-2xl bg-[var(--background)] shadow-2xl dark:bg-[var(--background-dark)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="bg-[var(--background-muted)]/80 dark:bg-[var(--background-muted-dark)]/80 absolute right-4 top-4 z-20 rounded-full p-2 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--background-muted)] dark:text-[var(--foreground-muted-dark)] dark:hover:bg-[var(--background-muted-dark)]"
              >
                <IconX className="h-4 w-4" />
              </button>

              {/* UserProfile component */}
              <div className="p-6">
                <UserProfile />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavigationBar;

// FloatingDock Component

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: {
    title: string;
    icon: React.ReactNode;
    href: string;
    onClick?: () => void;
  }[];
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: {
    title: string;
    icon: React.ReactNode;
    href: string;
    onClick?: () => void;
  }[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn('relative z-50 block md:hidden', className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                {item.onClick ? (
                  <button
                    onClick={() => {
                      item.onClick?.();
                      setOpen(false);
                    }}
                    className="bg-[var(--background)]/80 dark:bg-[var(--background-dark)]/80 flex h-14 w-14 items-center justify-center rounded-full backdrop-blur-md"
                  >
                    <div className="h-7 w-7">{item.icon}</div>
                  </button>
                ) : (
                  <a
                    href={item.href}
                    key={item.title}
                    className="bg-[var(--background)]/80 dark:bg-[var(--background-dark)]/80 flex h-14 w-14 items-center justify-center rounded-full backdrop-blur-md"
                  >
                    <div className="h-7 w-7">{item.icon}</div>
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="bg-[var(--background)]/80 dark:bg-[var(--background-dark)]/80 flex h-14 w-14 items-center justify-center rounded-full backdrop-blur-md"
      >
        <IconLayoutNavbarCollapse className="h-7 w-7 text-[var(--foreground-muted)] dark:text-[var(--foreground-muted-dark)]" />
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: {
    title: string;
    icon: React.ReactNode;
    href: string;
    onClick?: () => void;
  }[];
  className?: string;
}) => {
  const mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        'bg-[var(--background)]/80 dark:bg-[var(--background-dark)]/80 z-50 mx-auto hidden h-20 items-end gap-4 rounded-2xl px-4 pb-3 backdrop-blur-md md:flex',
        className,
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  onClick,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Increased default sizes from [40, 80, 40] to [50, 90, 50]
  const widthTransform = useTransform(distance, [-150, 0, 150], [60, 100, 60]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [60, 100, 60]);
  // Increased icon sizes from [20, 40, 20] to [28, 50, 28]
  const widthTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [35, 60, 35],
  );
  const heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [35, 60, 35],
  );

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const Wrapper = onClick ? 'button' : 'a';

  return (
    <Wrapper
      href={onClick ? undefined : href}
      onClick={handleClick}
      className="block"
    >
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="bg-[var(--background-muted)]/50 dark:bg-[var(--background-muted-dark)]/50 relative flex aspect-square items-center justify-center rounded-full backdrop-blur-sm"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 2, x: '-50%' }}
              className="absolute -top-8 left-1/2 w-fit whitespace-pre rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-0.5 text-xs text-[var(--foreground)] dark:border-[var(--border-dark)] dark:bg-[var(--background-dark)] dark:text-[var(--foreground-dark)]"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
    </Wrapper>
  );
}

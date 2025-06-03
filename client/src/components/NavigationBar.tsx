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
} from '@tabler/icons-react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
} from 'motion/react';

const NavigationBar: React.FC = () => {
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
        <IconUser className="h-full w-full text-[var(--foreground-muted)] dark:text-[var(--foreground-muted-dark)]" />
      ),
      href: '#',
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
        <IconLogout className="h-full w-full text-[var(--foreground-muted)] dark:text-[var(--foreground-muted-dark)]" />
      ),
      href: 'https://github.com/oslabs-beta/capybara',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      <FloatingDock
        items={links}
        desktopClassName="fixed bottom-4"
        mobileClassName="fixed bottom-4 right-4"
      />
    </div>
  );
};

export default NavigationBar;

// FloatingDock Component

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
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
  items: { title: string; icon: React.ReactNode; href: string }[];
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
                <a
                  href={item.href}
                  key={item.title}
                  className="bg-[var(--background)]/80 dark:bg-[var(--background-dark)]/80 flex h-14 w-14 items-center justify-center rounded-full backdrop-blur-md"
                >
                  <div className="h-7 w-7">{item.icon}</div>
                </a>
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
  items: { title: string; icon: React.ReactNode; href: string }[];
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
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
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

  return (
    <a href={href}>
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
    </a>
  );
}

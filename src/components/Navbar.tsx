'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Menu, Search, X } from 'lucide-react';
import { Button } from './ui/button';
import { AppbarAuth } from './AppbarAuth';
import ThemeToggler from './ThemeToggler';
import ProfileDropdown from './profile-menu/ProfileDropdown';
import { SearchBar } from './search/SearchBar';

export const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  // Memoizing the toggleMenu and toggleSearch functions
  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);
  const toggleSearch = useCallback(() => setIsSearchOpen((prev) => !prev), []);

  // Memoizing the navItemVariants object
  const navItemVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: -20 },
      visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: i * 0.1,
          duration: 0.5,
          ease: [0.43, 0.13, 0.23, 0.96],
        },
      }),
    }),
    [],
  );

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          type: 'spring',
          damping: 10,
          stiffness: 100,
        }}
        className="fixed top-0 z-[999] w-full border-b border-primary/10 bg-background"
      >
        <div className="wrapper flex w-full items-center justify-between p-3">
          <motion.div
            className="flex items-center gap-4"
            initial="hidden"
            animate="visible"
            variants={navItemVariants}
            custom={0}
          >
            {session?.user && pathname !== '/home' && (
              <Button
                onClick={() => router.back()}
                variant={'ghost'}
                size={'icon'}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="size-6" />
              </Button>
            )}
            <Link href={'/'} className="flex items-center gap-2">
              <img
                src={
                  'https://appx-wsb-gcp.akamai.net.in/subject/2023-01-17-0.17044360120951185.jpg'
                }
                alt="100xDevs Logo"
                className="size-10 rounded-full"
              />
              <p
                className={`hidden bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-2xl font-black tracking-tighter text-transparent min-[410px]:block`}
              >
                100xDevs
              </p>
            </Link>
          </motion.div>

          <motion.div
            className="flex items-center gap-4"
            initial="hidden"
            animate="visible"
            variants={navItemVariants}
            custom={1}
          >
            {/* Search Bar */}
            {session?.user && (
              <>
                <div className="hidden md:block">
                  <SearchBar />
                </div>
                <div className="md:hidden">
                  <Button
                    onClick={toggleSearch}
                    variant={'ghost'}
                    size={'icon'}
                    className="mr-2"
                  >
                    <Search className="size-6" />
                  </Button>
                </div>
              </>
            )}

            <ThemeToggler />
            {session?.user && <ProfileDropdown />}

            {!session?.user && (
              <>
                <Button
                  onClick={toggleMenu}
                  variant={'ghost'}
                  size={'icon'}
                  className="md:hidden"
                >
                  <Menu className="size-6" />
                </Button>
                <div className="hidden items-center gap-2 md:flex">
                  <AppbarAuth />
                  <Button variant={'branding'}>
                    <Link
                      href={'https://harkirat.classx.co.in/new-courses'}
                      target="_blank"
                    >
                      Join now
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {!session?.user && isMenuOpen && (
            <motion.div
              className="bg-background p-4 md:hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <motion.div
                className="flex gap-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AppbarAuth />
                <Button variant={'branding'} className="w-full">
                  <Link
                    href={'https://harkirat.classx.co.in/new-courses'}
                    target="_blank"
                  >
                    Join now
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile search overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[1000] flex flex-col bg-background p-4 md:hidden"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Search</h2>

              <Button variant="ghost" size="icon" onClick={toggleSearch}>
                <X className="size-6" />
              </Button>
            </div>

            <SearchBar onCardClick={toggleSearch} isMobile />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

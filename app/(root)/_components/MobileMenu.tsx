'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MenuIcon } from 'lucide-react';
import { SignedOut, useUser } from '@clerk/nextjs';
import Logo from './Logo';
import { sidebarLinks } from '@/constants/navigation';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function MobileMenu() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="sm:hidden">
          <MenuIcon className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <Logo />
        <div className="flex h-full flex-col justify-between py-10">
          <div className="flex flex-col gap-y-1">
            {sidebarLinks.map((item) => {
              const isActive =
                (pathname.includes(item.route) && item.route.length > 1) || pathname === item.route;
              if (item.route === '/profile') {
                if (user?.username) {
                  item.route = `/profile/${user.username}`;
                } else {
                  return null;
                }
              }
              return (
                <SheetClose asChild key={item.route}>
                  <Link
                    href={item.route}
                    className={`text-dark300_light900 flex items-center gap-3 rounded-md p-4 text-sm opacity-75 ${
                      isActive && 'primary-gradient opacity-100'
                    }`}
                  >
                    <Image
                      src={item.imgURL}
                      alt={item.label}
                      width={20}
                      height={20}
                      className={`${isActive || 'invert-colors'}`}
                    />
                    <span className={`${isActive ? 'font-bold' : 'font-medium'}`}>
                      {item.label}
                    </span>
                  </Link>
                </SheetClose>
              );
            })}
          </div>
          <SignedOut>
            <div className="space-y-3">
              <SheetClose asChild>
                <Link
                  href="/sign-in"
                  className={cn(
                    buttonVariants(),
                    'btn-secondary small-medium w-full text-orange-500',
                  )}
                >
                  Login
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/sign-up"
                  className={cn(buttonVariants(), 'btn-tertiary text-dark400_light900 w-full')}
                >
                  Sign up
                </Link>
              </SheetClose>
            </div>
          </SignedOut>
        </div>
      </SheetContent>
    </Sheet>
  );
}

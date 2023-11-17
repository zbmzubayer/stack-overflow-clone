'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MenuIcon, Route } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { SignedOut } from '@clerk/nextjs';
import Logo from './Logo';
import { sidebarLinks } from '@/constants/navigation';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function MobileMenu() {
  const pathname = usePathname();

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
              const isActive = pathname === item.route;
              return (
                <Link
                  key={item.route}
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
                  <span className={`${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                </Link>
              );
            })}
          </div>
          <SignedOut>
            <div className="space-y-3">
              <Link
                href="/sign-in"
                className={cn(
                  buttonVariants(),
                  'btn-secondary small-medium w-full text-orange-500',
                )}
              >
                Login
              </Link>
              <Link
                href="/sign-up"
                className={cn(buttonVariants(), 'btn-tertiary text-dark400_light900 w-full')}
              >
                Sign up
              </Link>
            </div>
          </SignedOut>
        </div>
      </SheetContent>
    </Sheet>
  );
}

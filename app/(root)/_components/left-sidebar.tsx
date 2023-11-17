'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { sidebarLinks } from '@/constants/constants';
import { SignedOut } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { UserCircle, UserPlus } from 'lucide-react';

export default function LeftSidebar() {
  const pathname = usePathname();

  return (
    <aside className="background-light900_dark200 light-border sticky left-0 top-20 flex h-[calc(100vh-5rem)] flex-col border-r p-5 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[250px]">
      <div className="flex h-screen flex-col justify-between">
        <div className="flex flex-col gap-1">
          {sidebarLinks.map((item) => {
            const isActive = pathname === item.route;
            return (
              <Link
                key={item.route}
                href={item.route}
                className={`text-dark300_light900 flex items-center gap-3 rounded-md p-4 text-sm ${
                  isActive && 'primary-gradient'
                }`}
              >
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  width={20}
                  height={20}
                  className={`${isActive || 'invert-colors'}`}
                />
                <span className={`${isActive ? 'font-bold' : 'font-medium'} max-lg:hidden`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
        <SignedOut>
          <div className="flex flex-col gap-3">
            <Link
              href="/sign-in"
              className={cn(buttonVariants(), 'btn-secondary small-medium w-full text-orange-500')}
            >
              <UserCircle className="h-5 w-5 lg:hidden" />
              <span className="max-lg:hidden">Login</span>
            </Link>
            <Link
              href="/sign-up"
              className={cn(buttonVariants(), 'btn-tertiary text-dark400_light900 w-full')}
            >
              <UserPlus className="h-5 w-5 lg:hidden" />
              <span className="max-lg:hidden">Sign up</span>
            </Link>
          </div>
        </SignedOut>
      </div>
    </aside>
  );
}
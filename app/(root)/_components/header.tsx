import { SignedIn, UserButton } from '@clerk/nextjs';
import { ThemeToggle } from './theme-toggle';
import MobileMenu from './MobileMenu';
import Logo from './Logo';
import GlobalSearch from './global-search';
import MobileGlobalSearch from './mobile-global-search';

export default function Header() {
  return (
    <header className="flex-between background-light900_dark200 sticky top-0 z-50 h-20 w-full gap-5 px-6 shadow-light-300 dark:shadow-none sm:px-12">
      <Logo />
      <GlobalSearch />
      <div className="flex-between gap-5">
        <MobileGlobalSearch />
        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: { avatarBox: 'h-10 w-10' },
              variables: { colorPrimary: '#ff7000' },
            }}
          />
        </SignedIn>
        <ThemeToggle />
        <MobileMenu />
      </div>
    </header>
  );
}

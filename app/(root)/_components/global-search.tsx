'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SearchIcon } from 'lucide-react';
import { removeKeysUrlParams, setUrlParams } from '@/utils/queryString';
import GlobalSearchResult from './global-search-result';
import { Input } from '@/components/ui/input';

export default function GlobalSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get('global');
  const [search, setSearch] = useState(query || '');
  const [isOpen, setIsOpen] = useState(false);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (!isOpen) setIsOpen(true);
    if (e.target.value === '' && isOpen) setIsOpen(false);
  };

  // Close search result when click outside
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = (e: Event) => {
    if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    setIsOpen(false);
    setSearch('');
    return () => document.removeEventListener('click', handleClickOutside);
  }, [pathname]);

  // Update url when search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = setUrlParams({
          params: searchParams.toString(),
          key: 'global',
          value: search,
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (query) {
          const newUrl = removeKeysUrlParams({
            params: searchParams.toString(),
            keys: ['global', 'type'],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, query, router, searchParams, pathname]);

  return (
    <div className="relative w-full max-w-[600px] max-lg:hidden" ref={searchContainerRef}>
      <div className="background-light800_darkgradient flex grow items-center rounded-full border-2 px-4">
        <label htmlFor="search" className="cursor-pointer">
          <SearchIcon className="h-6 w-6 text-light-500" />
        </label>
        <Input
          type="text"
          id="search"
          placeholder="Search for anything..."
          value={search}
          className="border-none bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={handleOnChange}
        />
      </div>
      {isOpen && <GlobalSearchResult />}
    </div>
  );
}

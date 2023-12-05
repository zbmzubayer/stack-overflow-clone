'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { removeKeysUrlParams, setUrlParams } from '@/utils/queryString';

type LocalSearchProps = {
  route: string;
  icon: React.ReactNode;
  iconPosition: 'left' | 'right';
  placeholder: string;
  className?: string;
};

export default function LocalSearch({
  route,
  icon,
  iconPosition,
  placeholder,
  className,
  ...props
}: LocalSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get('q');
  const [search, setSearch] = useState(query || '');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = setUrlParams({ params: searchParams.toString(), key: 'q', value: search });
        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysUrlParams({ params: searchParams.toString(), keys: ['q'] });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, route, router, searchParams, pathname]);

  return (
    <div
      className={`background-light800_darkgradient flex items-center rounded-lg px-4 ${className}`}
      {...props}
    >
      {iconPosition === 'left' && (
        <label htmlFor="search" className="cursor-pointer text-light-500">
          {icon}
        </label>
      )}
      <Input
        type="text"
        id="search"
        placeholder={placeholder}
        value={search}
        className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        onChange={(e) => setSearch(e.target.value)}
      />
      {iconPosition === 'right' && (
        <label htmlFor="search" className="cursor-pointer text-light-500">
          {icon}
        </label>
      )}
    </div>
  );
}

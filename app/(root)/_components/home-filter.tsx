'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { HomePageFilters } from '@/constants/filters';
import { Button } from '@/components/ui/button';
import { removeKeysUrlParams, setUrlParams } from '@/utils/queryString';

export default function HomeFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [active, setActive] = useState('');

  const handleFilterClick = (filterValue: string) => {
    if (active === filterValue) {
      setActive('');
      const newUrl = setUrlParams({
        params: searchParams.toString(),
        key: 'filter',
        value: null,
      });
      router.push(newUrl, { scroll: false });
    } else {
      setActive(filterValue);
      const newUrl = setUrlParams({
        params: searchParams.toString(),
        key: 'filter',
        value: filterValue.toLowerCase(),
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((item) => (
        <Button
          key={item.value}
          className={`body-medium rounded-lg capitalize shadow-none ${
            active === item.value
              ? 'bg-brand-100 text-brand-500 hover:bg-brand-100 dark:bg-orange-200'
              : 'bg-light-800 text-light-500 hover:bg-light-700 dark:bg-dark-300 dark:hover:bg-dark-400'
          }`}
          onClick={() => handleFilterClick(item.value)}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
}

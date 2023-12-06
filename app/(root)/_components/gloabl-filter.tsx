'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { GlobalSearchFilters } from '@/constants/filters';
import { setUrlParams } from '@/utils/queryString';

export default function GlobalFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParams = searchParams.get('type');
  const [active, setActive] = useState(typeParams || '');

  const handleTypeClick = (type: string) => {
    if (active === type) {
      setActive('');
      const newUrl = setUrlParams({
        params: searchParams.toString(),
        key: 'type',
        value: null,
      });
      router.push(newUrl, { scroll: false });
    } else {
      setActive(type);
      const newUrl = setUrlParams({
        params: searchParams.toString(),
        key: 'type',
        value: type.toLowerCase(),
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="flex items-center gap-5 px-5">
      <p className="hidden text-sm font-medium sm:block">
        Type
        <ArrowRight className="ml-2 inline-block h-4 w-4" />
      </p>
      <div className="flex gap-3">
        {GlobalSearchFilters.map((item) => (
          <button
            key={item.value}
            className={`small-medium light-border-2 rounded-full px-4 py-2 sm:px-5 ${
              active === item.value
                ? 'bg-brand-500 text-light-800 dark:text-light-800 dark:hover:bg-orange-600'
                : 'bg-light-700 text-dark-400 hover:text-brand-500 dark:bg-dark-500 dark:text-light-500 dark:hover:text-brand-500'
            }`}
            onClick={() => handleTypeClick(item.value)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}

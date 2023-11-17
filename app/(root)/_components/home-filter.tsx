'use client';

import { Button } from '@/components/ui/button';
import { HomePageFilters } from '@/constants/filters';

export default function HomeFilter() {
  const active = 'newest';

  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((item) => (
        <Button
          key={item.value}
          className={`body-medium rounded-lg capitalize shadow-none ${
            active === item.value
              ? 'bg-brand-100 text-brand-500 hover:bg-light-700 dark:bg-orange-200'
              : 'bg-light-800 text-light-500 hover:bg-light-700 dark:bg-dark-300 dark:hover:bg-dark-400'
          }`}
          onClick={() => {}}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
}

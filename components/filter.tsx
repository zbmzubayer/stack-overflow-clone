'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { setUrlParams } from '@/utils/queryString';

interface FilterProps {
  filters: {
    name: string;
    value: string;
  }[];
  containerClass?: string;
  className?: string;
}

export default function Filter({ filters, containerClass, className }: FilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const filterParams = searchParams.get('filter');
  const handleFilerClick = (filterValue: string) => {
    const newUrl = setUrlParams({
      params: searchParams.toString(),
      key: 'filter',
      value: filterValue,
    });
    router.push(newUrl, { scroll: false });
  };
  return (
    <div className={containerClass}>
      <Select onValueChange={handleFilerClick} defaultValue={filterParams || undefined}>
        <SelectTrigger
          className={`background-light800_dark300 light-border text-dark500_light700 min-w-[150px] rounded-lg px-5 focus-visible:ring-0 focus-visible:ring-transparent sm:w-[200px] ${className}`}
        >
          <SelectValue placeholder="Select a filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filters.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { setUrlParams } from '@/utils/queryString';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  pageNumber: number;
  isNext: boolean;
}

export default function Pagination({ pageNumber, isNext }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePagination = (direction: string) => {
    const nextPageNumber = direction === 'prev' ? pageNumber - 1 : pageNumber + 1;
    const newUrl = setUrlParams({
      params: searchParams.toString(),
      key: 'page',
      value: nextPageNumber.toString(),
    });
    router.push(newUrl);
  };

  if (!isNext && pageNumber === 1) return null;

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <Button
        size="sm"
        disabled={pageNumber === 1}
        onClick={() => handlePagination('prev')}
        className="dark:bg-light-700"
      >
        Prev
      </Button>
      <div className="rounded-md bg-brand-500 px-3.5 py-2 text-sm font-semibold text-light-800">
        <p>{pageNumber}</p>
      </div>
      <Button
        size="sm"
        disabled={!isNext}
        onClick={() => handlePagination('next')}
        className="dark:bg-light-700"
      >
        Next
      </Button>
    </div>
  );
}

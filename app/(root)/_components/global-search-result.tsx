'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CornerUpLeftIcon, FileQuestionIcon, TagIcon, UserCircleIcon } from 'lucide-react';
import { ReloadIcon } from '@radix-ui/react-icons';
import GlobalFilter from './gloabl-filter';
import { globalSearch } from '@/actions/general.action';

export default function GlobalSearchResult() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<any>([]);

  const global = searchParams.get('global');
  const type = searchParams.get('type');

  useEffect(() => {
    const fetchSearchResult = async () => {
      setSearchResult([]);
      setIsLoading(true);
      try {
        const res = await globalSearch({ query: global, type });
        setSearchResult(JSON.parse(res));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (global) fetchSearchResult();
  }, [global, type]);

  const renderLink = (type: string, id: string) => {
    switch (type) {
      case 'question':
        return `/question/${id}`;
      case 'answer':
        return `/question/${id}`;
      case 'user':
        return `/profile/${id}`;
      case 'tag':
        return `/tags/${id}`;
      default:
        return '/';
    }
  };

  return (
    <div className="absolute mt-3 w-full rounded-xl bg-light-800 py-5 shadow-md dark:bg-dark-400">
      <GlobalFilter />
      <div className="my-5 h-[1px] bg-light-700/50 dark:bg-dark-500/50" />
      <div className="space-y-5">
        <p className="px-5 font-semibold text-dark-400 dark:text-light-800">Top Match</p>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <ReloadIcon className="my-2 h-10 w-10 animate-spin text-brand-500" />
            <p>Searching globally...</p>
          </div>
        ) : (
          <div>
            {searchResult.length > 0 ? (
              searchResult.map((item: any, index: number) => (
                <Link
                  key={item.type + item.id + index}
                  href={renderLink(item.type, item.id)}
                  className="flex w-full gap-2 px-5 py-2 hover:bg-light-700 dark:hover:bg-dark-500/50"
                >
                  {item.type === 'question' && <FileQuestionIcon className="mt-1.5 h-4 w-4" />}
                  {item.type === 'answer' && <CornerUpLeftIcon className="mt-1.5 h-4 w-4" />}
                  {item.type === 'user' && <UserCircleIcon className="mt-1.5 h-4 w-4" />}
                  {item.type === 'tag' && <TagIcon className="mt-1.5 h-4 w-4" />}
                  <div>
                    <p className="body-medium text-dark200_light800 line-clamp-1">{item.title}</p>
                    <p className="small-medium text-light400_light500 mt-1 font-bold capitalize">
                      {item.type}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="my-2.5 text-center font-medium">Oops! No results found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

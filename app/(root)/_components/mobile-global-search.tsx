'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  CornerUpLeftIcon,
  FileQuestionIcon,
  SearchIcon,
  TagIcon,
  UserCircleIcon,
} from 'lucide-react';
import { ReloadIcon } from '@radix-ui/react-icons';
import { globalSearch } from '@/actions/general.action';
import { removeKeysUrlParams, setUrlParams } from '@/utils/queryString';
import GlobalFilter from './gloabl-filter';
import { Button } from '@/components/ui/button';
import { CommandDialog, CommandInput } from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function MobileGlobalSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get('global');
  const [search, setSearch] = useState(query || '');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<any>([]);

  const global = searchParams.get('global');
  const type = searchParams.get('type');

  useEffect(() => {
    setIsOpen(false);
    setSearch('');
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
    <>
      <Button
        size="icon"
        onClick={() => setIsOpen(true)}
        className="rounded-xl bg-orange-100 text-brand-500 hover:bg-orange-200 dark:bg-orange-200 lg:hidden"
      >
        <SearchIcon className="h-5 w-5" />
      </Button>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput
          placeholder="Search for anything..."
          value={search}
          onValueChange={(value) => setSearch(value)}
        />
        <div className="mt-3">
          <GlobalFilter />
        </div>
        <ScrollArea className="h-[400px] p-4">
          <div className="my-2 h-[1px] bg-light-700/50 dark:bg-dark-500/50" />
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
                      className="flex w-full gap-2 rounded-md px-5 py-2 hover:bg-light-700 dark:hover:bg-dark-400"
                    >
                      {item.type === 'question' && <FileQuestionIcon className="mt-1.5 h-4 w-4" />}
                      {item.type === 'answer' && <CornerUpLeftIcon className="mt-1.5 h-4 w-4" />}
                      {item.type === 'user' && <UserCircleIcon className="mt-1.5 h-4 w-4" />}
                      {item.type === 'tag' && <TagIcon className="mt-1.5 h-4 w-4" />}
                      <div>
                        <p className="body-medium text-dark200_light800 line-clamp-1">
                          {item.title}
                        </p>
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
        </ScrollArea>
      </CommandDialog>
    </>
  );
}

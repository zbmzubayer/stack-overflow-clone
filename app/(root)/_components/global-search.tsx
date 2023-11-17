import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';

export default function GlobalSearch() {
  return (
    <div className="background-light800_darkgradient flex w-full max-w-[600px] grow items-center rounded-xl px-4 max-lg:hidden">
      <label htmlFor="search" className="cursor-pointer">
        <SearchIcon className="h-6 w-6 text-light-500" />
      </label>
      <Input
        type="text"
        id="search"
        placeholder="Search..."
        className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}

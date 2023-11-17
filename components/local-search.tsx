'use client';

import { LucideIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
        className=" border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        onChange={() => {}}
      />
      {iconPosition === 'right' && (
        <label htmlFor="search" className="cursor-pointer text-light-500">
          {icon}
        </label>
      )}
    </div>
  );
}

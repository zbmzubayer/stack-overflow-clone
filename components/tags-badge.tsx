import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const tagVariants = cva(
  'inline-flex items-center justify-center shadow gap-2 rounded-md font-medium uppercase',
  {
    variants: {
      variant: {
        default: 'background-light900_dark300 text-light400_light500',
        destructive: 'bg-destructive hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'px-5 py-2 text-[14px]',
        md: 'px-4 py-2 text-[12px]',
        sm: 'px-4 py-2 text-[10px]',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface TagProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tagVariants> {
  asChild?: boolean;
}

const TagBadge = React.forwardRef<HTMLDivElement, TagProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = 'div';
    return <Comp className={cn(tagVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
TagBadge.displayName = 'TagBadge';

export { TagBadge, tagVariants };

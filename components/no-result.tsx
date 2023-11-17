import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

interface Props {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export default function NoResult({ title, description, buttonText, buttonLink }: Props) {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image
        src="/assets/images/light-illustration.png"
        alt="No Result"
        width={270}
        height={200}
        className="object-contain dark:hidden"
      />
      <Image
        src="/assets/images/dark-illustration.png"
        alt="No Result"
        width={270}
        height={200}
        className="hidden object-contain dark:flex"
      />
      <h2 className="h2-bold text-dark200_light800 mt-8">{title}</h2>
      <p className="body-regular text-dark500_light700 my-4 max-w-md text-center">{description}</p>
      <Link
        href={buttonLink}
        className={cn(buttonVariants(), 'mt-5 bg-orange-500 text-light-800 hover:bg-orange-400')}
      >
        {buttonText}
      </Link>
    </div>
  );
}

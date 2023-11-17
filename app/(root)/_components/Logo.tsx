import Link from 'next/link';
import Image from 'next/image';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-1">
      <Image src="/assets/images/site-logo.svg" alt="DevFlow" width={23} height={23} />
      <p className="h2-bold font-spaceGrotesk max-sm:hidden">
        Dev
        <span className="text-orange-500">Overflow</span>
      </p>
    </Link>
  );
}

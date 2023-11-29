import { getTopInteractedTags } from '@/actions/tag.action';
import Image from 'next/image';
import Link from 'next/link';
import { TagBadge } from '../tags-badge';

export default async function UserCard({ user }: any) {
  const interactedTags = await getTopInteractedTags({ userId: user._id });
  return (
    <Link
      href={user.username}
      className="overflow-hidden rounded-2xl border bg-gray-100 shadow-md transition-all hover:shadow-lg dark:bg-dark-300"
    >
      <article className="shadow-light100_darknone item-center flex w-[250px] flex-col items-center justify-center p-8">
        <Image
          src={user.picture}
          alt={user.name}
          width={100}
          height={100}
          className="rounded-full"
        />
        <div className="mt-4 text-center">
          <h3 className="h3-bold line-clamp-1" title={user.name}>
            {user.name}
          </h3>
          <p className="mt-2 font-medium text-gray-500 dark:text-gray-400">@{user.username}</p>
          <div className="mt-5">
            {interactedTags?.length ? (
              <div className="flex items-center gap-2">
                {interactedTags.map((tag: any) => (
                  <TagBadge key={tag._id} size="sm" className="px-3">
                    {tag.name}
                  </TagBadge>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-gray-500 dark:text-gray-400">No tags yet</p>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

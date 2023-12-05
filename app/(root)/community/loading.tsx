import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  const users = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <>
      <h1 className="h1-bold">All Users</h1>
      <div className="flex gap-5">
        <Skeleton className="mt-10 h-10 flex-1" />
        <Skeleton className="mt-10 h-10 w-44" />
      </div>
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 min-[1700px]:grid-cols-4 min-[2200px]:grid-cols-5">
        {users.map((user) => (
          <Skeleton key={user} className="h-[260px] rounded-2xl" />
        ))}
      </div>
    </>
  );
}

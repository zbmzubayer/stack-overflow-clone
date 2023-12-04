import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  const questions = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <>
      <h1 className="h1-bold">All Questions</h1>
      <div className="flex gap-5">
        <Skeleton className="mt-10 h-10 flex-1" />
        <Skeleton className="mt-10 h-10 w-44" />
      </div>
      <div className="mt-10 flex gap-5">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="mt-10 flex flex-col gap-5">
        {questions.map((question) => (
          <Skeleton key={question} className="h-36" />
        ))}
      </div>
    </>
  );
}

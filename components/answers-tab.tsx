import { getUserAnswers } from '@/actions/user.action';
import AnswerCard from './cards/answer-card';
import { SearchParamsProps } from '@/types/props';
import Pagination from './pagination';

interface Props extends SearchParamsProps {
  userId: string;
}

export default async function AnswerTabs({ userId, searchParams }: Props) {
  const result = await getUserAnswers({ userId, page: Number(searchParams.page) || 1 });
  const { totalAnswers, userAnswers, isNext } = result;

  return (
    <>
      <div className="space-y-5">
        {userAnswers.map((answer) => (
          <AnswerCard key={answer._id} answer={answer} clerkId={answer.author.clerkId} />
        ))}
      </div>
      <Pagination pageNumber={Number(searchParams.page) || 1} isNext={isNext} />
    </>
  );
}

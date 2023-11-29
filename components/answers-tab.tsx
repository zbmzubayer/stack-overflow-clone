import { getUserAnswers } from '@/actions/user.action';
import AnswerCard from './cards/answer-card';

interface Props {
  searchParams: { q?: string };
  userId: string;
}

export default async function AnswerTabs({ searchParams, userId }: Props) {
  const result = await getUserAnswers({ userId, page: 1 });
  const { totalAnswers, userAnswers } = result;
  console.log(userAnswers);
  return (
    <div>
      {userAnswers.map((answer) => (
        <AnswerCard key={answer._id} answer={answer} />
      ))}
    </div>
  );
}

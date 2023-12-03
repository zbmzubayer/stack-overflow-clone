import { SearchParamsProps } from '@/types/props';
import { getUserQuestions } from '@/actions/user.action';
import QuestionCard from './cards/question-card';
import Pagination from './pagination';

interface Props extends SearchParamsProps {
  userId: string;
}

export default async function QuestionsTab({ userId, searchParams }: Props) {
  const result = await getUserQuestions({ userId, page: Number(searchParams.page) || 1 });
  const { totalQuestions, userQuestions, isNext } = result;
  return (
    <>
      <div className="space-y-5">
        {userQuestions.map((question) => (
          <QuestionCard question={question} key={question._id} clerkId={question.author.clerkId} />
        ))}
      </div>
      <Pagination pageNumber={Number(searchParams.page) || 1} isNext={isNext} />
    </>
  );
}

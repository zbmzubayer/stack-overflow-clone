import { getUserQuestions } from '@/actions/user.action';
import QuestionCard from './cards/question-card';

interface Props {
  searchParams: { q?: string };
  userId: string;
}

export default async function QuestionsTab({ searchParams, userId }: Props) {
  const result = await getUserQuestions({ userId, page: 1 });
  const { totalQuestions, userQuestions } = result;
  return (
    <div className="space-y-5">
      {userQuestions.map((question) => (
        <QuestionCard question={question} key={question._id} clerkId={question.author.clerkId} />
      ))}
    </div>
  );
}

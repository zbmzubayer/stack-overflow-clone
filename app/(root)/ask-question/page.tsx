import { auth } from '@clerk/nextjs';
import QuestionForm from '@/components/forms/question-form';

export default function AskQuestionPage() {
  const { userId } = auth();
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>
      <div className="mt-9">
        <QuestionForm type="Create" userId={userId!} />
      </div>
    </div>
  );
}

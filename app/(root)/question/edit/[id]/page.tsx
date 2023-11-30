import { auth } from '@clerk/nextjs';
import { getQuestionById } from '@/actions/question.action';
import QuestionForm from '@/components/forms/question-form';

export default async function EditQuestionPage({ params }: { params: { id: string } }) {
  const { userId } = auth();
  const question = await getQuestionById(params.id);

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div className="mt-9">
        <QuestionForm type="Edit" userId={userId!} questionDetails={JSON.stringify(question)} />
      </div>
    </>
  );
}

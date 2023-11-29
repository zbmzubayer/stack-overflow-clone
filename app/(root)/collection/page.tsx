import { SearchIcon } from 'lucide-react';
import Filter from '@/components/filter';
import { QuestionFilters } from '@/constants/filters';
import { savedQuestionNoResult } from '@/constants/no-result';
import LocalSearch from '@/components/local-search';
import QuestionCard from '@/components/cards/question-card';
import NoResult from '@/components/no-result';
import { getSavedQuestions } from '@/actions/user.action';
import { auth } from '@clerk/nextjs';

export default async function Home() {
  const { userId } = auth();
  const savedQuestions = await getSavedQuestions({ clerkId: userId! });

  return (
    <>
      <h1 className="h1-bold">Saved Questions</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/"
          icon={<SearchIcon />}
          iconPosition="left"
          placeholder="Search for questions"
          className="flex-1"
        />
        <Filter filters={QuestionFilters} />
      </div>
      <div className="mt-10 flex flex-col gap-5">
        {savedQuestions.length > 0 ? (
          savedQuestions.map((question: any) => (
            <QuestionCard key={question._id} question={question} clerkId={userId} />
          ))
        ) : (
          <NoResult
            title={savedQuestionNoResult.title}
            description={savedQuestionNoResult.description}
            buttonText={savedQuestionNoResult.buttonText}
            buttonLink={savedQuestionNoResult.buttonLink}
          />
        )}
      </div>
    </>
  );
}

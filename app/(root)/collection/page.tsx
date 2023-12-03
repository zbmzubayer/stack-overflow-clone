import { SearchIcon } from 'lucide-react';
import { auth } from '@clerk/nextjs';
import { SearchParamsProps } from '@/types/props';
import { QuestionFilters } from '@/constants/filters';
import { savedQuestionNoResult } from '@/constants/no-result';
import { getSavedQuestions } from '@/actions/user.action';
import LocalSearch from '@/components/local-search';
import Filter from '@/components/filter';
import NoResult from '@/components/no-result';
import QuestionCard from '@/components/cards/question-card';

export default async function CollectionPage({ searchParams }: SearchParamsProps) {
  const { userId } = auth();
  const savedQuestions = await getSavedQuestions({
    clerkId: userId!,
    searchQuery: searchParams.q,
    filter: searchParams.filter,
  });

  return (
    <>
      <h1 className="h1-bold">Saved Questions</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/collection"
          icon={<SearchIcon />}
          iconPosition="left"
          placeholder="Search in saved questions"
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

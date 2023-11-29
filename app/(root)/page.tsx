import Link from 'next/link';
import { SearchIcon } from 'lucide-react';
import Filter from '../../components/filter';
import HomeFilter from './_components/home-filter';
import { HomePageFilters } from '@/constants/filters';
import { questionNoResult } from '@/constants/no-result';
import LocalSearch from '@/components/local-search';
import QuestionCard from '@/components/cards/question-card';
import NoResult from '@/components/no-result';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { getAllQuestions } from '@/actions/question.action';
import { auth } from '@clerk/nextjs';

export default async function Home() {
  // const questions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const { userId } = auth();
  const questions = await getAllQuestions({});
  return (
    <>
      <div className="flex w-full items-center justify-between">
        <h1 className="h1-bold">All Questions</h1>
        <Link href="ask-question" className={cn(buttonVariants(), 'primary-gradient text-white')}>
          Ask a question
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/"
          icon={<SearchIcon />}
          iconPosition="left"
          placeholder="Search for questions"
          className="flex-1"
        />
        <Filter filters={HomePageFilters} containerClass="sm:min-w-[170px] md:hidden" />
      </div>
      <HomeFilter />
      <div className="mt-10 flex flex-col gap-5">
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard key={question._id} question={question} clerkId={userId!} />
          ))
        ) : (
          <NoResult
            title={questionNoResult.title}
            description={questionNoResult.description}
            buttonText={questionNoResult.buttonText}
            buttonLink={questionNoResult.buttonLink}
          />
        )}
      </div>
    </>
  );
}

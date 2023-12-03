import { SearchIcon } from 'lucide-react';
import { SearchParamsProps } from '@/types/props';
import { getQuestionsByTagId } from '@/actions/tag.action';
import { tagQuestionNoResult } from '@/constants/no-result';
import LocalSearch from '@/components/local-search';
import NoResult from '@/components/no-result';
import QuestionCard from '@/components/cards/question-card';
import Pagination from '@/components/pagination';

export default async function TagDetailsPage({ params, searchParams }: SearchParamsProps) {
  const tag = await getQuestionsByTagId({
    tagId: params.id,
    searchQuery: searchParams.q,
    page: Number(searchParams.page) || 1,
  });
  const { tagName, questions, isNext } = tag;

  return (
    <>
      <h1 className="h1-bold uppercase">{tagName}</h1>
      <div className="mt-11">
        <LocalSearch
          route={`/tags/${params.id}`}
          icon={<SearchIcon />}
          iconPosition="left"
          placeholder="Search tag questions"
          className="flex-1"
        />
      </div>
      <div className="mt-10 flex flex-col gap-5">
        {questions.length > 0 ? (
          questions.map((question: any) => <QuestionCard key={question._id} question={question} />)
        ) : (
          <NoResult
            title={tagQuestionNoResult.title}
            description={tagQuestionNoResult.description}
            buttonText={tagQuestionNoResult.buttonText}
            buttonLink={tagQuestionNoResult.buttonLink}
          />
        )}
      </div>
      <Pagination pageNumber={Number(searchParams.page) || 1} isNext={isNext} />
    </>
  );
}

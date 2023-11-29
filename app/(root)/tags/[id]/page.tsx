import { SearchIcon } from 'lucide-react';
import { getQuestionsByTagId } from '@/actions/tag.action';
import QuestionCard from '@/components/cards/question-card';
import LocalSearch from '@/components/local-search';
import NoResult from '@/components/no-result';
import { tagQuestionNoResult } from '@/constants/no-result';

interface Props {
  params: { id: string };
  searchParams: { q?: string };
}

export default async function TagDetailsPage({ params, searchParams }: Props) {
  const tag = await getQuestionsByTagId({ tagId: params.id, page: 1, searchQuery: searchParams.q });
  const { tagName, questions } = tag;

  return (
    <>
      <h1 className="h1-bold uppercase">{tagName}</h1>
      <div className="mt-11">
        <LocalSearch
          route="/"
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
    </>
  );
}

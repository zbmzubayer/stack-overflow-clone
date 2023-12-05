import { AnswerFilters } from '@/constants/filters';
import Filter from './filter';
import { getAllAnswers } from '@/actions/answer.action';
import Link from 'next/link';
import Image from 'next/image';
import getTimeStamp from '@/utils/getTimeStamp';
import ParseHTML from './parse-html';
import Votes from './votes';
import Pagination from './pagination';

interface Props {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page?: number;
  filter?: string;
}

export default async function AllAnswers({
  questionId,
  userId,
  totalAnswers,
  page,
  filter,
}: Props) {
  const result = await getAllAnswers({ questionId, page: page || 1, sortBy: filter });
  const { answers, isNext } = result;

  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>
        <Filter filters={AnswerFilters} />
      </div>
      <div>
        {answers.map((answer) => (
          <article key={answer._id} className="light-border border-b py-10">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
                <Link href={`/profile/${answer.author.clerkId}`} className="flex gap-2">
                  <Image
                    src={answer.author.picture}
                    alt="Author picture"
                    width={22}
                    height={22}
                    className="h-6 w-6 rounded-full"
                  />
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-end">
                    <p className="body-semibold text-dark300_light700">{answer.author.name}</p>
                    <p className="text-light400_light500 text-xs">
                      <span className="max-sm:hidden"> - </span>answered{' '}
                      {getTimeStamp(answer.createdAt)} ago
                    </p>
                  </div>
                </Link>
                <Votes
                  type="Answer"
                  itemId={answer._id.toString()}
                  userId={userId}
                  upvotes={answer.upvotes.length}
                  hasUpvoted={answer.upvotes.includes(userId)}
                  downvotes={answer.downvotes.length}
                  hasDownvoted={answer.downvotes.includes(userId)}
                />
              </div>
            </div>
            <ParseHTML content={answer.content} />
          </article>
        ))}
      </div>
      <Pagination pageNumber={Number(page) || 1} isNext={isNext} />
    </div>
  );
}

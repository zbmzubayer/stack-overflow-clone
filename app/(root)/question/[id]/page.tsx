import { Metadata, ResolvingMetadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Eye, MessageCircle } from 'lucide-react';
import { auth } from '@clerk/nextjs';
import { MetaDataProps, ParamsSearchProps } from '@/types/props';
import { getQuestionById } from '@/actions/question.action';
import { getUserById } from '@/actions/user.action';
import getFormatNumber from '@/utils/getFormatNumber';
import getTimeStamp from '@/utils/getTimeStamp';
import AllAnswers from '@/components/all-answers';
import AnswerForm from '@/components/forms/answer-form';
import ParseHTML from '@/components/parse-html';
import Votes from '@/components/votes';
import { TagBadge } from '@/components/tags-badge';

export async function generateMetadata(
  { params }: MetaDataProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const id = params.id;
  // fetch data
  const question = await getQuestionById(id);
  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: question.title,
    description: question.content,
    openGraph: {
      images: [...previousImages],
    },
  };
}

export default async function QuestionDetailPage({ params, searchParams }: ParamsSearchProps) {
  const question = await getQuestionById(params.id);
  const { title, content, views, upvotes, downvotes, createdAt, tags, answers, author } = question;
  const { userId } = auth();
  const mongoUser = await getUserById(userId!);
  // warning: mongodb objectId can not be passed as props from server component to client component
  const mongoUserId = mongoUser?.id;
  const questionId = question?.id;

  return (
    <>
      <div>
        <div className="flex flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
          <Link href={`profile/${author.clerkId}`} className="flex items-center gap-1">
            <Image
              src={author.picture}
              alt="Author picture"
              width={22}
              height={22}
              className="rounded-full"
            />
            <p className="paragraph-semibold">{author.name}</p>
          </Link>
          <Votes
            type="Question"
            itemId={questionId}
            userId={mongoUserId}
            upvotes={upvotes.length}
            hasUpvoted={question.upvotes.includes(mongoUserId)}
            downvotes={downvotes.length}
            hasDownvoted={question.downvotes.includes(mongoUserId)}
            hasSaved={mongoUser?.savedQuestions.includes(questionId)}
          />
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5">{title}</h2>
        <div className="small-medium mb-8 mt-5 flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            asked {getTimeStamp(createdAt)} ago
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            {getFormatNumber(answers.length)} {answers.length > 1 ? 'Answers' : 'Answer'}
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {getFormatNumber(views)} {views > 1 ? 'Views' : 'View'}
          </div>
        </div>
      </div>
      <ParseHTML content={content} />
      <div className="mt-8 flex flex-wrap items-center gap-2">
        {tags.map((tag: any) => (
          <TagBadge key={tag.id}>{tag.name}</TagBadge>
        ))}
      </div>
      <AllAnswers
        questionId={questionId}
        userId={mongoUserId}
        totalAnswers={question.answers.length}
        page={searchParams?.page}
        filter={searchParams?.filter}
      />
      <AnswerForm
        questionId={questionId}
        userId={mongoUserId}
        questionTitleContent={`${question.title}\n${question.content}`}
      />
    </>
  );
}

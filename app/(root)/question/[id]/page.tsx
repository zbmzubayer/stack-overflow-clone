import { getQuestionById } from '@/actions/question.action';
import { getUserById } from '@/actions/user.action';
import AllAnswers from '@/components/all-answers';
import AnswerForm from '@/components/forms/answer-form';
import ParseHTML from '@/components/parse-html';
import { TagBadge } from '@/components/tags-badge';
import Votes from '@/components/votes';
import getFormatNumber from '@/utils/getFormatNumber';
import getTimeStamp from '@/utils/getTimeStamp';
import { auth } from '@clerk/nextjs';
import { Clock, Eye, MessageCircle, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default async function QuestionDetailPage({ params }: { params: { id: string } }) {
  const question = await getQuestionById(params.id);
  const { title, content, views, upvotes, downvotes, createdAt, tags, answers, author } = question;
  const { userId } = auth();
  const mongoUser = await getUserById(userId!);
  // warning: mongodb objectId can not be passed as props from server component to client component
  const mongoUserId = mongoUser._id.toString();
  const questionId = question._id.toString();
  return (
    <>
      <div>
        <div className="flex flex-col-reverse justify-between sm:flex-row sm:items-center">
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
            hasSaved={mongoUser.savedQuestions.includes(questionId)}
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
      />
      <AnswerForm questionId={questionId} userId={mongoUserId} />
    </>
  );
}
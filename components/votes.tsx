'use client';

import { toast } from 'sonner';
import { downvoteAnswer, upvoteAnswer } from '@/actions/answer.action';
import { viewQuestion } from '@/actions/interaction.action';
import { downvoteQuestion, upvoteQuestion } from '@/actions/question.action';
import { toggleSaveQuestion } from '@/actions/user.action';
import getFormatNumber from '@/utils/getFormatNumber';
import { Star, ThumbsDown, ThumbsUp } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
  type: 'Question' | 'Answer';
  itemId: string;
  userId: string;
  upvotes: number;
  hasUpvoted: boolean;
  downvotes: number;
  hasDownvoted: boolean;
  hasSaved?: boolean;
}

export default function Votes({
  type,
  itemId,
  userId,
  upvotes,
  hasUpvoted,
  downvotes,
  hasDownvoted,
  hasSaved,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const handleSave = async () => {
    if (!userId) {
      return toast.error('You must be logged in to save question');
    }
    if (type === 'Question') {
      await toggleSaveQuestion({ questionId: itemId, userId, path: pathname });
      hasSaved
        ? toast.warning('Question is removed from your collection')
        : toast.success('Question is added to your collection');
    }
  };

  const handleVote = async (voteType: string) => {
    if (!userId) {
      return toast.error('You must be logged in to vote');
    }

    try {
      if (type === 'Question') {
        if (voteType === 'upvote') {
          await upvoteQuestion({
            questionId: itemId,
            userId,
            hasUpvoted,
            hasDownvoted,
            path: pathname,
          });
          hasUpvoted ? toast('Upvote removed') : toast.success('Upvoted successfully');
        } else {
          await downvoteQuestion({
            questionId: itemId,
            userId,
            hasUpvoted,
            hasDownvoted,
            path: pathname,
          });
          hasDownvoted ? toast('Downvote removed') : toast('Downvoted successfully');
        }
      } else if (type === 'Answer') {
        if (voteType === 'upvote') {
          await upvoteAnswer({
            answerId: itemId,
            userId,
            hasUpvoted,
            hasDownvoted,
            path: pathname,
          });
        } else {
          await downvoteAnswer({
            answerId: itemId,
            userId,
            hasUpvoted,
            hasDownvoted,
            path: pathname,
          });
        }
      }
      // TODO: toast
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  useEffect(() => {
    viewQuestion({ questionId: itemId, userId: userId ? userId : undefined });
  }, [itemId, userId, pathname, router]);

  return (
    <div>
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <ThumbsUp
            className={`h-4 w-4 cursor-pointer text-blue-500 transition-all hover:scale-110 ${
              hasUpvoted && 'fill-blue-500'
            }`}
            onClick={() => handleVote('upvote')}
          />
          <p className="background-light700_dark400 rounded-sm px-2 py-1 text-[11px] font-medium">
            {getFormatNumber(upvotes)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ThumbsDown
            className={`h-4 w-4 cursor-pointer text-red-500 transition-all hover:scale-110 ${
              hasDownvoted && 'fill-red-500'
            }`}
            onClick={() => handleVote('downvote')}
          />
          <p className="background-light700_dark400 rounded-sm px-2 py-1 text-[11px] font-medium">
            {getFormatNumber(downvotes)}
          </p>
        </div>
        {type === 'Question' && (
          <div>
            <Star
              className={`h-4 w-4 cursor-pointer text-brand-500 transition-all hover:scale-110 ${
                hasSaved && 'fill-brand-500'
              }`}
              onClick={handleSave}
            />
          </div>
        )}
      </div>
    </div>
  );
}

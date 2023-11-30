import Link from 'next/link';
import Image from 'next/image';
import { Eye, MessageCircle, ThumbsUp, Trash } from 'lucide-react';
import { tagVariants } from '../tags-badge';
import getTimeStamp from '@/utils/getTimeStamp';
import getFormatNumber from '@/utils/getFormatNumber';
import { SignedIn } from '@clerk/nextjs';
import EditDeleteAction from '../edit-delete-action';

interface Props {
  answer: any;
  clerkId?: string | null;
}

export default function AnswerCard({ answer, clerkId }: Props) {
  const { id, upvotes, author, question, createdAt } = answer;
  const showActionButtons = clerkId && clerkId === author.clerkId;

  return (
    <div className="card-wrapper rounded-lg p-9 sm:px-11">
      <div className="flex flex-col">
        <p className="subtle-regular text-dark400_light700 lg:hidden">
          {getTimeStamp(createdAt)} ago
        </p>
        <div className="flex items-center justify-between">
          <Link href={`/question/${question._id}`}>
            <h3 className="h3-semibold text-dark200_light900 line-clamp-1">{question.title}</h3>
          </Link>
          <SignedIn>{showActionButtons && <EditDeleteAction type="Answer" itemId={id} />}</SignedIn>
        </div>
      </div>
      <div>
        <hr className="mt-2" />
        <div className="small-medium mt-2 flex justify-between gap-3 text-slate-400 max-md:flex-col">
          <div className="flex items-center gap-1">
            <Link href={author.username} className="flex items-center gap-2">
              <Image
                src={author.picture}
                alt={author.name}
                width={25}
                height={25}
                className="h-5 w-5 rounded-full"
              />
              <p className="text-[13px] hover:underline">{author.name}</p>
            </Link>
            <p className="subtle-regular text-dark400_light700 hidden lg:flex">
              - asked {getTimeStamp(createdAt)} ago
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-3.5 w-3.5 stroke-blue-500" />
              {getFormatNumber(upvotes.length)} {upvotes.length > 1 ? 'Votes' : 'Vote'}
            </div>
          </div>
        </div>
        <hr className="mt-2" />
      </div>
    </div>
  );
}

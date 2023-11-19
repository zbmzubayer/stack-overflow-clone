import { cn } from '@/lib/utils';
import Link from 'next/link';
import { tagVariants } from './tags-badge';
import { Eye, MessageCircle, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import getTimeStamp from '@/utils/getTimeStamp';
import getFormatNumber from '@/utils/getFormatNumber';

interface QuestionCardProps {
  _id: string;
  title: string;
  tags: { _id: string; name: string }[];
  views: number;
  upvotes: number;
  downvotes: number;
  author: { id: string; name: string; avatar: string };
  answers: Array<object>;
  createdAt: Date;
}

export default function QuestionCard({ question }: { question: any }) {
  const { title, tags, views, upvotes, downvotes, author, answers, createdAt } = question;

  return (
    <div className="card-wrapper rounded-lg p-9 sm:px-11">
      <div className="flex flex-col">
        <p className="subtle-regular text-dark400_light700 lg:hidden">
          {getTimeStamp(createdAt)} ago
        </p>
        <Link href={`/question/${question._id}`}>
          <h3 className="h3-semibold text-dark200_light900 line-clamp-1">{title}</h3>
        </Link>
      </div>
      <div className="mt-2 flex gap-3">
        {tags.map((tag: any) => (
          <Link href={`/tag/${tag._id}`} key={tag._id} className={cn(tagVariants({ size: 'sm' }))}>
            {tag.name}
          </Link>
        ))}
      </div>
      <div className="">
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
              <ThumbsUp className="h-3.5 w-3.5 stroke-blue-500 hover:scale-105" />
              {getFormatNumber(upvotes.length)} {upvotes.length > 1 ? 'Votes' : 'Vote'}
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5 stroke-foreground hover:scale-105" />
              {getFormatNumber(answers.length)} {answers.length > 1 ? 'Answers' : 'Answer'}
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5 stroke-slate-500 hover:scale-105" />
              {getFormatNumber(views)} {views > 1 ? 'Views' : 'View'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

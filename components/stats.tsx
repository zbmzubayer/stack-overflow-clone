import { BadgeCounts } from '@/utils/assignBadge';
import getFormatNumber from '@/utils/getFormatNumber';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircleIcon } from 'lucide-react';

interface StatsCardProps {
  imgUrl: string;
  value: number;
  title: string;
}

const StatsCard = ({ imgUrl, value, title }: StatsCardProps) => {
  return (
    <div className="light-border flex items-center justify-start gap-4 rounded-md border bg-zinc-100 p-6 shadow-light-300 dark:bg-dark-300 dark:shadow-dark-200">
      <Image src={imgUrl} alt={title} width={40} height={50} />
      <div>
        <p className="text-dark200_light900 paragraph-semibold">{value}</p>
        <p className="body-medium text-dark400_light700">{title}</p>
      </div>
    </div>
  );
};

const ReputationToolTip = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircleIcon className="mb-0.5 h-4 w-4 cursor-pointer" />
        </TooltipTrigger>
        <TooltipContent className="px-7 py-3">
          <ul className="list-disc text-xs font-medium">
            <li>Get 1 point for upvoting a question</li>
            <li>Get 10 points for getting upvote to your posted question</li>
            <li>Lose 10 points for getting downvote to your posted question</li>
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface Props {
  totalQuestions: number;
  totalAnswers: number;
  reputation: number;
  badges: BadgeCounts;
}

export default function Stats({ totalQuestions, totalAnswers, reputation, badges }: Props) {
  return (
    <div className="mt-7">
      <h4 className="h3-semibold text-dark200_light900">Stats</h4>

      <div className="flex items-end gap-2">
        <ReputationToolTip />
        <p className="mt-1 text-sm font-medium">Reputation</p>

        <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-brand-500">
          {getFormatNumber(reputation)}
        </span>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
        <div className="light-border flex items-center justify-evenly gap-4 rounded-md border bg-zinc-100 p-6 shadow-light-300 dark:bg-dark-300 dark:shadow-dark-200">
          <div className="">
            <p className="text-dark200_light900 paragraph-semibold">
              {getFormatNumber(totalQuestions)}
            </p>
            <p className="body-medium text-dark400_light700">Questions</p>
          </div>
          <div>
            <p className="text-dark200_light900 paragraph-semibold">
              {getFormatNumber(totalAnswers)}
            </p>
            <p className="body-medium text-dark400_light700">Answers</p>
          </div>
        </div>
        <StatsCard imgUrl="/assets/icons/gold-medal.svg" value={badges.GOLD} title="Gold Badges" />
        <StatsCard
          imgUrl="/assets/icons/silver-medal.svg"
          value={badges.SILVER}
          title="Silver Badges"
        />
        <StatsCard
          imgUrl="/assets/icons/bronze-medal.svg"
          value={badges.BRONZE}
          title="Bronze Badges"
        />
      </div>
    </div>
  );
}

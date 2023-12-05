import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarDaysIcon, LinkIcon, MapPinIcon } from 'lucide-react';
import { SignedIn, auth } from '@clerk/nextjs';
import { MetaDataProps, ParamsSearchProps } from '@/types/props';
import { getUserInfo } from '@/actions/user.action';
import getJoinedDate from '@/utils/getJoinedDate';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Stats from '@/components/stats';
import QuestionsTab from '@/components/questions-tab';
import AnswerTabs from '@/components/answers-tab';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export async function generateMetadata(
  { params }: MetaDataProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const id = params.id;

  // fetch data
  const userInfo = await getUserInfo(id);
  const { user } = userInfo;

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `Dev Overflow | ${user?.username}`,
    description: user.name,
    openGraph: {
      images: [user.picture, ...previousImages],
    },
  };
}

export default async function Profile({ params, searchParams }: ParamsSearchProps) {
  const { userId: clerkId } = auth();
  const userInfo = await getUserInfo(params?.id!);
  const { user, totalQuestions, totalAnswers, badgeCounts } = userInfo;

  return (
    <>
      <div className="flex justify-between">
        <div>
          <Image
            src={user.picture}
            alt={user.name}
            width={150}
            height={150}
            className="rounded-lg"
          />
          <div className="mt-3">
            <h2 className="h2-bold">{user.name}</h2>
            <p className="font-medium text-slate-600 dark:text-slate-400">@{user.username}</p>
          </div>

          <div className="mt-5 flex items-center gap-5">
            {user.location && (
              <div>
                <a href={user?.portfolio} className="flex items-center">
                  <LinkIcon className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="text-accent-blue">Portfolio</span>
                </a>
              </div>
            )}
            {user.location && (
              <div className="flex items-center">
                <MapPinIcon className="mr-2 h-4 w-4 text-gray-500" />
                {user?.location}
              </div>
            )}
            <div className="flex items-center">
              <CalendarDaysIcon className="mr-2 h-4 w-4 text-gray-500" /> Joined{' '}
              {getJoinedDate(user.createdAt)}
            </div>
          </div>
          {user.bio && <p className="paragraph-regular text-dark400_light800 mt-8">{user?.bio}</p>}
        </div>

        <div>
          <SignedIn>
            {clerkId === user.clerkId && (
              <Link
                href="/profile/edit"
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'paragraph-medium text-dark300_light700 border-2 transition-all hover:text-orange-500 sm:w-[200px]',
                )}
              >
                Edit profile
              </Link>
            )}
          </SignedIn>
        </div>
      </div>
      <Stats
        totalQuestions={totalQuestions}
        totalAnswers={totalAnswers}
        reputation={user.reputation}
        badges={badgeCounts}
      />
      <div>
        <Tabs defaultValue="top-posts" className="mt-10">
          <TabsList className="mb-2">
            <TabsTrigger
              value="top-posts"
              className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-500"
            >
              Top Posts
            </TabsTrigger>
            <TabsTrigger
              value="answers"
              className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-500"
            >
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts">
            <QuestionsTab userId={user._id} searchParams={searchParams} />
          </TabsContent>
          <TabsContent value="answers">
            <AnswerTabs userId={user._id} searchParams={searchParams} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

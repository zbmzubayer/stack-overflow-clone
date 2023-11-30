import Link from 'next/link';
import Image from 'next/image';
import { SignedIn, auth } from '@clerk/nextjs';
import { getUserInfo } from '@/actions/user.action';
import getJoinedDate from '@/utils/getJoinedDate';
import { buttonVariants } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Stats from '@/components/stats';
import QuestionsTab from '@/components/questions-tab';
import { cn } from '@/lib/utils';
import AnswerTabs from '@/components/answers-tab';

interface Props {
  params: { id: string };
  searchParams: { q?: string };
}

export default async function Profile({ params, searchParams }: Props) {
  const { userId: clerkId } = auth();
  const userInfo = await getUserInfo(params.id);
  const { user, totalQuestions, totalAnswers } = userInfo;
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

          <div className="mt-5">
            {user.location && <div>location</div>}
            Joined {getJoinedDate(user.createdAt)}
          </div>
          {user.bio && <p className="paragraph-regular text-dark400_light800 mt-8">bio</p>}
        </div>

        <div>
          <SignedIn>
            {clerkId === user.clerkId && (
              <Link
                href="/profile/edit"
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'paragraph-medium text-dark300_light700 border-2 transition-all hover:border-orange-500 hover:bg-orange-50 hover:text-orange-500 sm:w-[200px]',
                )}
              >
                Edit profile
              </Link>
            )}
          </SignedIn>
        </div>
      </div>
      <Stats totalQuestions={totalQuestions} totalAnswers={totalAnswers} />
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

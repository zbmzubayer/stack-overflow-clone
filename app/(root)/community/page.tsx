import { Metadata } from 'next';
import Link from 'next/link';
import { SearchIcon } from 'lucide-react';
import Filter from '../../../components/filter';
import { UserFilters } from '@/constants/filters';
import { getAllUsers } from '@/actions/user.action';
import LocalSearch from '@/components/local-search';
import UserCard from '@/components/cards/user-card';
import { SearchParamsProps } from '@/types/props';
import Pagination from '@/components/pagination';

export const metadata: Metadata = {
  title: 'Dev Overflow | Community',
  description:
    'Dev Overflow is a community of developers, where you can ask questions and receive answers from other members of the community.',
};

export default async function CommunityPage({ searchParams }: SearchParamsProps) {
  const result = await getAllUsers({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: Number(searchParams.page) || 1,
  });
  const { users, isNext } = result;

  return (
    <>
      <h1 className="h1-bold">All Users</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/community"
          icon={<SearchIcon />}
          iconPosition="left"
          placeholder="Search for amazing minds"
          className="flex-1"
        />
        <Filter filters={UserFilters} />
      </div>
      <section className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 min-[1700px]:grid-cols-4 min-[2200px]:grid-cols-5">
        {users.length > 0 ? (
          users.map((user) => <UserCard key={user._id} user={user} />)
        ) : (
          <div className="paragraph-regular mx-auto max-w-4xl text-center">
            <p className="text-2xl font-semibold">No users yet</p>
            <Link href="sign-up" className="font-bold text-accent-blue">
              Join now to be the first!
            </Link>
          </div>
        )}
      </section>
      <Pagination pageNumber={Number(searchParams.page) || 1} isNext={isNext} />
    </>
  );
}

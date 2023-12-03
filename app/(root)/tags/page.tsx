import Link from 'next/link';
import { SearchIcon } from 'lucide-react';
import { SearchParamsProps } from '@/types/props';
import { TagFilters } from '@/constants/filters';
import { tagNoResult } from '@/constants/no-result';
import { getAllTags } from '@/actions/tag.action';
import LocalSearch from '@/components/local-search';
import Filter from '@/components/filter';
import NoResult from '@/components/no-result';
import { tagVariants } from '@/components/tags-badge';
import { cn } from '@/lib/utils';

export default async function TagsPage({ searchParams }: SearchParamsProps) {
  const tags = await getAllTags({ searchQuery: searchParams.q, filter: searchParams.filter });

  return (
    <>
      <h1 className="h1-bold">All Tags</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/tags"
          icon={<SearchIcon />}
          iconPosition="left"
          placeholder="Search for tags"
          className="flex-1"
        />
        <Filter filters={TagFilters} />
      </div>
      <section className="mt-12 grid gap-4 md:grid-cols-2">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <Link href={`tags/${tag._id}`} key={tag._id} className="">
              <article className="bg-gray-100 p-5 dark:bg-dark-200">
                <div>
                  <p className={cn(tagVariants(), 'background-light700_dark300 font-semibold')}>
                    {tag.name}
                  </p>
                </div>
                <p className="text-dark400_light500 text-sm">
                  <span className="primary-text-gradient mr-2 font-semibold">
                    {tag.questions.length}+
                  </span>
                  Questions
                </p>
              </article>
            </Link>
          ))
        ) : (
          <NoResult
            title={tagNoResult.title}
            description={tagNoResult.description}
            buttonText={tagNoResult.buttonText}
            buttonLink={tagNoResult.buttonLink}
          />
        )}
      </section>
    </>
  );
}

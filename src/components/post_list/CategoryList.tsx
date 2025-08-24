'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { CategoryButton } from './CategoryButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CategoryDetail } from '@/config/types';

interface CategoryListProps {
  categoryList: CategoryDetail[];
  allPostCount: number;
  currentCategory?: string;
}

const CategoryList = ({
  categoryList,
  allPostCount,
  currentCategory = 'all',
}: CategoryListProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');
    if (value === 'all') {
      router.push(`/?${params.toString()}`);
    } else {
      router.push(`/category/${value}?${params.toString()}`);
    }
  };

  return (
    <>
      <section className='mb-10 hidden sm:block'>
        <ul className='flex gap-3'>
          <CategoryButton
            href='/'
            isCurrent={currentCategory === 'all'}
            displayName='All'
            count={allPostCount}
          />
          {categoryList.map((cg) => (
            <CategoryButton
              key={cg.dirName}
              href={`/category/${cg.dirName}`}
              displayName={cg.publicName}
              isCurrent={cg.dirName === currentCategory}
              count={cg.count}
            />
          ))}
        </ul>
      </section>
      <section className='mb-10 sm:hidden'>
        <Select onValueChange={onCategoryChange} defaultValue={currentCategory}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Theme' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All ({allPostCount})</SelectItem>
            {categoryList.map((cg) => (
              <SelectItem key={cg.dirName} value={cg.dirName}>
                {cg.publicName} ({cg.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>
    </>
  );
};

export default CategoryList;

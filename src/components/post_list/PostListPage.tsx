import CategoryList from './CategoryList';
import { getAllPostCount, getCategoryDetailList } from '@/lib/post';
import TagFilter from './TagFilter';
import PostListClient from './PostListClient';

interface PostListProps {
  category?: string;
  page?: number;
  pageSize?: number;
  tag?: string;
  q?: string;
}

const PostListPage = async ({ category, page = 1, pageSize = 12, tag, q }: PostListProps) => {
  const categoryList = await getCategoryDetailList();
  const allPostCount = await getAllPostCount();

  return (
    <section className='mx-auto mt-12 w-full max-w-4xl px-4 lg:px-8'>
      <CategoryList
        allPostCount={allPostCount}
        categoryList={categoryList}
        currentCategory={category}
      />
      <section>
        <form action='/' className='mb-6 flex gap-2'>
          <input
            name='q'
            defaultValue={q}
            placeholder='검색어를 입력하세요'
            className='w-full rounded-md border px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-slate-700'
          />
          {category ? <input type='hidden' name='category' value={category} /> : null}
          {tag ? <input type='hidden' name='tag' value={tag} /> : null}
          <button
            className='inline-flex items-center justify-center whitespace-nowrap rounded-md border px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-800'
          >
            검색
          </button>
        </form>
        <TagFilter currentTag={tag} category={category} />
        <PostListClient category={category} />
      </section>
    </section>
  );
};

export default PostListPage;

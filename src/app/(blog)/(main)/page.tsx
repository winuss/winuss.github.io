import PostListPage from '@/components/post_list/PostListPage';
import { redirect } from 'next/navigation';

type Props = {
  searchParams?: { page?: string; tag?: string; q?: string };
};

export const dynamic = 'force-static';

const Blog = async ({ searchParams }: Props) => {
  const page = Number(searchParams?.page || '1');
  const tag = searchParams?.tag;
  const q = searchParams?.q;
  if (Number.isNaN(page) || page < 1) redirect('/');
  return <PostListPage page={page} tag={tag} q={q} />;
};

export default Blog;

import { Metadata } from 'next';

import PostListPage from '@/components/post_list/PostListPage';
import { baseDomain, blogName, blogThumbnailURL } from '@/config/const';
import { getCategoryList, getCategoryPublicName } from '@/lib/post';

type Props = {
  params: { category: string };
  searchParams?: { page?: string; tag?: string; q?: string };
};

// 허용된 param 외 접근시 404
export const dynamicParams = false;
export const dynamic = 'force-static';

export function generateStaticParams() {
  const categoryList = getCategoryList();
  const paramList = categoryList.map((category) => ({ category }));
  return paramList;
}

export async function generateMetadata({ params: { category } }: Props): Promise<Metadata> {
  const cg = getCategoryPublicName(category);
  const title = `${cg} | ${blogName}`;
  const url = `${baseDomain}/${category}`;

  return {
    title,
    openGraph: {
      title,
      url,
      images: [blogThumbnailURL],
    },
    twitter: {
      title,
      images: [blogThumbnailURL],
    },
  };
}

const CategoryPage = async ({ params, searchParams }: Props) => {
  const page = Number(searchParams?.page || '1');
  const tag = searchParams?.tag;
  const q = searchParams?.q;
  return <PostListPage category={params.category} page={page} tag={tag} q={q} />;
};

export default CategoryPage;

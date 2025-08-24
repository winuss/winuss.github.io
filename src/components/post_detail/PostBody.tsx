import { MdxComponents } from '../mdx';
import { Post } from '@/config/types';
import Link from 'next/link';
import { getRelatedPosts, getSeriesNav } from '@/lib/post';
// @ts-expect-error no types
import remarkA11yEmoji from '@fec/remark-a11y-emoji';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

interface Props {
  post: Post;
}

export const PostBody = async ({ post }: Props) => {
  const related = await getRelatedPosts(post, 5);
  const series = await getSeriesNav(post);
  return (
    <div className='prose dark:prose-invert'>
      <MDXRemote
        source={post.content}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkA11yEmoji, remarkBreaks],
            rehypePlugins: [
              [
                // @ts-ignore
                rehypePrettyCode,
                { theme: { dark: 'github-dark-dimmed', light: 'github-light' } },
              ],
              rehypeSlug,
            ],
          },
        }}
        components={MdxComponents}
      />
      {post.tags?.length ? (
        <div className='mt-8 flex flex-wrap gap-2'>
          {post.tags.map((t) => (
            <Link key={t} href={`/?tag=${encodeURIComponent(t)}`} className='text-sm text-blue-600'>
              #{t}
            </Link>
          ))}
        </div>
      ) : null}
      {(series.prev || series.next) && (
        <nav className='mt-8 flex items-center justify-between rounded-md bg-gray-50 p-4 dark:bg-slate-800'>
          <div>
            {series.prev && (
              <Link href={series.prev.url} className='text-sm text-gray-700 dark:text-gray-200'>
                ← 이전: {series.prev.title}
              </Link>
            )}
          </div>
          <div>
            {series.next && (
              <Link href={series.next.url} className='text-sm text-gray-700 dark:text-gray-200'>
                다음: {series.next.title} →
              </Link>
            )}
          </div>
        </nav>
      )}
      {related.length ? (
        <div className='mt-10'>
          <h3 className='mb-3 text-base font-semibold'>연관 글</h3>
          <ul className='grid grid-cols-1 gap-3'>
            {related.map((p) => (
              <li key={p.url}>
                <Link href={p.url} className='text-gray-700 hover:underline dark:text-gray-200'>
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

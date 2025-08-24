import Link from 'next/link';

import { Post } from '@/config/types';
import matter from 'gray-matter';
import { CalendarDays, Clock3, Tag } from 'lucide-react';

interface Props {
  post: Post;
}
const cleanMarkdownContent = (content: string) => {
  const { content: mdContent } = matter(content);

  return (
    mdContent
      // 코드 블록 제거 (~~~로 감싸진 부분)
      .replace(/~~~[\s\S]*?~~~/g, '')
      // ```로 감싸진 코드 블록 제거
      .replace(/```[\s\S]*?```/g, '')
      // 인라인 코드 제거
      .replace(/`[^`]*`/g, '')
      // 링크 제거
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // HTML 태그 제거
      .replace(/<[^>]*>/g, '')
      // 헤더(#) 제거
      .replace(/^#+\s*/gm, '')
      // 강조(*,_) 제거
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      // 리스트 마커 제거
      .replace(/^[\s-]*[-+*]\s+/gm, '')
      // 연속된 공백과 줄바꿈 정리
      .replace(/\n\s*\n/g, '\n')
      .replace(/\s+/g, ' ')
      .trim()
  );
};

const PostCard = ({ post }: Props) => {
  // gray-matter를 사용하여 마크다운 파싱
  const plainText = cleanMarkdownContent(post.content);

  return (
    <Link href={post.url} className='w-full'>
      <li className='group flex h-full w-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900'>
        <div className='flex w-full flex-1 flex-col justify-between p-5'>
          <div className='w-full'>
            <div className='flex w-full items-center justify-between gap-2'>
              <h2 className='flex-1 text-lg font-semibold tracking-tight lg:text-2xl'>
                {post.title}
              </h2>
              <span className='whitespace-nowrap rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 dark:bg-pink-400/10 dark:text-pink-300'>
                {post.categoryPublicName}
              </span>
            </div>
            <div className='my-3 h-px w-full bg-gray-100 dark:bg-gray-800' />
          </div>

          <div className='mb-4 w-full'>
            <p className='line-clamp-5 text-gray-600 dark:text-gray-300'>
              {post.excerpt || post.desc || plainText}
            </p>
          </div>

          {post.tags?.length ? (
            <div className='mb-3 flex flex-wrap items-center gap-2 text-xs text-gray-500'>
              <Tag className='h-3.5 w-3.5' />
              {post.tags.map((t) => (
                <span key={t} className='rounded-full border px-2 py-0.5'>#{t}</span>
              ))}
            </div>
          ) : null}

          <div className='flex w-full items-center justify-between text-sm text-gray-500 dark:text-gray-400'>
            <div className='flex items-center gap-2'>
              <CalendarDays className='h-4 w-4' />
              <span>{post.dateString}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Clock3 className='h-4 w-4' />
              <span>{post.readingMinutes}분</span>
            </div>
          </div>
        </div>
      </li>
    </Link>
  );
};

export default PostCard;

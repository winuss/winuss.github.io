'use client';

import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import PostCard from './PostCard';
import Pagination from './Pagination';

type SearchIndexPost = {
  url: string;
  slug: string;
  categoryPath: string;
  title: string;
  desc?: string;
  tags?: string[];
  date?: string;
  thumbnail?: string;
  content: string;
  searchText: string;
};

const PAGE_SIZE = 12;

export default function PostListClient({ category }: { category?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const tag = searchParams.get('tag') || '';
  const page = Math.max(1, Number(searchParams.get('page') || '1'));

  const [allPosts, setAllPosts] = useState<SearchIndexPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setIsLoading(true);
        const res = await fetch('/search-index.json', { cache: 'force-cache' });
        if (!res.ok) throw new Error(`failed to fetch index: ${res.status}`);
        const data = await res.json();
        if (!cancelled) setAllPosts(data.posts || []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'failed to load');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const byCategory = (p: SearchIndexPost) => (category ? p.categoryPath === category : true);
    const byTag = (p: SearchIndexPost) => (tag ? (p.tags || []).map((t) => t.toLowerCase()).includes(tag.toLowerCase()) : true);
    const byQuery = (p: SearchIndexPost) => (q ? p.searchText.toLowerCase().includes(q.toLowerCase()) : true);
    return allPosts.filter((p) => byCategory(p) && byTag(p) && byQuery(p));
  }, [allPosts, category, tag, q]);

  const sorted = useMemo(() => {
    // 작성일 최신순 정렬 (내림차순)
    return [...filtered].sort((a, b) => {
      const av = a.date ? dayjs(a.date).valueOf() : 0;
      const bv = b.date ? dayjs(b.date).valueOf() : 0;
      return bv - av;
    });
  }, [filtered]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const items = sorted.slice(start, start + PAGE_SIZE);

  const getCategoryPublicName = (dir: string) =>
    dir
      .split('_')
      .map((token) => (token ? token[0].toUpperCase() + token.slice(1) : token))
      .join(' ');

  const estimateReadingMinutes = (text: string) => {
    const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const makeExcerpt = (text: string, maxLen = 240) => {
    if (!text) return '';
    const t = text.trim();
    if (t.length <= maxLen) return t;
    const sliced = t.slice(0, maxLen);
    const lastSpace = sliced.lastIndexOf(' ');
    return (lastSpace > 0 ? sliced.slice(0, lastSpace) : sliced).concat('…');
  };

  if (isLoading) return <div className='py-10 text-sm text-gray-500'>로딩 중…</div>;
  if (error) return <div className='py-10 text-sm text-red-500'>검색 인덱스를 불러오지 못했습니다: {error}</div>;

  const hasFilters = Boolean(q || tag);
  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    params.delete('tag');
    params.delete('page');
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <section>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex flex-wrap items-center gap-2 text-xs text-gray-500'>
          {q ? (
            <span className='rounded-full border px-2 py-1'>검색어: &quot;{q}&quot;</span>
          ) : null}
          {tag ? (
            <span className='rounded-full border px-2 py-1'>태그: #{tag}</span>
          ) : null}
          <span className='rounded-full bg-gray-50 px-2 py-1 dark:bg-slate-800'>총 {total}건</span>
        </div>
        {hasFilters ? (
          <button
            onClick={clearFilters}
            className='inline-flex items-center rounded-md border px-2 py-1 text-xs hover:bg-gray-50 dark:hover:bg-slate-800'
          >
            초기화
          </button>
        ) : null}
      </div>
      <ul className='grid grid-cols-1 gap-8'>
        {items.map((p) => {
          const runtimePost: any = {
            ...p,
            dateString: p.date ? dayjs(p.date).format('YYYY년 MM월 DD일') : '',
            readingMinutes: estimateReadingMinutes(p.content),
            categoryPublicName: getCategoryPublicName(p.categoryPath),
            excerpt: makeExcerpt(p.searchText, 320),
          };
          return <PostCard key={p.url + (p.date || '')} post={runtimePost} />;
        })}
      </ul>
      <Pagination currentPage={page} totalPages={totalPages} />
    </section>
  );
}



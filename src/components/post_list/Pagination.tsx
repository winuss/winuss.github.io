'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface Props {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const go = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <nav className='mt-10 flex items-center justify-between'>
      <button
        className='rounded-md border px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50 dark:hover:bg-slate-800'
        disabled={currentPage <= 1}
        onClick={() => go(currentPage - 1)}
      >
        이전
      </button>
      <span className='rounded-md bg-gray-50 px-3 py-1 text-sm text-gray-600 dark:bg-slate-800 dark:text-gray-300'>
        페이지 {currentPage} / {totalPages}
      </span>
      <button
        className='rounded-md border px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50 dark:hover:bg-slate-800'
        disabled={currentPage >= totalPages}
        onClick={() => go(currentPage + 1)}
      >
        다음
      </button>
    </nav>
  );
}



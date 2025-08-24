import { CategoryDetail, HeadingItem, Post, PostMatter } from '@/config/types';
import dayjs from 'dayjs';
import fs from 'fs';
import { sync } from 'glob';
import matter from 'gray-matter';
import path from 'path';
import readingTime from 'reading-time';

const BASE_PATH = 'src/posts';
const POSTS_PATH = path.join(process.cwd(), BASE_PATH);

// 모든 MDX 파일 조회
export const getPostPaths = (category?: string) => {
  const folder = category || '**';
  const postPaths: string[] = sync(`${POSTS_PATH}/${folder}/**/*.mdx`);
  return postPaths;
};

// MDX 파일 파싱 : abstract / detail 구분
const parsePost = async (postPath: string): Promise<Post> => {
  const postAbstract = parsePostAbstract(postPath);
  const postDetail = await parsePostDetail(postPath);
  return {
    ...postAbstract,
    ...postDetail,
  };
};

// MDX의 개요 파싱
// url, cg path, cg name, slug
export const parsePostAbstract = (postPath: string) => {
  // const normalizedPath = postPath.split(path.sep).join('/');
  // const filePath = normalizedPath
  //   .slice(normalizedPath.indexOf(BASE_PATH))
  //   .replace(`${BASE_PATH}/`, '')
  //   .replace('.mdx', '');

  // const [categoryPath, slug] = filePath.split('/');
  // const url = `/${categoryPath}/${slug}`;
  // const categoryPublicName = getCategoryPublicName(categoryPath);
  // return { url, categoryPath, categoryPublicName, slug };

  const normalizedPath = postPath.split(path.sep).join('/');
  const filePath = normalizedPath
    .slice(normalizedPath.indexOf(BASE_PATH))
    .replace(`${BASE_PATH}/`, '')
    .replace('/content.mdx', '');

  const segments = filePath.split('/');
  const slug = segments[segments.length - 1];
  const categoryPath = segments[0];
  const categoryPublicName = getCategoryPublicName(categoryPath);
  const url = `/${slug}`;
  return { url, slug, categoryPath, categoryPublicName };
};

// MDX detail
const parsePostDetail = async (postPath: string) => {
  const file = fs.readFileSync(postPath, 'utf8');
  const { data, content } = matter(file);
  const grayMatter = data as PostMatter;
  const readingMinutes = Math.ceil(readingTime(content).minutes);
  const dateString = dayjs(grayMatter.date).locale('ko').format('YYYY년 MM월 DD일');
  const excerpt = generateExcerpt(content, 320);
  return { ...grayMatter, dateString, content, readingMinutes, excerpt };
};

// 간단한 excerpt 생성기: 코드블록/HTML 제거 후 앞부분만 추출
const generateExcerpt = (raw: string, maxLen = 240) => {
  const text = raw
    // fenced code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/~~~[\s\S]*?~~~/g, '')
    // inline code
    .replace(/`[^`]*`/g, '')
    // images -> alt만 남기기
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '$1')
    // links -> label만 남기기
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // html tags
    .replace(/<[^>]*>/g, '')
    // blockquote markers at line start
    .replace(/^>\s?/gm, '')
    // list markers at line start
    .replace(/^[\s-]*[-+*]\s+/gm, '')
    // headings #, ##
    .replace(/^#{1,6}\s*/gm, '')
    // emphasis/bold/italic markers
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // normalize whitespace
    .replace(/\r?\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLen) return text;
  const sliced = text.slice(0, maxLen);
  const lastSpace = sliced.lastIndexOf(' ');
  return (lastSpace > 0 ? sliced.slice(0, lastSpace) : sliced).concat('…');
};

// category folder name을 public name으로 변경 : dir_name -> Dir Name
export const getCategoryPublicName = (dirPath: string) =>
  dirPath
    .split('_')
    .map((token) => token[0].toUpperCase() + token.slice(1, token.length))
    .join(' ');

// post를 날짜 최신순으로 정렬
const sortPostList = (PostList: Post[]) => {
  return PostList
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
};

// 모든 포스트 목록 조회. 블로그 메인 페이지에서 사용
export const getPostList = async (category?: string): Promise<Post[]> => {
  const postPaths = getPostPaths(category);
  const postList = await Promise.all(postPaths.map((postPath) => parsePost(postPath)));
  return postList;
};

export const getSortedPostList = async (category?: string) => {
  const postList = await getPostList(category);
  return sortPostList(postList);
};

export type PostQuery = {
  page?: number;
  pageSize?: number;
  category?: string;
  tag?: string;
  q?: string;
};

export const queryPosts = async ({ page = 1, pageSize = 12, category, tag, q }: PostQuery) => {
  const all = await getSortedPostList(category);

  const filtered = all.filter((p) => {
    const byTag = tag ? (p.tags || []).map((t) => t.toLowerCase()).includes(tag.toLowerCase()) : true;
    const byQuery = q
      ? [p.title, p.desc, p.content]
          .join(' ')
          .toLowerCase()
          .includes(q.toLowerCase())
      : true;
    return byTag && byQuery;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);
  return { items, total, totalPages, page, pageSize };
};

export const getAllTags = async () => {
  const posts = await getPostList();
  const tagSet = new Set<string>();
  for (const p of posts) {
    (p.tags || []).forEach((t) => tagSet.add(t));
  }
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
};

export const getRelatedPosts = async (post: Post, limit = 5) => {
  const posts = await getSortedPostList();
  const tags = new Set((post.tags || []).map((t) => t.toLowerCase()));
  const related = posts
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      const overlap = (p.tags || []).filter((t) => tags.has(t.toLowerCase())).length;
      return { p, overlap };
    })
    .filter(({ overlap }) => overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map(({ p }) => p);
  return related;
};

export const getSeriesNav = async (post: Post) => {
  if (!post.series) return { prev: undefined, next: undefined };
  const posts = (await getSortedPostList()).filter((p) => p.series === post.series);
  const sorted = posts.sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));
  const idx = sorted.findIndex((p) => p.slug === post.slug);
  return {
    prev: idx > 0 ? sorted[idx - 1] : undefined,
    next: idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : undefined,
  };
};

export const getSitemapPostList = async () => {
  const postList = await getPostList();
  const baseUrl = 'https://blog.devtimes.com';
  const sitemapPostList = postList.map(({ url }) => ({
    lastModified: new Date(),
    url: `${baseUrl}${url}`,
  }));
  return sitemapPostList;
};

export const getAllPostCount = async () => (await getPostList()).length;

export const getCategoryList = () => {
  const cgPaths: string[] = sync(`${POSTS_PATH}/*`);
  const cgList = cgPaths.map((p) => p.split(path.sep).slice(-1)?.[0]);
  return cgList;
};

export const getCategoryDetailList = async () => {
  const postList = await getPostList();
  const result: { [key: string]: number } = {};
  for (const post of postList) {
    const category = post.categoryPath;
    if (result[category]) {
      result[category] += 1;
    } else {
      result[category] = 1;
    }
  }
  const detailList: CategoryDetail[] = Object.entries(result).map(([category, count]) => ({
    dirName: category,
    publicName: getCategoryPublicName(category),
    count,
  }));

  return detailList;
};

// post 상세 페이지 내용 조회
export const getPostDetail = async (category: string, slug: string) => {
  // const filePath = `${POSTS_PATH}/${category}/${slug}/content.mdx`;
  // const detail = await parsePost(filePath);
  // return detail;

  const postPaths = getPostPaths();
  const matchingPath = postPaths.find((path) => path.includes(`/${slug}/content.mdx`));

  if (!matchingPath) {
    console.warn(`Post not found for slug: ${slug}`);
    return null;
  }

  const detail = await parsePost(matchingPath);
  return detail;
};

export const parseToc = (content: string): HeadingItem[] => {
  const regex = /^(##|###) (.*$)/gim;
  const headingList = content.match(regex);
  return (
    headingList?.map((heading: string) => ({
      text: heading.replace('##', '').replace('#', ''),
      link:
        '#' +
        heading
          .replace('# ', '')
          .replace('#', '')
          .replace(/[\[\]:!@#$/%^&*()+=,.]/g, '')
          .replace(/ /g, '-')
          .toLowerCase()
          .replace('?', ''),
      indent: (heading.match(/#/g)?.length || 2) - 2,
    })) || []
  );
};

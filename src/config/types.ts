import { RESUME_DATA_KO } from '@/data/resume-data-ko';

export interface PostMatter {
  title: string;
  date: Date;
  dateString: string;
  thumbnail: string;
  desc: string;
  tags?: string[];
  series?: string;
  seriesOrder?: number;
  updated?: Date;
  featured?: boolean;
  pinned?: boolean;
  draft?: boolean;
}

export interface Post extends PostMatter {
  url: string;
  slug: string;
  categoryPath: string;
  content: string;
  readingMinutes: number;
  categoryPublicName: string;
  excerpt?: string;
}

export interface CategoryDetail {
  dirName: string;
  publicName: string;
  count: number;
}

export interface HeadingItem {
  text: string;
  link: string;
  indent: number;
}

export interface ProjectMatter {
  title: string;
  desc: string;
  startMonth: string;
  endMonth: string;
  tags: string;
  gitRepoUrl?: string;
  link?: string;
}

export interface Project extends ProjectMatter {
  slug: string;
  startMonthString: string;
  endMonthString?: string;
  content: string;
}

export const DATAS = {
  data: RESUME_DATA_KO,
  aboutClassName: 'sm:whitespace-pre-wrap whitespace-normal',
};

export type Locale = keyof typeof DATAS;

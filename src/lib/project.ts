import { Project, ProjectMatter } from '@/config/types';
import { format } from 'date-fns';
import fs from 'fs';
import { sync } from 'glob';
import matter from 'gray-matter';
import path from 'path';

const BASE_PATH = '/src/projects';
const CAREER_PATH = `${BASE_PATH}/career`;
const SECTION_PATH = `${BASE_PATH}/section`;

const PROJECT_SECTION_PATH = path.join(process.cwd(), SECTION_PATH);
const PROJECT_CAREER_PATH = path.join(process.cwd(), CAREER_PATH);
const monthFormat = 'yyyy년 M월';

const presentLang = '현재';

// 모든 MDX 파일 조회
const getProjectSectionPaths = () => {
  const filename = '*';
  const projectPaths: string[] = sync(`${PROJECT_SECTION_PATH}/**/${filename}.mdx`);
  return projectPaths;
};

// MDX detail
const parseProject = async (postPath: string) => {
  const file = fs.readFileSync(postPath, 'utf8');
  const { slug } = getProjectInfoFromPath(postPath);
  const { data, content } = matter(file);
  const grayMatter = data as ProjectMatter;
  const startMonthString = format(grayMatter.startMonth, monthFormat);
  const endMonthString = grayMatter.endMonth
    ? format(grayMatter.endMonth, monthFormat)
    : presentLang;

  return { ...grayMatter, content, startMonthString, endMonthString, slug };
};

// project를 날짜 최신순으로 정렬
const sortProjectList = (projectList: Project[]) => {
  return projectList.sort((a, b) => (a.startMonth > b.startMonth ? -1 : 1));
};

// MDX의 개요 파싱
const getProjectInfoFromPath = (postPath: string) => {
  const path = postPath
    .slice(postPath.indexOf(BASE_PATH))
    .replace(`${BASE_PATH}/`, '')
    .replace('.mdx', '');

  const splitted = path.split('/');
  const slug = splitted.slice(1, -1).join('/');

  return { category: splitted[0], slug };
};

// 모든 프로젝트 목록 조회. 이력서 하단에서 사용
const getProjectList = async (): Promise<Project[]> => {
  const projectPaths = getProjectSectionPaths();
  const projectList = await Promise.all(projectPaths.map((postPath) => parseProject(postPath)));
  return projectList;
};

export const getSortedProjectList = async () => {
  const projectList = await getProjectList();
  return sortProjectList(projectList);
};

const getProjectCareerPaths = () => {
  const filename = '*';
  const projectPaths: string[] = sync(`${PROJECT_CAREER_PATH}/**/${filename}.mdx`);
  return projectPaths;
};

export const getCareerProjectList = async () => {
  const projectPaths = getProjectCareerPaths();
  const projectList = await Promise.all(projectPaths.map((postPath) => parseProject(postPath)));
  return projectList;
};

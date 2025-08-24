import { Metadata } from 'next';

import ProjectList from '@/components/about/project-list';
import CopyLinkButton from '@/components/common/CopyLinkButton';
import { ProjectBody } from '@/components/project-detail/project-body';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import * as D from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Section } from '@/components/ui/section';
import { DATAS } from '@/config/types';
import { getSortedProjectList } from '@/lib/project';
import { cn } from '@/lib/utils';
import { GlobeIcon, MailIcon } from 'lucide-react';

export function generateMetadata(): Metadata {
  const data = DATAS.data;
  return {
    title: `${data.name} | ${data.about}`,
    description: data.summary,
  };
}

export default async function AboutPage() {
  const RESUME_DATA = DATAS.data;
  const projectList = await getSortedProjectList();
  return (
    <main className='container relative mx-auto scroll-my-12 overflow-auto p-0 sm:p-0 md:p-0 print:p-12 print:pt-0'>
      {/* Hero */}
      <section className='relative overflow-hidden border-b bg-gradient-to-b from-white to-gray-50 px-6 py-12 dark:from-slate-950 dark:to-slate-900 sm:px-9 md:px-16'>
        <div className='mx-auto flex w-full max-w-4xl flex-col items-center justify-between gap-8 sm:flex-row'>
          <div className='flex-1 space-y-3 text-center sm:text-left'>
            <span className='inline-block rounded-full border px-3 py-1 text-xs text-gray-600 dark:text-gray-300'>About</span>
            <h1 className='text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl'>{RESUME_DATA.name}</h1>
 
            <div className='flex flex-wrap items-center justify-center gap-2 sm:justify-start'>
              {RESUME_DATA.skills.slice(0, 6).map((s) => (
                <Badge key={s} variant='secondary' className='rounded-full'>
                  {s}
                </Badge>
              ))}
            </div>
            <div className='flex justify-center gap-x-2 pt-1 sm:justify-start print:hidden'>
              {RESUME_DATA.contact.social.map((social) => (
                <Button key={social.name} className='size-8' variant='outline' size='icon' asChild>
                  <a href={social.url} target='_blank'>
                    <social.icon className='size-4' />
                  </a>
                </Button>
              ))}
              {RESUME_DATA.contact.email && (
                <D.Dialog>
                  <D.DialogTrigger>
                    <Button className='size-8' variant='outline' size='icon' asChild>
                      <MailIcon className='size-4' />
                    </Button>
                  </D.DialogTrigger>
                  <D.DialogContent className='max-w-[300px]'>
                    <D.DialogHeader>
                      <D.DialogTitle className='p-0'>Email Address</D.DialogTitle>
                      <D.DialogDescription></D.DialogDescription>
                    </D.DialogHeader>
                    <div className='flex items-center space-x-2'>
                      <div className='grid flex-1 gap-2'>
                        <label htmlFor='link' className='sr-only'>
                          Link
                        </label>
                        <Input id='link' defaultValue={RESUME_DATA.contact.email} readOnly />
                      </div>
                      <CopyLinkButton
                        variant='default'
                        url={RESUME_DATA.contact.email}
                        className='p-3'
                      />
                    </div>
                  </D.DialogContent>
                </D.Dialog>
              )}
            </div>
          </div>
          <Avatar className='size-28 sm:size-32 md:size-40'>
            <AvatarImage alt={RESUME_DATA.name} src={RESUME_DATA.avatarUrl} />
            <AvatarFallback>{RESUME_DATA.initials}</AvatarFallback>
          </Avatar>
        </div>
      </section>

      <Section className='mx-auto w-full max-w-4xl space-y-8 p-6 sm:p-9 md:p-16 print:space-y-4'>
        <Section>
          <h2 className='text-2xl font-bold'>About</h2>
          <p
            className={cn(
              'text-pretty leading-8 text-muted-foreground print:text-[12px]',
              DATAS.aboutClassName
            )}
          >
            {RESUME_DATA.summary}
          </p>
        </Section>
        <Section>
          <h2 className='text-2xl font-bold'>Profile</h2>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <Card>
              <CardHeader className='pb-2'>
                <h3 className='text-lg font-semibold'>Intro</h3>
                <CardDescription>
                  <span className='block'>Hi, I&apos;m <b>Yoo, Seongsu</b></span>
                  <span className='block'>Fullstack Developer 🚀 from Korea</span>
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-2 text-sm text-muted-foreground'>
                <p>🔭 I’m currently working on … in Seoul</p>
                <p>
                  <a
                    className='inline-flex items-center gap-x-1.5 align-baseline leading-none hover:underline'
                    href={RESUME_DATA.locationLink}
                    target='_blank'
                  >
                    <GlobeIcon className='size-3' /> {RESUME_DATA.location}
                  </a>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <h3 className='text-lg font-semibold'>Interests</h3>
                <CardDescription>요즘 관심사</CardDescription>
              </CardHeader>
              <CardContent className='flex flex-wrap gap-2'>
                {['ML', 'DL', 'PWA', 'WebAssembly', 'Socket.io', 'Flutter'].map((t) => (
                  <Badge key={t} variant='secondary' className='rounded-full'>
                    {t}
                  </Badge>
                ))}
              </CardContent>
            </Card>

            <Card className='sm:col-span-2'>
              <CardHeader className='pb-2'>
                <h3 className='text-lg font-semibold'>Experienced</h3>
                <CardDescription>Framework / Library · Language · Tool</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
                  <div>
                    <h4 className='mb-2 text-sm font-medium text-foreground'>Framework &amp; Library</h4>
                    <ul className='list-disc pl-5 text-sm text-muted-foreground'>
                      <li>React, Next.js, Redux, TanStack Query</li>
                      <li>Node.js, Express, NestJS</li>
                      <li>Tailwind CSS, Shadcn UI</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className='mb-2 text-sm font-medium text-foreground'>Language</h4>
                    <ul className='list-disc pl-5 text-sm text-muted-foreground'>
                      <li>TypeScript, JavaScript</li>
                      <li>Python (Data / Scripting)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className='mb-2 text-sm font-medium text-foreground'>Tool</h4>
                    <ul className='list-disc pl-5 text-sm text-muted-foreground'>
                      <li>GitHub / Actions, Vercel</li>
                      <li>Docker, PNPM, ESLint/Prettier</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='sm:col-span-2'>
              <CardHeader className='pb-2'>
                <h3 className='text-lg font-semibold'>Etc</h3>
                <CardDescription>그 외</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className='list-disc pl-5 text-sm text-muted-foreground'>
                  <li>블로그/문서화를 통한 지식 공유를 즐깁니다.</li>
                  <li>사용자 경험과 성능을 함께 개선하는 것을 선호합니다.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </Section>
        <Section>
          <h2 className='text-2xl font-bold'>Skills</h2>
          <div className='flex flex-wrap gap-1'>
            {RESUME_DATA.skills.map((skill) => (
              <Badge className='print:text-[10px]' key={skill}>
                {skill}
              </Badge>
            ))}
          </div>
        </Section>

        <Section className='print-force-new-page scroll-mb-16'>
          <h2 className='text-2xl font-bold'>Projects</h2>
          <ProjectList list={projectList} />
        </Section>
      </Section>
    </main>
  );
}

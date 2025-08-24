import IconGithub from '@/components/icon/Github';
import IconLinkedin from '@/components/icon/LinkedIn';

export const RESUME_DATA_KO = {
  name: 'Yoo Seongsu',
  initials: '',
  location: '대한민국 서울특별시 (한국 표준시)',
  locationLink: 'https://www.google.com/maps/place/seoul',
  about: '프론트엔드 개발자',
  summary: '게임 플랫폼 및 매칭 시스템 개발 경험을 보유하고 있으며, 데이터 분석과 데이터 기반 의사결정을 선호합니다. 현재 데브타임즈 웹사이트와 블로그를 운영하고 있습니다.',
  avatarUrl: '/profile.png',
  contact: {
    email: 'niceyss@naver.com',
    social: [
      {
        name: 'GitHub',
        url: 'https://github.com/',
        icon: IconGithub,
      },
      {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/',
        icon: IconLinkedin,
      },
    ],
  },
  work: [
    {
      company: 'Play with',
      link: '#',
      title: '플랫폼 개발자',
      start: '2000. 03.',
      end: null,
      description: '-',
      points: ['-'],
    },
    {
      company: 'Webzen',
      link: '#',
      title: '플랫폼 개발자',
      start: '2022. 02.',
      end: '2023. 02.',
      description: '-',
      points: ['-'],
    },
  ],
  skills: ['Javascript', 'Typescript', 'React', 'Angular', 'Next.js', 'Nestjs', 'WPF', 'C#', 'Winform', 'Python', 'Flutter', 'ELK', ],
} as const;

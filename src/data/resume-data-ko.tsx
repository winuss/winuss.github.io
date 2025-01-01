import IconGithub from '@/components/icon/Github';
import IconLinkedin from '@/components/icon/LinkedIn';

export const RESUME_DATA_KO = {
  name: 'Yoo Seongsu',
  initials: '',
  location: '대한민국 서울특별시 (한국 표준시)',
  locationLink: 'https://www.google.com/maps/place/seoul',
  about: '프론트엔드 개발자',
  summary: '개발의 시간',
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
  skills: ['Javascript', 'Typescript', 'React.js', 'Angular', 'Next.js'],
} as const;

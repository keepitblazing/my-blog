"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import SectionTitle from "@/components/portfolio/SectionTitle";
import SkillBadge from "@/components/portfolio/SkillBadge";
import ProjectCard from "@/components/portfolio/ProjectCard";
import GitHubStats from "@/components/portfolio/GitHubStats";
import GitHubContributions from "@/components/portfolio/GitHubContributions";
import Image from "next/image";
import { useState } from "react";

export default function PortfolioPage() {
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const frontendSkills = [
    { name: "Next.js", starred: true },
    { name: "React", starred: true },
    { name: "Electron", starred: false },
  ];

  const backendSkills = [{ name: "NestJS", starred: false }];

  const devopsSkills = [{ name: "Docker", starred: false }];

  const languages = [
    { name: "TypeScript", starred: true },
    { name: "JavaScript", starred: false },
    { name: "Python", starred: false },
  ];

  const stateManagement = [
    { name: "React Query (TanStack Query)", starred: false },
    { name: "Redux", starred: false },
    { name: "Recoil", starred: false },
    { name: "Zustand", starred: false },
  ];

  const styling = [
    { name: "Tailwind CSS", starred: true },
    { name: "Styled Components", starred: false },
    { name: "Emotion", starred: false },
  ];

  const versionControl = [
    { name: "Git", starred: false },
    { name: "GitHub", starred: false },
    { name: "GitLab", starred: false },
  ];

  const buildTools = [
    { name: "Webpack", starred: false },
    { name: "Vite", starred: false },
    { name: "Turbopack", starred: false },
    { name: "npm", starred: false },
    { name: "yarn", starred: false },
    { name: "pnpm", starred: false },
    { name: "Yarn Berry", starred: false },
  ];

  const cloudServices = [
    { name: "AWS S3", starred: false },
    { name: "AWS EC2", starred: false },
    { name: "Vercel", starred: false },
    { name: "GitHub Actions", starred: false },
  ];

  const monitoring = [
    { name: "Google Analytics", starred: false },
    { name: "Microsoft Clarity", starred: false },
    { name: "Sentry", starred: false },
  ];

  const realtime = [
    { name: "WebSocket", starred: false },
    { name: "STOMP", starred: false },
  ];

  const database = [
    { name: "MySQL", starred: false },
    { name: "MongoDB", starred: false },
  ];

  const api = [{ name: "REST API", starred: false }];

  const projects = [
    {
      title: "BootShell VS Code Extension",
      description:
        "VS Code 내에서 Claude Terminal 인터페이스를 제공하는 확장 프로그램입니다.",
      details: [
        "유연한 터미널 배치 옵션 제공 (좌측, 우측, 하단)",
        "Claude 명령어 자동 실행 기능",
        "VS Code의 네이티브 터미널 통합",
        "VS Code Marketplace에 정식 배포되어 개발자들이 활발히 사용 중",
      ],
      technologies: ["TypeScript", "VS Code Extension API", "Node.js"],
      githubUrl: "https://github.com/keepitblazing/bootshell",
      featured: true,
    },
    {
      title: "Keep it Blazing Blog",
      description: "Next.js와 Supabase를 활용한 개인 기술 블로그입니다.",
      details: [
        "다크 테마 디자인 시스템 구축",
        "태그 기반 포스트 분류 시스템",
        "Toast UI Editor를 활용한 마크다운 글 작성 기능",
        "방문자 통계 및 관리자 기능",
        "반응형 디자인 및 모바일 최적화",
      ],
      technologies: [
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Supabase",
        "Toast UI Editor",
      ],
      githubUrl: "https://github.com/keepitblazing/blog",
      featured: true,
    },
    {
      title: "Project-UMM",
      description:
        "Electron 기반의 화상, 음성, 채팅 데스크톱 애플리케이션입니다.",
      details: [
        "Electron으로 크로스 플랫폼 데스크톱 앱 개발",
        "WebSocket/STOMP를 활용한 실시간 통신",
        "React Window를 활용한 대용량 리스트 가상화",
        "암호화된 데이터 처리 (Crypto-js)",
      ],
      technologies: [
        "Next.js",
        "Electron",
        "TypeScript",
        "WebSocket",
        "STOMP",
        "React Window",
        "Tailwind CSS",
      ],
      githubUrl: "https://github.com/project-umm/front-end",
      featured: true,
      inProgress: true,
    },
    {
      title: "Custom NAS System",
      description:
        "라즈베리파이 기반 DIY NAS - 3D 프린팅 케이스 제작부터 Synology 스타일 웹 UI까지",
      details: [
        "Raspberry Pi 세팅 및 3-bay HDD 인클로저 3D 프린팅",
        "Next.js 기반 NAS 관리자 대시보드 개발",
        "실시간 시스템 모니터링 및 파일 매니저 UI 구현",
        "백엔드 개발자와 협업 예정",
      ],
      technologies: [
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "WebSocket",
        "3D Printing",
        "Raspberry Pi",
      ],
      featured: false,
      planned: true,
    },
  ];

  return (
    <div className="min-h-screen bg-blog-black">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-12 pb-8 border-b border-blog-grey">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-full border-2 border-blog-grey">
              <Image
                src="https://avatars.githubusercontent.com/u/103014298?s=400&u=0381c49a20226f7f21aae12fe073a7faee078a46&v=4"
                alt="박지민"
                width={128}
                height={128}
                className="rounded-full"
              />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-4xl font-bold text-blog-text mb-2">
                Jimin Park
              </h1>
              <p className="text-xl text-blog-text-muted mb-4">
                Frontend Developer
              </p>
              <div className="flex gap-4 justify-center sm:justify-start mb-4">
                <Link
                  href="https://github.com/keepitblazing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blog-grey text-blog-text rounded-md hover:bg-blog-grey-hover transition-colors"
                >
                  <FontAwesomeIcon icon={faGithub} />
                  GitHub
                </Link>
                <Link
                  href="mailto:keepinblazing@gmail.com"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blog-grey text-blog-text rounded-md hover:bg-blog-grey-hover transition-colors"
                >
                  <FontAwesomeIcon icon={faEnvelope} />
                  Contact
                </Link>
              </div>
              {/* GitHub Stats */}
              <GitHubStats />
            </div>
          </div>
        </div>

        {/* GitHub Contributions */}
        <section className="mb-12">
          <SectionTitle>GitHub Contributions</SectionTitle>
          <GitHubContributions />
        </section>

        {/* Skills Section */}
        <section className="mb-12">
          <SectionTitle>Tech Stack</SectionTitle>

          <div className="space-y-6">
            {/* Frontend */}
            <div>
              <h3 className="text-lg font-semibold text-blog-text mb-3">
                Frontend
              </h3>
              <div className="flex flex-wrap gap-2">
                {frontendSkills.map((skill) => (
                  <SkillBadge
                    key={skill.name}
                    name={skill.name}
                    starred={skill.starred}
                  />
                ))}
              </div>
            </div>

            {/* Backend */}
            <div>
              <h3 className="text-lg font-semibold text-blog-text mb-3">
                Backend
              </h3>
              <div className="flex flex-wrap gap-2">
                {backendSkills.map((skill) => (
                  <SkillBadge
                    key={skill.name}
                    name={skill.name}
                    starred={skill.starred}
                  />
                ))}
              </div>
            </div>

            {/* DevOps */}
            <div>
              <h3 className="text-lg font-semibold text-blog-text mb-3">
                DevOps
              </h3>
              <div className="flex flex-wrap gap-2">
                {devopsSkills.map((skill) => (
                  <SkillBadge
                    key={skill.name}
                    name={skill.name}
                    starred={skill.starred}
                  />
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <h3 className="text-lg font-semibold text-blog-text mb-3">
                Language
              </h3>
              <div className="flex flex-wrap gap-2">
                {languages.map((skill) => (
                  <SkillBadge
                    key={skill.name}
                    name={skill.name}
                    starred={skill.starred}
                  />
                ))}
              </div>
            </div>

            {/* State Management */}
            <div>
              <h3 className="text-lg font-semibold text-blog-text mb-3">
                State Management
              </h3>
              <div className="flex flex-wrap gap-2">
                {stateManagement.map((skill) => (
                  <SkillBadge
                    key={skill.name}
                    name={skill.name}
                    starred={skill.starred}
                  />
                ))}
              </div>
            </div>

            {/* Styling */}
            <div>
              <h3 className="text-lg font-semibold text-blog-text mb-3">
                Styling
              </h3>
              <div className="flex flex-wrap gap-2">
                {styling.map((skill) => (
                  <SkillBadge
                    key={skill.name}
                    name={skill.name}
                    starred={skill.starred}
                  />
                ))}
              </div>
            </div>

            {/* Version Control */}
            <div>
              <h3 className="text-lg font-semibold text-blog-text mb-3">
                Version Control
              </h3>
              <div className="flex flex-wrap gap-2">
                {versionControl.map((skill) => (
                  <SkillBadge
                    key={skill.name}
                    name={skill.name}
                    starred={skill.starred}
                  />
                ))}
              </div>
            </div>

            {/* Build Tools & Package Managers */}
            <div>
              <h3 className="text-lg font-semibold text-blog-text mb-3">
                Build Tools & Package Managers
              </h3>
              <div className="flex flex-wrap gap-2">
                {buildTools.map((skill) => (
                  <SkillBadge
                    key={skill.name}
                    name={skill.name}
                    starred={skill.starred}
                  />
                ))}
              </div>
            </div>

            {/* Cloud & Deployment */}
            <div>
              <h3 className="text-lg font-semibold text-blog-text mb-3">
                Cloud & Deployment
              </h3>
              <div className="flex flex-wrap gap-2">
                {cloudServices.map((skill) => (
                  <SkillBadge
                    key={skill.name}
                    name={skill.name}
                    starred={skill.starred}
                  />
                ))}
              </div>
            </div>

            {/* Monitoring & Analytics */}
            <div>
              <h3 className="text-lg font-semibold text-blog-text mb-3">
                Monitoring & Analytics
              </h3>
              <div className="flex flex-wrap gap-2">
                {monitoring.map((skill) => (
                  <SkillBadge
                    key={skill.name}
                    name={skill.name}
                    starred={skill.starred}
                  />
                ))}
              </div>
            </div>

            {/* Real-time Communication */}
            <div>
              <h3 className="text-lg font-semibold text-blog-text mb-3">
                Real-time Communication
              </h3>
              <div className="flex flex-wrap gap-2">
                {realtime.map((skill) => (
                  <SkillBadge
                    key={skill.name}
                    name={skill.name}
                    starred={skill.starred}
                  />
                ))}
              </div>
            </div>

            {/* Database */}
            <div>
              <h3 className="text-lg font-semibold text-blog-text mb-3">
                Database
              </h3>
              <div className="flex flex-wrap gap-2">
                {database.map((skill) => (
                  <SkillBadge
                    key={skill.name}
                    name={skill.name}
                    starred={skill.starred}
                  />
                ))}
              </div>
            </div>

            {/* API */}
            <div>
              <h3 className="text-lg font-semibold text-blog-text mb-3">
                API Development
              </h3>
              <div className="flex flex-wrap gap-2">
                {api.map((skill) => (
                  <SkillBadge
                    key={skill.name}
                    name={skill.name}
                    starred={skill.starred}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Open Source Contribution */}
        <section className="mb-12">
          <SectionTitle>Open Source Contributions</SectionTitle>

          <div className="bg-blog-black border border-blog-grey rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="/dayjs.png"
                alt="Day.js"
                className="w-16 h-16 rounded-md cursor-pointer hover:opacity-80 transition-all animate-pulse-border"
                onClick={() => setIsImageExpanded(!isImageExpanded)}
              />
              <div>
                <h3 className="text-xl font-bold text-blog-text">
                  Day.js 한국어 문서 번역
                </h3>
                <p className="text-blog-text-muted">
                  JavaScript 날짜 라이브러리
                </p>
              </div>
            </div>
            {isImageExpanded && (
              <div className="mb-4 flex justify-center">
                <img
                  src="/dayjs.png"
                  alt="Day.js"
                  className="max-w-full h-auto rounded-md cursor-pointer"
                  onClick={() => setIsImageExpanded(false)}
                />
              </div>
            )}
            <p className="text-blog-text mb-4">
              현업 및 사이드 프로젝트에서 자주 사용하는 Day.js 라이브러리의
              한국어 문서를 살펴보던 중, 번역에 오역이나 문장의 앞뒤가 맞지 않는
              등의 문제를 발견하였습니다. 이에 저는 개인적으로 이 문서를 다시
              번역하는 작업에 착수했고, 어순이 같은 일본어 문서와 원본 영어
              문서를 번역해 보면서 최대한 이해하기 쉽고 개발자 친화적인 문서로
              다시 번역하여 오픈소스 커뮤니티에 기여했습니다.
            </p>
            <Link
              href="https://github.com/iamkun/dayjs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blog-text hover:text-blog-white transition-colors"
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} />
              Day.js Repository
            </Link>
          </div>
        </section>

        {/* Projects Section */}
        <section className="mb-12">
          <SectionTitle>Projects</SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </section>

        {/* Skills Detail Section */}
        <section className="mb-12">
          <SectionTitle>Tech Stack Details</SectionTitle>

          <div className="space-y-8">
            {/* Frontend Skills Detail */}
            <div className="bg-blog-black border border-blog-grey rounded-lg p-6">
              <h3 className="text-xl font-bold text-blog-text mb-4">
                Frontend
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-blog-text mb-2">
                    Next.js ⭐
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-blog-text-muted text-sm">
                    <li>
                      내장 기능을 활용하여 빠른 응답 시간을 제공하는 유저
                      친화적인 웹 서비스 구축 가능
                    </li>
                    <li>SSR/SSG를 통한 SEO 최적화 및 성능 향상 구현 가능</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-blog-text mb-2">
                    React ⭐
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-blog-text-muted text-sm">
                    <li>
                      React Hooks을 활용한 컴포넌트 상태 및 수명 주기 관리 가능
                    </li>
                    <li>
                      재사용 가능한 컴포넌트 설계를 통한 코드 유지보수성 개선
                      가능
                    </li>
                    <li>
                      Custom Hook을 활용한 중복 로직 제거 및 코드 재사용성 향상
                      가능
                    </li>
                    <li>일반화된 컴포넌트 라이브러리 제작 가능</li>
                    <li>
                      React Context API를 활용한 컴포넌트 전반의 상태 관리
                      간소화 가능
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Language Skills Detail */}
            <div className="bg-blog-black border border-blog-grey rounded-lg p-6">
              <h3 className="text-xl font-bold text-blog-text mb-4">
                Language
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-blog-text mb-2">
                    TypeScript ⭐
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-blog-text-muted text-sm">
                    <li>
                      제네릭(Generic)을 활용하여 재사용 가능한 컴포넌트 및 함수
                      작성 가능
                    </li>
                    <li>
                      조건부 타입(Conditional Types)과 매핑된 타입(Mapped
                      Types)을 활용한 동적 타입 생성 가능
                    </li>
                    <li>
                      인터페이스와 타입 별칭을 통한 명확한 데이터 구조 정의 가능
                    </li>
                    <li>
                      유니온 타입과 교차 타입을 활용한 유연한 타입 설계 가능
                    </li>
                    <li>
                      타입 가드와 타입 단언을 통한 런타임 안전성 보장 가능
                    </li>
                    <li>
                      유틸리티 타입(Partial, Pick, Omit 등)을 활용한 효율적인
                      타입 변환 가능
                    </li>
                    <li>
                      엄격한 타입 검사를 통한 컴파일 타임 오류 방지 및 코드 품질
                      향상 가능
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-blog-text mb-2">
                    JavaScript
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-blog-text-muted text-sm">
                    <li>ES6+ 최신 문법 활용 가능</li>
                    <li>비동기 처리(Promise, async/await) 구현 가능</li>
                    <li>
                      모듈 시스템과 클래스 문법을 활용한 객체지향 프로그래밍
                      가능
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-blog-text mb-2">Python</h4>
                  <ul className="list-disc list-inside space-y-1 text-blog-text-muted text-sm">
                    <li>Flask를 활용한 경량 웹 애플리케이션 개발 가능</li>
                    <li>RESTful API 설계 및 구현 가능</li>
                    <li>Pandas를 활용한 데이터 처리 및 분석 가능</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Backend Skills Detail */}
            <div className="bg-blog-black border border-blog-grey rounded-lg p-6">
              <h3 className="text-xl font-bold text-blog-text mb-4">Backend</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-blog-text mb-2">NestJS</h4>
                  <ul className="list-disc list-inside space-y-1 text-blog-text-muted text-sm">
                    <li>기본적인 CRUD API 구현 가능</li>
                    <li>
                      모듈 구조를 활용한 간단한 서버 애플리케이션 구축 가능
                    </li>
                    <li>TypeScript 기반의 백엔드 개발 가능</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* DevOps Skills Detail */}
            <div className="bg-blog-black border border-blog-grey rounded-lg p-6">
              <h3 className="text-xl font-bold text-blog-text mb-4">DevOps</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-blog-text mb-2">Docker</h4>
                  <ul className="list-disc list-inside space-y-1 text-blog-text-muted text-sm">
                    <li>Dockerfile 작성을 통한 애플리케이션 컨테이너화 가능</li>
                    <li>기본적인 이미지 빌드 및 컨테이너 실행 가능</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* State Management Skills Detail */}
            <div className="bg-blog-black border border-blog-grey rounded-lg p-6">
              <h3 className="text-xl font-bold text-blog-text mb-4">
                State Management
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-blog-text mb-2">
                    React Query (TanStack Query)
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-blog-text-muted text-sm">
                    <li>서버 상태 관리 및 캐싱을 통한 API 호출 최적화 가능</li>
                    <li>자동 백그라운드 데이터 업데이트 및 동기화 구현 가능</li>
                    <li>로딩, 에러 상태 관리 및 무한 스크롤 구현 가능</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-blog-text mb-2">Redux</h4>
                  <ul className="list-disc list-inside space-y-1 text-blog-text-muted text-sm">
                    <li>
                      액션, 리듀서, 셀렉터를 포함한 전역 상태 관리 구현 가능
                    </li>
                    <li>
                      Redux-Thunk 미들웨어를 활용한 비동기 API 호출 처리 가능
                    </li>
                    <li>
                      Redux-Toolkit을 통한 보일러플레이트 코드 최소화 및 개발
                      효율성 향상 가능
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-blog-text mb-2">Recoil</h4>
                  <ul className="list-disc list-inside space-y-1 text-blog-text-muted text-sm">
                    <li>
                      Atom과 Selector를 이용한 복잡한 상태 로직 간소화 가능
                    </li>
                    <li>컴포넌트 간 상태 공유 및 업데이트 관리 가능</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-blog-text mb-2">Zustand</h4>
                  <ul className="list-disc list-inside space-y-1 text-blog-text-muted text-sm">
                    <li>
                      간편한 설정과 직관적인 API를 통한 경량 상태 관리 구현 가능
                    </li>
                    <li>
                      TypeScript와의 완벽한 호환성을 활용한 타입 안전 상태 관리
                      가능
                    </li>
                    <li>
                      미들웨어를 활용한 상태 지속성 및 개발자 도구 연동 가능
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Styling Skills Detail */}
            <div className="bg-blog-black border border-blog-grey rounded-lg p-6">
              <h3 className="text-xl font-bold text-blog-text mb-4">Styling</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-blog-text mb-2">
                    Tailwind CSS ⭐
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-blog-text-muted text-sm">
                    <li>
                      유틸리티 클래스를 활용한 효율적인 스타일링 구현 가능
                    </li>
                    <li>반응형 디자인 및 컴포넌트 기반 설계 빠른 구현 가능</li>
                    <li>
                      커스터마이징을 통한 프로젝트 맞춤형 테마 구성 및 적용 가능
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-blog-text mb-2">
                    Styled Components
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-blog-text-muted text-sm">
                    <li>
                      CSS-in-JS 방식을 활용한 컴포넌트 단위 스타일링 구현 가능
                    </li>
                    <li>props를 활용한 동적 스타일링 및 테마 적용 가능</li>
                    <li>Template Literal 문법을 통한 직관적인 CSS 작성 가능</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-blog-text mb-2">Emotion</h4>
                  <ul className="list-disc list-inside space-y-1 text-blog-text-muted text-sm">
                    <li>CSS-in-JS 라이브러리를 활용한 스타일링 구현 가능</li>
                    <li>
                      css prop과 styled API를 통한 유연한 스타일 적용 가능
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

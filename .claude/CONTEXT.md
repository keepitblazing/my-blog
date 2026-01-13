# Blog Project Context

## 프로젝트 구조
```
blog/
├── frontend/          # Next.js 15 (standalone output)
├── backend/           # NestJS + Drizzle ORM
├── deploy/            # nginx 설정, EC2 setup 스크립트
└── docker-compose.yml
```

## 도메인 & 인프라
- **Frontend**: https://keepitblazing.kr, https://www.keepitblazing.kr
- **Backend API**: https://api.keepitblazing.kr
- **EC2 IP**: 44.200.112.196
- **DNS**: Cloudflare (Proxy 활성화)

## EC2 환경변수 (.env)
```env
DB_USER=blog
DB_PASSWORD=blog1234
DB_NAME=blog
CORS_ORIGIN=https://keepitblazing.kr,https://www.keepitblazing.kr
NEXT_PUBLIC_API_URL=https://api.keepitblazing.kr
```

## Docker Compose 서비스
1. **postgres** (blog-db) - PostgreSQL 16
2. **backend** (blog-backend) - NestJS :4000
3. **frontend** (blog-frontend) - Next.js :3000

## 백엔드 API 구조
- Global prefix: `/api`
- Routes:
  - `GET /api/posts` - 포스트 목록
  - `GET /api/posts/:id` - 포스트 상세
  - `POST /api/posts` - 포스트 생성
  - `PUT /api/posts/:id` - 포스트 수정
  - `DELETE /api/posts/:id` - 포스트 삭제
  - `GET /api/posts/tag/:slug` - 태그별 포스트
  - `GET /api/tags` - 태그 목록
  - `GET /api/tags/search?q=` - 태그 검색
  - `GET /api/tags/with-count` - 태그 + 포스트 카운트
  - `GET /api/tags/slug/:slug` - 슬러그로 태그 조회
  - `POST /api/tags` - 태그 생성
  - `GET /api/visitors/count` - 일일 방문자
  - `GET /api/visitors/total` - 총 방문자
  - `POST /api/visitors/log` - 방문 로그
  - `GET /api/health` - 헬스체크
  - `POST /api/upload/image` - 이미지 업로드

## DB 스키마 (Drizzle)
```typescript
// posts - 테이블명: "post"
posts: id, title, content, category, isPrivate, createdAt, updatedAt

// tags - 테이블명: "tags"
tags: id, name, slug, createdAt

// postTags - 테이블명: "post_tags"
postTags: postId, tagId, createdAt

// dailyVisitors - 테이블명: "daily_visitors"
dailyVisitors: id, date, count, createdAt, updatedAt

// visitorLogs - 테이블명: "visitor_logs"
visitorLogs: id, visitorHash, sessionId, cookieId, ipAddress, userAgent, visitedAt, pagePath, isNewVisitor
```

## 현재 상태 & 다음 할 일
1. **DB 마이그레이션 필요** - 테이블이 없음
   ```bash
   sudo docker exec -it blog-backend npx drizzle-kit push
   ```

2. **Supabase 데이터 마이그레이션** - 로컬에서 export한 CSV 파일로 seed 실행 필요

3. **프론트엔드 재배포** - visitor POST 메서드 추가함

## 주요 변경사항 (2026-01-13)
- Supabase → NestJS API 전환 완료
- frontend/src/lib/api/ 클라이언트 생성
- frontend/src/app/api/check-admin/route.ts - IP 기반 관리자 체크
- frontend/src/app/api/visitor/route.ts - GET/POST 지원
- backend health, upload 모듈 추가
- backend tags search, with-count 엔드포인트 추가
- backend visitors total 엔드포인트 추가

## 유용한 명령어
```bash
# EC2 접속
ssh -i ~/.ssh/your-key.pem ubuntu@44.200.112.196

# Docker 로그
sudo docker logs blog-backend --tail 50
sudo docker logs blog-frontend --tail 50

# Docker 재시작
cd ~/blog && sudo docker compose down && sudo docker compose up -d --build

# DB 마이그레이션
sudo docker exec -it blog-backend npx drizzle-kit push

# DB 접속
sudo docker exec -it blog-db psql -U blog -d blog
```

## Cloudflare 설정
- DNS: A 레코드 (keepitblazing.kr, api.keepitblazing.kr → EC2 IP)
- CNAME: www → keepitblazing.kr
- SSL/TLS: Flexible 또는 Full
- Email Routing: keepitblazing@keepitblazing.kr 설정 가능

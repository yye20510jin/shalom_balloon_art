📌 Shalom Balloon Art

사용자가 사진, 글, 영상 등을 업로드하고 공유할 수 있는 개인형 블로그 플랫폼입니다.
React 기반 SPA 환경에서 Spring Boot REST API 서버와 통신하며
JWT 기반 인증과 권한 기반 접근 제어를 포함하고 있습니다.

🚀 프로젝트 개요
항목	내용
개발 기간	2025.XX ~ 진행 중
목적	SPA + REST + JWT 기반의 실무형 웹 서비스 구현
주요 기능	인증/인가, 게시글 CRUD, 파일 업로드, 관리자 페이지
🛠 기술 스택
영역	기술
Frontend	React, Vite, React Router
Backend	Spring Boot, Spring Security, JPA
DB	MySQL
인증 방식	JWT (+ BCrypt 암호화)
파일 저장소	Firebase Storage (이미지), YouTube API 예정
배포 예정	AWS / Render / Railway
🔨 현재 개발 진행 상태

✅ JWT 기반 로그인 구현

✅ ADMIN / USER 역할 분리 및 접근 제어 적용

✅ 게시글 상세 보기 구현

 게시글 CRUD 전체 기능

✅ Firebase Storage 이미지 업로드

 페이지네이션 및 정렬 기능

 배포 환경 구축

🧪 실행 방법 (로컬)
🔹 Backend (Spring Boot)
./mvnw spring-boot:run


기본 URL: http://localhost:8080

환경 변수 예시:

spring.datasource.url=jdbc:mysql://localhost:3306/shalom
jwt.secret=YOUR_SECRET_KEY

🔹 Frontend (React + Vite)
npm install
npm run dev


기본 URL: http://localhost:5173

.env 예시:

VITE_BACKEND_BASE_URL=http://localhost:8080
VITE_FIREBASE_STORAGE_BUCKET=...

📍 라우팅 구조
경로	설명	권한
/	메인 게시글 목록	Public
/login	USER / ADMIN 로그인	Public
/posts	게시글 목록 페이지	Public
/posts/postDetails/:id	게시글 상세	Public
/posts/new	글 작성	USER
/admin	관리자 페이지	ADMIN
🗄 DB & 엔티티 구조

User

Role (다대다)

Post

PostImage

Firebase Storage에는 물리 파일,
DB에는 파일 URL과 메타데이터 저장.

🔐 인증 구조

본 프로젝트는 JWT(JSON Web Token) 기반 인증을 사용하며
비밀번호는 BCrypt 단방향 해시로 저장됩니다.

로그인 처리 흐름
사용자 요청 → 권한 검증 → BCrypt로 비밀번호 비교
↓
권한 일치 시 JWT 발급 → 클라이언트 LocalStorage 저장
↓
인증 필요한 API 요청 시 Authorization 헤더에 Token 포함
↓
서버 JwtAuthenticationFilter에서 토큰 검증 → 접근 허용/차단

권한 정책
동작	USER	ADMIN
로그인	✅	✅
글 작성	✅	❌ (관리자 필요 ×)
게시글/관리 기능	❌	✅
🧩 주요 API 요약
Method	Endpoint	설명
POST	/api/auth/user/login	사용자 로그인
POST	/api/auth/admin/login	관리자 로그인
GET	/api/posts	게시글 목록 조회
GET	/api/posts/:id	게시글 상세 조회
POST	/api/posts	게시글 작성 (USER)
⚠️ 문제 해결 기록 (Troubleshooting)
문제	원인	해결
JSON 직렬화 중 StackOverflow 발생	JPA 양방향 연관 관계	DTO 사용 및 @JsonManagedReference / @JsonBackReference 적용
hasRole('USER','ADMIN') 문법 오류	SpEL 문법 오사용	hasAnyRole('USER','ADMIN') 로 수정
토큰 전달 시 403 발생	Authorization 헤더 미포함	authFetch()로 헤더 자동 설정
📌 향후 계획

🔧 게시글 수정/삭제 기능

📷 Firebase Storage 이미지 업로드 UI 개선

🔍 검색 / 정렬 / 필터링 기능

📦 클라우드(AWS 또는 Render) 배포

📝 CI/CD 파이프라인 구축

✨ Screenshots (추가 예정)

UI 완성 후 이미지 추가 계획
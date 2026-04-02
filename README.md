#🎈 Shalom Balloon Art

이미지, 글, 영상을 업로드하고 공유할 수 있는 개인형 콘텐츠 플랫폼입니다.

React 기반 SPA와 Spring Boot REST API로 구성된 웹 애플리케이션입니다.

---

## 1️⃣ 프로젝트 개요

 **개발 기간** : 2025.11 ~ 진행 중

 **목표** : 인증 / 인가, 데이터 관리, 파일 업로드를 포함한 실서비스 형태의 웹 애플리케이션 구현


## 2️⃣ 기술 스택

 **Frontend**: React, Vite, React Router  
 **Backend**: Spring Boot, Spring Security, JPA  
 **DB**: PostgreSQL 
 **인증**: JWT, BCrypt  
 **Storage**: Firebase Storage  
 **배포**: Render / Vercel  


## 3️⃣ 주요 기능
 - JWT 기반 인증 / 인가
 - 사용자 / 관리자 권한 분리
 - 게시글 CRUD
 - 이미지 업로드 (Firebase Storage)
 - 페이지네이션 및 정렬


## 4️⃣ 실행 방법
 **Backend (Spring Boot)**

```bash
./mvnw spring-boot:run
```
기본 URL: http://localhost:8080

환경 변수 예시:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/shalom
jwt.secret=YOUR_SECRET_KEY
```


**Frontend (React + Vite)**
```bash
npm install
npm run dev
```
기본 URL: http://localhost:5173

.env 예시:
```env
VITE_BACKEND_BASE_URL=http://localhost:8080
VITE_FIREBASE_STORAGE_BUCKET=...
```


## 5️⃣ API 예시
- `POST /api/auth/user/login` : 사용자 로그인  
- `GET /api/posts` : 게시글 목록 조회  
- `GET /api/posts/{id}` : 게시글 상세 조회  
- `POST /api/posts` : 게시글 작성  
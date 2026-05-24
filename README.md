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
### 사전 준비물   
1. Java 17
2. Node.js v20.19.5 (LTS)
3. Docker Desktop
---
**▪️ Docker**
1. PostgreSQL 서버 실행
```bash
docker run --name postgres-local -p 5432:5432 -e POSTGRES_PASSWORD=1234 -e POSTGRES_DB=shalom_local -d postgres:16
```
2. Redis 실행
```bash
docker run -d --name redis -p 6379:6379 redis:7-alpine
```

**▪️ Backend (Spring Boot)**

프로젝트의 '루트 폴더'에서 해당 명령어를 실행하여 서버를 구동합니다.

```bash
   # Git Bash / macOS / Linux 환경
   ./mvnw spring-boot:run

   # Windows CMD 환경
   mvnw spring-boot:run
```
기본 URL: http://localhost:8080

**▪️ Frontend (React + Vite)**

'frontend' 폴더에서 해당 명령어를 실행하여 서버를 구동합니다.
```bash
cd frontend
npm install
npm run dev
```
기본 URL: http://localhost:5173

## 5️⃣ 데모 테스트 계정

⚠️ 본 서비스는 회원가입 시 관리자의 최종 승인이 필요한 구조로 되어 있어, 원활한 기능 테스트를 위해 기본 관리자(Admin) 계정을 아래와 같이 공유합니다. 모든 승인 권한 및 콘텐츠 관리 기능을 자유롭게 테스트해 보실 수 있습니다.

ID : admin

Password: qW1@qW1@
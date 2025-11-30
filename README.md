# Shalom Balloon Art

사용자가 사진, 글, 영상 등을 업로드하고 공유할 수 있는 **개인형 블로그 플랫폼**입니다.  
React 기반 SPA 환경에서 Spring Boot REST API 서버와 통신하며,  
JWT 인증 방식과 권한 기반 접근 제어를 포함하고 있습니다.

---

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 개발 기간 | 2025.XX ~ 진행 중 |
| 개발 목적 | 실무형 웹 서비스 아키텍처(SPA + REST + JWT) 경험 |
| 주요 특징 | 인증/인가, 파일 업로드, 관리자 페이지, 게시글 CRUD |

---

## 기술 스택

| 분야        | 기술                                            |
|------------|------------------------------------------------|
| Frontend   | React, Vite, React Router                      |
| Backend    | Spring Boot, Spring Security, JPA             |
| DB         | MySQL                                         |
| 인증 방식   | JWT + BCrypt 암호화                           |
| 파일 저장소 | Firebase Storage(이미지), YouTube API 계획     |
| 배포(예정) | AWS / Render / Railway                        |

## 구현 기능

- [x] 로그인 및 JWT 기반 인증 처리
- [x] ADMIN / USER 권한 분리
- [ ] 게시글 CRUD
- [ ] Firebase Storage 이미지 업로드
- [ ] React Router 기반 페이지 이동

---

## 🔐 인증 구조

본 프로젝트의 인증 방식은 **JWT(JSON Web Token)** 기반이며,  
사용자 비밀번호는 **BCrypt 단방향 해싱** 방식으로 저장됩니다.

### 엔드포인트 분리 기반 로그인 설계

ADMIN 로그인(`/api/auth/admin/login`)과 USER 로그인(`/api/auth/user/login`)은
각각 `adminLogin()`, `userLogin()` Service 메서드를 사용합니다.

두 메서드는 공통으로
- 아이디 조회
- 비밀번호 검증(BCrypt)
- UserDetails 로드
- JWT 발급

을 수행하지만,

- `adminLogin()`에서는 계정이 USER 권한을 포함하면 예외를 발생시키고,
- `userLogin()`에서는 계정이 ADMIN 권한을 포함하면 예외를 발생시킵니다.

이를 통해 잘못된 권한으로 다른 로그인 화면을 이용하는 것을 방지합니다.

이 설계는 다음 목적을 가지고 구현되었습니다:

1. **보안 강화:** 관리자 권한이 일반 사용자 UI에서 노출되지 않도록 분리
2. **접근 제어 명확화:** 각 계정 타입별 UI/기능 및 API를 구분
3. **사용자 경험 향상:** 불필요한 기능 노출 제거

기능 흐름은 다음과 같습니다:

사용자 로그인 요청
↓
권한 검증 (ADMIN / USER)
↓
권한 일치 여부 확인
┌──────────────────────────────────┐
│ 일치(O) → JWT 발급 및 로그인 성공 │
└──────────────────────────────────┘
┌─────────────────────────────┐
│ 불일치(X) → 로그인 실패 처리 │
└─────────────────────────────┘

### 인증 흐름

1. 사용자가 로그인 정보를 입력하면 서버에서 DB에 저장된 암호화된 비밀번호(BCrypt)와 비교합니다.
2. 검증에 성공하면 서버는 **JWT Access Token**을 생성하여 클라이언트에 반환합니다.
3. 클라이언트는 발급받은 토큰을 **localStorage**에 저장합니다.
4. 인증이 필요한 요청 시, 클라이언트는 요청 헤더에  
   `Authorization: Bearer <token>` 형식으로 토큰을 포함합니다.
5. 서버는 요청이 들어올 때 **JWT 검증 필터(JwtAuthenticationFilter)** 를 통해 토큰의 유효성을 확인합니다.
6. 토큰이 유효하면 사용자의 권한(ADMIN/USER)을 SecurityContext에 저장하고,  
   해당 API에 접근할 수 있도록 허용합니다.
7. 토큰이 없거나 권한이 부족한 경우 서버는 401(Unauthorized) 또는 403(Forbidden) 상태 코드를 반환합니다.

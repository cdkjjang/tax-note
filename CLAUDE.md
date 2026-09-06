# CLAUDE.md — 세금노트 (tax-note)

연말정산·종합소득세·부가가치세·증여세 등 한 번쯤 마주치는 세금 계산을
계산기 4종과 가이드 글로 해결하는 애드센스 수익형 미니사이트. 생활반장 노트 시리즈.

## 스택·명령

- Next.js 16.2.10 (App Router) + TypeScript + Tailwind CSS 4. DB·로그인·결제 없음, 전부 정적.
- 개발 서버: 워크스페이스 `.claude/launch.json`의 `tax-note-dev` (포트 3700, preview_start 사용)
- 빌드: `npm run build` / 테스트: `npm test` (vitest 45개)
- Node는 포터블: 명령 앞에 `$env:Path = "E:\클로드\tools\node;$env:Path"` 필요
- 배포: `git push origin main` (Vercel 자동 배포)만 사용. 절차는 `DEPLOY.md`
- 도메인: tax.lifebanjang.com (허브 lifebanjang-hub의 `lib/notes.ts`에 등록)

## 구조

- `lib/date.ts` — 금액 유틸 (formatWon, formatKoreanMoney)
- `lib/tax-core.ts` — 소득세 공통 (기본세율 BRACKETS·incomeTaxByBase, 근로소득공제, 근로소득세액공제, floor10). year-end·income-tax가 공유
- 계산 엔진 + 테스트 (로직 수정 시 반드시 테스트 함께 갱신):
  - `lib/year-end.ts` 연말정산 환급/추가납부 (총급여→근로소득금액→소득공제→과세표준→세액공제→결정세액, 기납부와 비교). **간이 추정** — 자녀·주택·월세·교육비 세액공제 미반영, 신용카드 15% 대표율
  - `lib/income-tax.ts` 종합소득세 (소득금액→과세표준→산출세액→결정세액+지방세, 기납부와 정산)
  - `lib/vat.ts` 부가가치세 (공급가액↔세액↔합계 3방향, 세율 10% 일반과세)
  - `lib/gift-tax.ts` 증여세 (증여액−관계별 공제→과세표준→세율 10~50%→신고세액공제 3%)
- 가이드 글 **20편**: `lib/guides-1.ts`(연말정산·소득/세액공제·종합소득세 3편)·
  `guides-2.ts`(8편)·`guides-3/4/6~10.ts`·`guides-11.ts`(부가세·증여세 2편), `lib/guides.ts`(집계)

### 2026-09-06 가이드 통합 (26 → 20편)

애드센스가 "가치가 별로 없는 콘텐츠"로 두 번 반려했고, 원인 중 하나가 같은 주제를
여러 편이 — 심지어 여러 노트가 — 나눠 갖는 구조였다(워크스페이스 CLAUDE.md 8장).

- 같은 노트 안에서 흡수: `year-end-2026-changes` → `year-end-settlement-guide`,
  `freelancer-33-refund` → `income-tax-guide`, `when-register-business` → `vat-guide`,
  `family-living-expenses` → `gift-tax-guide`
- **노트 간 중복 해소** — 이 노트에서 내보낸 것 둘:
  `car-tax-deduction` → 자동차노트 `car-tax-annual`,
  `property-tax-guide` → 부동산노트 `property-tax-schedule`
- ⚠️ **반대로 급여노트가 이 노트로 보내는 301이 있다**
  (`salary/year-end-settlement` → `year-end-settlement-guide`).
  **이 슬러그를 바꾸면 급여노트 쪽이 조용히 404가 된다.** 저쪽 테스트로는 못 잡으므로
  `lib/guides.test.ts`가 이 슬러그의 존재를 명시적으로 고정해 둔다.
- 사라진 6개 슬러그는 `next.config.ts`의 `redirects()`가 301(308)로 보낸다. **지우지 말 것.**
- `lib/guides-5.ts`는 비어서 삭제됐다. **번호를 다시 쓰지 말 것** — 새 파일은 `guides-12.ts`부터.
- `lib/guides.test.ts`가 재발을 막는다 — 본문 하한(1,500자, 공백 제외 실측), 슬러그 중복,
  없는 글을 가리키는 `related`, 섹션 제목·FAQ 질문 중복, 부제 중복,
  리다이렉트 출발지가 살아나거나 목적지가 사라지는 경우, 노트 간 리다이렉트 2건의 존재.
- ⚠️ **글자 수 기준이 두 가지다.** 통합을 결정할 때 쓴 감사 수치는 소스의 문자열
  리터럴을 세는 느슨한 방식, 테스트의 `bodyLength`는 화면에 나가는 글자를 공백까지 빼고 센다.
  **감사 기준 2,000자 ≈ 테스트 기준 1,500자.**
- 계산기 페이지: `app/calc/{year-end,income-tax,vat,gift-tax}/page.tsx` — 각 페이지에 SEO 해설 + FAQPage JSON-LD
- 애드센스: `components/AdSlot.tsx` — `NEXT_PUBLIC_ADSENSE_CLIENT` 설정 전에는 아무것도 렌더링 안 함

## 주의사항 (개정 시 값·테스트 함께 갱신)

> 전 노트의 갱신 항목과 월별 일정은 워크스페이스 `E:\클로드\CLAUDE.md`의
> **"기준값 갱신 캘린더"** 참조.

- **4대보험 요율·기준소득월액 (`lib/year-end.ts`의 `INSURANCE_RATES`)**:
  **급여노트 `lib/insurance.ts`의 `RATES`와 같은 값이어야 한다.**
  요율은 매년 초 고시, 기준소득월액 상·하한은 매년 7월 조정.
  - 2026-08 점검에서 **이곳만 갱신되지 않아** 국민연금 4.5% · 건강 3.545% ·
    장기요양 12.95%(직전 연도 값)로 남아 있었다. 보험료 소득공제가 과소 계산돼
    세액이 실제보다 크게, 즉 "추가납부" 쪽으로 치우쳐 나왔다.
    당시 값들은 함수 안에 인라인이었고 **고정 테스트가 없어 30개 테스트가 전부 통과했다.**
  - 그래서 상수로 빼고 `year-end.test.ts`에 **리터럴 고정 테스트**를 붙였다.
    값을 고치면 이 테스트가 먼저 깨진다.
  - 허브 `lifebanjang-hub/lib/standards.ts`의 `alsoVerify`가 이 파일을 직접 읽어
    급여노트와 대조하므로, **한쪽만 고치면 허브 테스트도 깨진다.**
- **확정 전 개편안은 넣지 않는다**: 매년 여름 발표되는 세제개편안은 국회 심의에서
  바뀌거나 빠진다. 계산기에는 현행 법령만 넣고, 개편안은 가이드에서 "확정 전"으로 다룬다.
- **종합소득 기본세율**: 소득세법 제55조 개정 시 `lib/tax-core.ts`의 `INCOME_TAX_BRACKETS`
- **증여세율·증여재산공제**: 상속세및증여세법 개정 시 `lib/gift-tax.ts`의 `GIFT_BRACKETS`·`RELATION_DEDUCTION`. 혼인·출산 공제(1억)는 2024년 신설분
- **부가세율**: 현행 10%. `lib/vat.ts`의 `RATE`
- 각 계산기는 '간이 추정'이며 세무 자문이 아니라는 고지(계산기·Footer)를 유지할 것
- 소득·금액 정보는 브라우저에서만 처리(서버 미전송) — 개인정보처리방침에 명시된 대로 유지
- 브라우저 스크린샷은 이 환경에서 타임아웃 가능 — get_page_text/read_page로 검증
- PowerShell에서 `app/guide/[slug]` 경로는 `-LiteralPath` 사용 (대괄호가 와일드카드로 해석됨)

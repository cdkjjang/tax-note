# CLAUDE.md — 세금노트 (tax-note)

연말정산·종합소득세·부가가치세·증여세 등 한 번쯤 마주치는 세금 계산을
계산기 4종과 가이드 글로 해결하는 애드센스 수익형 미니사이트. 생활반장 노트 시리즈.

## 스택·명령

- Next.js 16.2.10 (App Router) + TypeScript + Tailwind CSS 4. DB·로그인·결제 없음, 전부 정적.
- 개발 서버: 워크스페이스 `.claude/launch.json`의 `tax-note-dev` (포트 3700, preview_start 사용)
- 빌드: `npm run build` / 테스트: `npm test` (vitest 30개)
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
- 가이드 글 5편: `lib/guides-1.ts`(연말정산·소득/세액공제·종합소득세 3)·`guides-2.ts`(부가세·증여세 2), `lib/guides.ts`(집계)
- 계산기 페이지: `app/calc/{year-end,income-tax,vat,gift-tax}/page.tsx` — 각 페이지에 SEO 해설 + FAQPage JSON-LD
- 애드센스: `components/AdSlot.tsx` — `NEXT_PUBLIC_ADSENSE_CLIENT` 설정 전에는 아무것도 렌더링 안 함

## 주의사항 (개정 시 값·테스트 함께 갱신)

- **종합소득 기본세율**: 소득세법 제55조 개정 시 `lib/tax-core.ts`의 `INCOME_TAX_BRACKETS`
- **증여세율·증여재산공제**: 상속세및증여세법 개정 시 `lib/gift-tax.ts`의 `GIFT_BRACKETS`·`RELATION_DEDUCTION`. 혼인·출산 공제(1억)는 2024년 신설분
- **국민연금 기준소득월액 상한**: 매년 7월 조정. `lib/year-end.ts`의 4대보험 추정에 사용(현재 637만)
- **부가세율**: 현행 10%. `lib/vat.ts`의 `RATE`
- 각 계산기는 '간이 추정'이며 세무 자문이 아니라는 고지(계산기·Footer)를 유지할 것
- 소득·금액 정보는 브라우저에서만 처리(서버 미전송) — 개인정보처리방침에 명시된 대로 유지
- 브라우저 스크린샷은 이 환경에서 타임아웃 가능 — get_page_text/read_page로 검증
- PowerShell에서 `app/guide/[slug]` 경로는 `-LiteralPath` 사용 (대괄호가 와일드카드로 해석됨)

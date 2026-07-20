# 세금노트 배포 가이드

## 도메인

- 운영 도메인: **tax.lifebanjang.com**
- 허브(lifebanjang.com)의 `lib/notes.ts`에 카드로 등록되어 연결됨

## 배포 절차

1. 변경 후 로컬 검증
   ```powershell
   $env:Path = "E:\클로드\tools\node;$env:Path"
   cd E:\클로드\tax-note
   npm test        # vitest 30개
   npm run build   # 프로덕션 빌드 성공 확인
   ```
2. 커밋·푸시 (한국어 커밋은 UTF-8 파일로 작성 후 `git commit -F`)
   ```powershell
   git add -A
   git commit -F commit-msg.txt
   git push origin main
   ```
3. Vercel이 `main` 푸시를 감지해 자동 배포. **CLI 직접 배포 금지.**

## Vercel 최초 설정 (1회)

1. Vercel에서 이 저장소를 새 프로젝트로 import (Framework: Next.js 자동 인식)
2. Settings → Domains에 `tax.lifebanjang.com` 추가, 안내되는 CNAME을 도메인 DNS에 등록
3. (애드센스 승인 후) Environment Variables에 `NEXT_PUBLIC_ADSENSE_CLIENT = ca-pub-XXXX` 추가 후 재배포

## 애드센스 활성화

- `NEXT_PUBLIC_ADSENSE_CLIENT` 환경변수가 있을 때만 `app/layout.tsx`의 로더와 `AdSlot`이 렌더링됨
- 각 배치 지점 slot 번호(예: `year-end-below-tool`)를 애드센스 콘솔에서 발급받아 `AdSlot`에 전달

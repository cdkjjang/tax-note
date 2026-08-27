/**
 * 이 노트의 계산기를 쓴 사람이 **다음에 마주칠 질문**과, 그 답이 있는
 * 다른 노트의 계산기.
 *
 * ⚠️ 이 파일은 워크스페이스 생성기로 만든다. 손으로 고치면 다음 생성 때 덮인다.
 *
 * 규칙 (components/RelatedTools.tsx 주석 참조):
 *   - 계산기마다 최대 3개. 페이지마다 내용이 달라야 한다.
 *   - 같은 노트 안의 계산기는 넣지 않는다.
 *   - "관련 계산기"가 아니라 그 사람이 실제로 다음에 겪는 일로 적는다.
 */
export type RelatedTool = {
  /** 그 사람이 다음에 던지는 질문 — 링크 텍스트가 된다 */
  question: string;
  /** 어느 노트인지 */
  note: string;
  /** 어떤 계산기인지 */
  tool: string;
  /** 전체 URL (다른 도메인이므로 절대 경로) */
  href: string;
};

export const RELATED_TOOLS: Record<string, RelatedTool[]> = {
  "/calc/year-end": [
    {
      question: "제 연봉이면 매달 실수령액이 얼마인가요",
      note: "급여노트",
      tool: "연봉 실수령액 계산기",
      href: "https://salary.lifebanjang.com/calc/salary",
    },
    {
      question: "학자금대출을 갚았는데 공제가 되나요",
      note: "학자금노트",
      tool: "교육비 세액공제 계산기",
      href: "https://hakjagum.lifebanjang.com/calc/deduction",
    },
    {
      question: "연금저축을 넣으면 얼마나 돌려받나요",
      note: "연금노트",
      tool: "연금저축 세액공제 계산기",
      href: "https://pension.lifebanjang.com/calc/savings",
    },
  ],
  "/calc/income-tax": [
    {
      question: "이 소득으로 대출이 얼마나 나오나요",
      note: "대출노트",
      tool: "DSR 계산기",
      href: "https://loan.lifebanjang.com/calc/dsr",
    },
    {
      question: "집을 팔았는데 양도세는 따로인가요",
      note: "부동산노트",
      tool: "양도소득세 계산기",
      href: "https://budongsan.lifebanjang.com/calc/transfer",
    },
    {
      question: "지역가입자 국민연금은 얼마인가요",
      note: "연금노트",
      tool: "국민연금 예상액 계산기",
      href: "https://pension.lifebanjang.com/calc/national",
    },
  ],
  "/calc/vat": [
    {
      question: "사업자등록을 하면 피부양자에서 빠지나요",
      note: "건강보험노트",
      tool: "피부양자 자격 계산기",
      href: "https://health.lifebanjang.com/calc/dependent",
    },
    {
      question: "사업소득으로 대출이 얼마나 나오나요",
      note: "대출노트",
      tool: "DSR 계산기",
      href: "https://loan.lifebanjang.com/calc/dsr",
    },
    {
      question: "사업용 차량 자동차세는 얼마인가요",
      note: "자동차노트",
      tool: "자동차세 계산기",
      href: "https://car.lifebanjang.com/calc/car-tax",
    },
  ],
  "/calc/gift-tax": [
    {
      question: "물려받는 것이면 상속세는 얼마인가요",
      note: "상속노트",
      tool: "상속세 계산기",
      href: "https://sangsok.lifebanjang.com/calc/tax",
    },
    {
      question: "증여받은 부동산 취득세는 얼마인가요",
      note: "부동산노트",
      tool: "취득세 계산기",
      href: "https://budongsan.lifebanjang.com/calc/acquisition",
    },
    {
      question: "상속은 언제까지 결정해야 하나요",
      note: "상속노트",
      tool: "상속 기한 D-day",
      href: "https://sangsok.lifebanjang.com/calc/deadline",
    },
  ],
};

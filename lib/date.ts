// 금액 유틸 — 세금 계산기는 날짜보다 금액 표시가 핵심이다.

/** 원 단위 금액을 "1,234,567원" 형태로 */
export function formatWon(n: number): string {
  return `${Math.round(n).toLocaleString("ko-KR")}원`;
}

/** 큰 금액을 "1억 2,340만원"처럼 사람이 읽기 쉬운 형태로 */
export function formatKoreanMoney(n: number): string {
  const won = Math.round(n);
  if (won === 0) return "0원";
  const sign = won < 0 ? "-" : "";
  const abs = Math.abs(won);
  const eok = Math.floor(abs / 100_000_000);
  const man = Math.floor((abs % 100_000_000) / 10_000);
  const rest = abs % 10_000;
  const parts: string[] = [];
  if (eok > 0) parts.push(`${eok.toLocaleString("ko-KR")}억`);
  if (man > 0) parts.push(`${man.toLocaleString("ko-KR")}만`);
  if (rest > 0 || parts.length === 0) parts.push(`${rest.toLocaleString("ko-KR")}`);
  return `${sign}${parts.join(" ")}원`;
}

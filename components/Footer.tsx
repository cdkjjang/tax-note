import Link from "next/link";
import FamilyLinks from "@/components/FamilyLinks";
import { SITE_NAME } from "@/lib/site";

const TOOL_LINKS = [
  { href: "/calc/year-end", label: "연말정산 환급 계산기" },
  { href: "/calc/income-tax", label: "종합소득세 계산기" },
  { href: "/calc/vat", label: "부가가치세 계산기" },
  { href: "/calc/gift-tax", label: "증여세 계산기" },
  { href: "/guide", label: "세금 가이드" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border-soft bg-card">
      <div className="mx-auto max-w-3xl px-4 py-8 text-sm text-muted">
        <nav aria-label="사이트 바로가기" className="mb-5">
          <p className="mb-2 font-semibold text-foreground">{SITE_NAME} 도구</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {TOOL_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <FamilyLinks />
        <p className="mb-3">
          {SITE_NAME}의 계산 결과는 세법·공개 요율을 정리한 참고용 추정치이며,
          세무 자문이 아닙니다. 실제 세액은 소득·공제 항목과 개별 사정에 따라
          달라지며, 정확한 신고·납부는 국세청 홈택스(hometax.go.kr)와 세무
          전문가를 통해 확인하세요.
        </p>
        <div className="flex gap-4">
          <Link href="/about" className="hover:text-accent">
            소개
          </Link>
          <Link href="/contact" className="hover:text-accent">
            문의
          </Link>
          <Link href="/terms" className="hover:text-accent">
            이용약관
          </Link>
          <Link href="/privacy" className="hover:text-accent">
            개인정보처리방침
          </Link>
        </div>
        <p className="mt-3">© {new Date().getFullYear()} {SITE_NAME}</p>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "소개",
  description:
    "세금노트는 연말정산·종합소득세·부가가치세·증여세 등 한 번쯤 마주치는 세금 계산을 계산기와 가이드로 정리한 생활 정보 서비스입니다.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="space-y-4 text-[15px] leading-relaxed">
      <h1 className="text-2xl font-extrabold">{SITE_NAME} 소개</h1>
      <p>
        {SITE_NAME}는 누구나 한 번쯤 마주치는 세금 계산을 해결하는 무료 도구
        모음입니다. 연말정산 환급금, 프리랜서·사업자의 종합소득세, 부가가치세,
        가족 간 증여세를 계산기로 바로 확인하고, 세금 상식을 가이드로 정리했습니다.
      </p>
      <p>
        모든 기준은 소득세법·상속세및증여세법·부가가치세법 등 공개된 세법과
        국세청 고시를 근거로 하며, 세율과 공제 한도가 개정되면 확인된 최신 값으로
        갱신해 운영합니다.
      </p>
      <p>
        다만 이 사이트의 정보는 일반적인 안내이며 세무 자문이 아닙니다. 실제
        세액은 소득·공제 항목과 개별 사정에 따라 달라지므로, 정확한 신고·납부는
        국세청 홈택스(hometax.go.kr)와 세무 전문가를 통해 확인하세요.
      </p>
      <p>
        입력한 금액·정보는 이용자의 브라우저 안에서만 계산되며 서버로
        전송·저장되지 않습니다. 회원가입도 없습니다. 문의는{" "}
        <a href="mailto:cdkjjang@gmail.com" className="text-accent underline-offset-4 hover:underline">
          cdkjjang@gmail.com
        </a>
        으로 보내주세요.
      </p>
      <p>
        <Link href="/" className="text-accent underline-offset-4 hover:underline">
          홈으로 →
        </Link>
      </p>
    </div>
  );
}

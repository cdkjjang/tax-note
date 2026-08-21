import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "소개",
  description:
    "세금노트는 연말정산·종합소득세·부가세·증여세를 계산기와 가이드로 정리한 생활 정보 서비스입니다. 근거와 갱신 방식, 계산하지 않는 것까지 밝혀 두었습니다.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="space-y-4 text-[15px] leading-relaxed">
      <h1 className="text-2xl font-extrabold">{SITE_NAME} 소개</h1>
      <p>
        {SITE_NAME}는 개인이 실제로 마주치는 세금 — <strong>연말정산·종합소득세·
        부가세·증여세</strong>를 계산하는 무료 도구 모음입니다. 회원가입도,
        개인정보 수집도 없습니다.
      </p>

      <h2 className="pt-2 text-lg font-bold">왜 이 네 가지인가</h2>
      <p>
        세금은 종류가 많지만, 대부분의 사람이 살면서 직접 신고하거나 정산하는 것은
        몇 개 되지 않습니다. 그 몇 개가 <strong>기한이 있고, 놓치면 가산세</strong>가
        붙습니다.
      </p>
      <ul className="ml-5 list-disc space-y-1.5">
        <li>
          <strong>연말정산</strong> — 직장인이 매년 겪는 것. 공제를 넣느냐 마느냐로
          결과가 크게 갈립니다
        </li>
        <li>
          <strong>종합소득세</strong> — 프리랜서·부업·중도 퇴사자. 5월에 직접
          신고해야 하는데 안 하고 넘어가는 경우가 많습니다
        </li>
        <li>
          <strong>부가가치세</strong> — 사업자라면 1년에 두 번. 간이과세와 일반과세의
          계산이 다릅니다
        </li>
        <li>
          <strong>증여세</strong> — 부모가 자녀에게 목돈을 줄 때. 공제 범위를 넘는지가
          기준입니다
        </li>
      </ul>

      <h2 className="pt-2 text-lg font-bold">근거와 갱신</h2>
      <p>
        모든 기준은 <strong>소득세법</strong>, <strong>부가가치세법</strong>,{" "}
        <strong>상속세 및 증여세법</strong>과 각 시행령을 근거로 합니다. 각 계산기
        페이지에 적용한 조문을 함께 표기하고, 세법이 개정되면 계산 로직과 설명을
        함께 고친 뒤 갱신일을 표시합니다.
      </p>
      <p>
        세율표와 공제 한도는 <strong>숫자를 그대로 고정하는 검증 테스트</strong>를
        두었습니다. 세율은 오래 그대로 있다가 한 번에 바뀌기 때문에, 바뀐 것을
        놓치기 쉽습니다.
      </p>

      <h2 className="pt-2 text-lg font-bold">확정되지 않은 개편안은 넣지 않습니다</h2>
      <p>
        이 사이트의 방침 중 가장 중요한 것입니다. 세제개편안은 해마다 발표되지만,{" "}
        <strong>국회 심의에서 바뀌거나 빠지는 일이 흔합니다.</strong>
      </p>
      <p>
        발표만 된 안을 미리 넣으면 계산기가 틀린 답을 냅니다. 그래서 계산기에는{" "}
        <strong>현행 법령만</strong> 반영하고, 개편안은 가이드에서
        &ldquo;확정 전&rdquo;이라고 밝혀 다룹니다. 통과된 뒤에 계산에 넣습니다.
      </p>

      <h2 className="pt-2 text-lg font-bold">계산하지 않는 것</h2>
      <p>
        세금은 범위가 넓어 경계를 분명히 두었습니다. 겹치는 영역은 해당 노트로
        보냅니다.
      </p>
      <ul className="ml-5 list-disc space-y-1.5">
        <li>
          <strong>부동산 취득세·양도세·보유세</strong> — 부동산노트 몫입니다
        </li>
        <li>
          <strong>상속세</strong> — 상속노트가 맡습니다. 증여세만 여기서 다룹니다
        </li>
        <li>
          <strong>교육비 세액공제</strong> — 학자금노트 몫이라 연말정산 계산기에
          넣지 않았습니다
        </li>
        <li>
          <strong>법인세</strong> — 개인이 마주치는 세금이 아니라 다루지 않습니다
        </li>
        <li>
          <strong>모든 공제 항목</strong> — 연말정산 계산기는 대표 공제만 반영한
          간이 추정입니다. 주택자금·월세·기부금 유형별 한도까지는 넣지 않았습니다
        </li>
      </ul>

      <h2 className="pt-2 text-lg font-bold">한계와 문의</h2>
      <p>
        이 사이트의 계산은 <strong>참고용 추정치</strong>이며 세무 자문이 아닙니다.
        개별 사정에 따라 결과가 크게 달라질 수 있으므로, 금액이 크다면 세무
        전문가와 상담하세요. 확정 사항은 <strong>국세청 홈택스</strong>와{" "}
        <strong>국세상담센터(126)</strong>에서 확인할 수 있습니다. 입력한 소득과
        금액은 브라우저 안에서만 계산되며 서버로 전송되지 않습니다.
      </p>
      <p>
        {SITE_NAME}는 생활반장(lifebanjang.com) 노트 시리즈의 하나입니다. 문의는{" "}
        <a
          href="mailto:cdkjjang@gmail.com"
          className="text-accent underline-offset-4 hover:underline"
        >
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

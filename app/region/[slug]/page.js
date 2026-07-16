import { notFound } from "next/navigation";
import { deadlineRank } from "../../lib/policyUtils";
import {
  REGIONS,
  getRegion,
  getLandingPolicies,
  isRegionSpecific,
  isNationwide,
} from "../../lib/landingConfig";
import LandingView from "../../components/LandingView";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const region = getRegion(slug);
  if (!region) return { title: "페이지를 찾을 수 없습니다 | 청년모아" };
  const title = `${region.name} 청년정책 총정리 | 청년모아`;
  const description = `${region.name} 지역 청년을 위한 지원 정책과, ${region.name}에서도 신청 가능한 전국 청년정책을 한곳에 모았습니다. 조건과 신청 방법을 쉽게 확인하세요.`;
  return {
    title: { absolute: title },
    description,
    keywords: [`${region.name} 청년정책`, `${region.name} 청년 지원금`, `${region.name} 청년 지원`],
    alternates: { canonical: `/region/${region.slug}` },
    openGraph: { title, description, url: `/region/${region.slug}` },
  };
}

export default async function RegionPage({ params }) {
  const { slug } = await params;
  const region = getRegion(slug);
  if (!region) notFound();

  const { policies } = await getLandingPolicies();
  const byDeadline = (a, b) =>
    deadlineRank(a.policy.deadline) - deadlineRank(b.policy.deadline);

  const primary = policies
    .filter((p) => isRegionSpecific(p, region.name))
    .map((policy) => ({ policy }))
    .sort(byDeadline);

  const secondary = policies
    .filter((p) => isNationwide(p))
    .map((policy) => ({ policy }))
    .sort(byDeadline);

  // 다른 지역으로 이동하는 내부 링크
  const related = REGIONS.filter((r) => r.slug !== region.slug).map((r) => ({
    href: `/region/${r.slug}`,
    label: r.name,
  }));

  return (
    <LandingView
      heading={`${region.name} 청년정책 모아보기`}
      intro={`${region.name}에 사는 청년이라면, ${region.name}시·도가 직접 운영하는 지역 전용 지원과 전국 어디서나 신청할 수 있는 정책을 모두 챙길 수 있어요. 아래에서 지금 모집 중인 정책을 확인하고, 내 조건에 맞는지 살펴보세요.`}
      primary={primary}
      primaryLabel={`${region.name} 지역 전용 지원`}
      secondary={secondary}
      secondaryLabel={`${region.name}에서도 신청 가능한 전국 지원`}
      relatedTitle="다른 지역도 둘러보기"
      related={related}
    />
  );
}

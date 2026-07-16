import { notFound } from "next/navigation";
import { deadlineRank } from "../../lib/policyUtils";
import {
  TOPICS,
  getTopic,
  getLandingPolicies,
} from "../../lib/landingConfig";
import LandingView from "../../components/LandingView";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return { title: "페이지를 찾을 수 없습니다 | 청년모아" };
  return {
    title: { absolute: topic.title },
    description: topic.description,
    keywords: topic.keywords,
    alternates: { canonical: `/topic/${topic.slug}` },
    openGraph: {
      title: topic.title,
      description: topic.description,
      url: `/topic/${topic.slug}`,
    },
  };
}

export default async function TopicPage({ params }) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  const { policies } = await getLandingPolicies();
  const primary = policies
    .filter((p) => topic.match(p))
    .sort((a, b) => deadlineRank(a.deadline) - deadlineRank(b.deadline))
    .map((policy) => ({ policy }));

  // 다른 주제로 이동하는 내부 링크
  const related = TOPICS.filter((t) => t.slug !== topic.slug).map((t) => ({
    href: `/topic/${t.slug}`,
    label: `${t.emoji} ${t.label}`,
  }));

  return (
    <LandingView
      heading={topic.h1}
      intro={topic.intro}
      primary={primary}
      primaryLabel="지금 모집 중인 정책"
      relatedTitle="다른 주제도 둘러보기"
      related={related}
    />
  );
}

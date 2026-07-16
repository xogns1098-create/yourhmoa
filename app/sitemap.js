import { SITE_URL } from "./lib/siteConfig";
import { fetchPolicyRefs } from "./lib/youthApi";

export default async function sitemap() {
  // 고정 페이지
  const staticRoutes = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/find`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ].map((r) => ({ ...r, lastModified: new Date() }));

  // 정책 상세 페이지 (검색 유입의 핵심)
  const refs = await fetchPolicyRefs({ pageSize: 500 });
  const policyRoutes = refs.map((ref) => ({
    url: `${SITE_URL}/policy/${ref.id}`,
    lastModified: ref.lastModified ? new Date(ref.lastModified) : new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...policyRoutes];
}

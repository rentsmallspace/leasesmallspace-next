import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo"

// AI and search crawlers we explicitly welcome.
// Granting access (rather than relying on "*") is the correct signal for
// AI-powered search indexes (ChatGPT, Claude, Perplexity, Google AI Overviews, Bing Copilot).
const AI_AND_SEARCH_CRAWLERS = [
  "Googlebot",
  "Googlebot-Image",
  "Google-Extended", // Google AI Overviews / Bard / Gemini training
  "Bingbot",
  "DuckDuckBot",
  "GPTBot", // OpenAI / ChatGPT
  "OAI-SearchBot", // ChatGPT search
  "ChatGPT-User", // ChatGPT browsing
  "ClaudeBot", // Anthropic crawler
  "anthropic-ai", // Anthropic legacy agent
  "Claude-Web", // Anthropic browsing
  "PerplexityBot",
  "Perplexity-User",
  "CCBot", // Common Crawl (feeds many AI training sets)
  "Applebot",
  "Applebot-Extended",
  "Amazonbot",
  "YandexBot",
  "Bytespider", // ByteDance / Doubao
]

export default function robots(): MetadataRoute.Robots {
  const rules: MetadataRoute.Robots["rules"] = [
    // Explicit allow for named crawlers, with admin + internal API paths blocked.
    ...AI_AND_SEARCH_CRAWLERS.map((userAgent) => ({
      userAgent,
      allow: "/",
      disallow: ["/admin", "/admin/", "/api", "/api/"],
    })),
    // Default for everyone else — same posture.
    {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/api", "/api/"],
    },
  ]

  return {
    rules,
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}

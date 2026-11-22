// update-latest-note.mjs
// One job: fill the "latest field note" slot (slot 3) in index.html with the
// newest dev.to post that is not already pinned in slots 1 and 2.
//
// Pinned posts are read from index.html itself: any essay card outside the
// latest-note markers counts as pinned. To change a pinned post, edit index.html.
//
// Deterministic: same feed in, same HTML out. No AI, no randomness.
// No dependencies: Node 20+ (built-in fetch).
//
// Exit codes: 0 = done (changed or not), 1 = something failed, file untouched.

import { readFile, writeFile } from "node:fs/promises";

const USERNAME = "earlgreyhot1701d";
const FEED_URL = `https://dev.to/api/articles?username=${USERNAME}&per_page=15`;
const INDEX_PATH = new URL("../../index.html", import.meta.url);
const START = "<!-- latest-note:start";
const END = "<!-- latest-note:end -->";
const MAX_SUMMARY = 280;

// Escape text for safe use inside HTML text and attribute values.
function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// House style: no em dashes. An em dash (U+2014) becomes ": ".
function noEmDash(text) {
  return String(text).replace(/\s*\u2014\s*/g, ": ");
}

// Trim a summary at a word boundary.
// dev.to cuts descriptions off mid-thought and adds "...". When that happens,
// keep only the complete sentences so the card never ends on a fragment.
function summarize(text) {
  let clean = noEmDash(String(text || "").replace(/\s+/g, " ")).trim();
  const truncated = /(\.\.\.|…)$/.test(clean) || clean.length > MAX_SUMMARY;
  if (truncated) {
    const head = clean.replace(/(\.\.\.|…)$/, "").slice(0, MAX_SUMMARY);
    const lastStop = Math.max(head.lastIndexOf(". "), head.lastIndexOf("! "), head.lastIndexOf("? "));
    if (lastStop > 40) {
      clean = head.slice(0, lastStop + 1);
    } else {
      clean = `${head.slice(0, head.lastIndexOf(" ")).replace(/[,;:.]$/, "")}…`;
    }
  }
  return clean;
}

// Long titles make card 3 much taller than the pinned cards. Drop a trailing
// parenthetical aside; the link still goes to the full post.
function cardTitle(title) {
  const t = noEmDash(title).trim();
  if (t.length <= 70) return t;
  const shorter = t.replace(/\s*\([^()]*\)\s*$/, "").trim();
  return shorter.length >= 20 ? shorter : t;
}

function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) throw new Error(`Bad date from dev.to: ${iso}`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

function tagLabel(tag) {
  const special = { ai: "AI", aws: "AWS", showdev: "Show DEV", buildinpublic: "Build in public", webdev: "Web dev", devchallenge: "DEV challenge" };
  return special[tag] || tag.charAt(0).toUpperCase() + tag.slice(1);
}

function buildCard(post) {
  const tags = Array.isArray(post.tag_list) ? post.tag_list : String(post.tag_list || "").split(",").map((t) => t.trim()).filter(Boolean);
  const kicker = ["Latest field note", ...tags.slice(0, 1).map(tagLabel)].join(" · ");
  const badge = `${formatDate(post.published_at)} · ${Number(post.reading_time_minutes) || 1} min read`;
  const summary = esc(summarize(post.description));
  return `        <a class="essay" href="${esc(post.url)}" target="_blank" rel="noreferrer">
          <div>
            <div class="essay-meta">
              <span class="micro">${esc(kicker)}</span>
              <span class="essay-badge">${esc(badge)}</span>
            </div>
            <h3>${esc(cardTitle(post.title))}</h3>
          </div>
          <div class="feed-container">
            <div class="feed-bar">
              <span><span class="feed-pulse"></span>In brief</span>
              <span>Pause on hover</span>
            </div>
            <div class="feed-track">
              <p class="feed-text">${summary}</p>
              <p class="feed-text">${summary}</p>
            </div>
          </div>
          <div class="essay-footer">
            <span>Read full field note</span>
            <span>→</span>
          </div>
        </a>
`;
}

async function loadPosts() {
  // Local testing: FEED_FIXTURE=path/to/posts.json skips the network.
  if (process.env.FEED_FIXTURE) {
    return JSON.parse(await readFile(process.env.FEED_FIXTURE, "utf8"));
  }
  let res;
  try {
    res = await fetch(FEED_URL, { headers: { accept: "application/json", "user-agent": "clewlabs-latest-note" } });
  } catch (err) {
    throw new Error(`Could not reach dev.to: ${err.message}`);
  }
  if (!res.ok) throw new Error(`dev.to answered ${res.status} ${res.statusText}`);
  return res.json();
}

function isValidPost(p) {
  return p && typeof p.title === "string" && p.title.trim()
    && typeof p.url === "string" && p.url.startsWith(`https://dev.to/${USERNAME}/`)
    && typeof p.published_at === "string";
}

async function main() {
  const html = await readFile(INDEX_PATH, "utf8");
  const start = html.indexOf(START);
  const end = html.indexOf(END);
  if (start === -1 || end === -1 || end < start) throw new Error("latest-note markers not found in index.html");

  const lineEnd = html.indexOf("\n", start) + 1;
  const outside = html.slice(0, start) + html.slice(end);
  const pinned = new Set([...outside.matchAll(/<a class="essay" href="([^"]+)"/g)].map((m) => m[1]));

  const posts = await loadPosts();
  if (!Array.isArray(posts)) throw new Error("dev.to response was not a list");

  const latest = posts
    .filter(isValidPost)
    .filter((p) => !pinned.has(p.url))
    .sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at))[0];

  if (!latest) throw new Error("No unpinned dev.to post found");

  const endLineStart = html.lastIndexOf("\n", end) + 1; // keep the END marker's own indentation
  const next = html.slice(0, lineEnd) + buildCard(latest) + html.slice(endLineStart);
  if (next === html) {
    console.log(`No change. Slot 3 already shows: ${latest.title}`);
    return;
  }
  await writeFile(INDEX_PATH, next, "utf8");
  console.log(`Updated slot 3: ${latest.title}`);
}

main().catch((err) => {
  console.error(`latest-note: ${err.message}`);
  process.exit(1);
});

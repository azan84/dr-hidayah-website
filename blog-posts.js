// ═══════════════════════════════════════════════════════════════
//  BLOG POSTS INDEX
//  -----------------------------------------------------------------
//  To add a new blog post:
//    1. Create the full-article HTML file (copy an existing
//       blog-*.html file and edit the content inside <div class="blog-content">).
//    2. Add ONE new object to the top of the array below.
//       Newest posts go first.
//
//  Fields:
//    file     – filename of the full-article HTML page
//    title    – post title (can include HTML entities)
//    tag      – category label shown as a pill badge
//    date     – display date, e.g. "November 2025"
//    readTime – e.g. "8 min read"
//    icon     – single emoji shown on the gradient thumbnail
//    excerpt  – first-paragraph teaser (HTML allowed)
// ═══════════════════════════════════════════════════════════════

const blogPosts = [
  {
    file: "blog-microalgae-vs-astrophage.html",
    title: "Microalgae vs. Astrophage: How Science Fiction Reimagines Our Green Energy Future",
    tag: "Sci-Fi \u00d7 Science",
    date: "April 2026",
    readTime: "7 min read",
    icon: "\uD83E\uDDEC",
    heroStyle: "background: radial-gradient(ellipse at 30% 25%, #1a1a3e 0%, transparent 55%), radial-gradient(ellipse at 70% 65%, #2d1854 0%, transparent 55%), linear-gradient(135deg, #0f0c29 0%, #1b1354 30%, #24243e 55%, #2d5e4e 80%, #5BBFB5 100%);",
    excerpt: "If you\u2019ve watched the <em>Project Hail Mary</em> movie recently, you probably walked away with one question: \u201CCan a tiny, single-celled organism really save a planet?\u201D While Astrophage is purely science fiction, we have a real-world counterpart right here on Earth: <strong>Microalgae</strong>&hellip;"
  },
  {
    file: "blog-saf-microalgae.html",
    title: "The Green Skies Ahead: Sustainable Aviation Fuel (SAF) and Microalgae",
    tag: "Sustainability",
    date: "November 2025",
    readTime: "8 min read",
    icon: "\u2708\uFE0F",
    excerpt: "The aviation industry currently faces a massive challenge: how to decarbonize a sector that heavily relies on energy-dense, liquid fossil fuels. While electric batteries and hydrogen show promise for ground transport, they are currently too heavy or bulky for long-haul flights. Enter Sustainable Aviation Fuel (SAF) &mdash; and one of its most promising, futuristic feedstocks: microalgae&hellip;"
  }
  // ── Add new posts above this line ──
];

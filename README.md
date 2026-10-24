# ♿ Accessibility Checker

> **Automated WCAG 2.1 compliance auditing tool** — scan any website for accessibility violations in seconds and get actionable fix guidance.

![Tech Stack](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![axe-core](https://img.shields.io/badge/axe--core-4.9-blue?style=flat-square)
![Puppeteer](https://img.shields.io/badge/Puppeteer-22-green?style=flat-square)
![WCAG 2.1](https://img.shields.io/badge/WCAG-2.1%20AA-purple?style=flat-square)

---

## 🚀 Features

- **Full page rendering** — uses Puppeteer to render JavaScript-heavy SPAs, not just static HTML
- **axe-core engine** — industry-standard accessibility testing, same engine used by Deque and Microsoft
- **WCAG 2.0/2.1 A & AA** — checks against all WCAG 2.0 and 2.1 Level A and AA success criteria
- **Impact-level prioritization** — violations sorted as Critical → Serious → Moderate → Minor
- **Expandable violation cards** — every issue shows: rule ID, description, WCAG tags, affected HTML elements, CSS selectors, and fix guidance
- **Filter by impact** — quickly focus on the most critical issues
- **Download report** — export the full structured report as JSON
- **SSRF protection** — blocks scanning of private IPs, localhost, and non-HTTP schemes
- **Accessible UI** — the tool itself passes its own accessibility scan (semantic HTML, aria-live, keyboard navigation, visible focus states)

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | JavaScript (ES2022+) |
| Browser Automation | Puppeteer 22 |
| Accessibility Engine | axe-core 4.9 |
| Styling | CSS Modules (no Tailwind) |
| Runtime | Node.js (server route handlers) |

---

## 📁 Project Structure

```
accessibility-checker/
├── app/
│   ├── layout.js              # Root layout with SEO metadata
│   ├── page.js                # Main page (client component)
│   ├── page.module.css        # Page styles
│   ├── globals.css            # Global design system
│   └── api/
│       └── scan/
│           └── route.js       # POST /api/scan endpoint
├── components/
│   ├── UrlForm.js             # URL input with example sites
│   ├── UrlForm.module.css
│   ├── SummaryCards.js        # Violation counts by impact
│   ├── SummaryCards.module.css
│   ├── ViolationList.js       # Filtered list of violations
│   ├── ViolationList.module.css
│   ├── ViolationItem.js       # Expandable violation card
│   ├── ViolationItem.module.css
│   ├── Loader.js              # Animated loading state
│   ├── Loader.module.css
│   ├── ErrorMessage.js        # Error display with tips
│   └── ErrorMessage.module.css
├── lib/
│   ├── scanner.js             # Puppeteer + axe-core scanning logic
│   ├── formatReport.js        # Formats raw axe results
│   └── validateUrl.js         # URL validation + SSRF protection
├── next.config.js             # Next.js config (puppeteer externals)
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## ⚡ Setup & Running

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# 1. Clone or enter the project directory
cd accessibility-checker

# 2. Install dependencies (Puppeteer will also download Chromium)
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:3000**

> **Note**: The first `npm install` downloads Chromium (~170MB) for Puppeteer. Subsequent installs use the cached version.

### Production Build

```bash
npm run build
npm start
```

---

## 🔍 How It Works

1. **User enters a URL** in the form (protocol is auto-added if missing)
2. **URL validation** checks for valid format, rejects private IPs and non-HTTP schemes
3. **POST /api/scan** is called with the validated URL
4. **Puppeteer** launches a headless Chromium browser, sets viewport to 1366×768
5. The page is navigated to with `waitUntil: 'networkidle2'` (30s timeout)
6. **axe-core source** is injected and `axe.run()` is called with WCAG 2.0/2.1 A+AA tags
7. Raw results are **formatted** into a clean report structure
8. The frontend renders **summary cards** and an **expandable violation list**
9. User can **filter** by impact level and **download** the report as JSON

---

## 🔒 Security

- **SSRF prevention**: Blocks `localhost`, `127.0.0.1`, RFC 1918 private ranges (`10.x`, `172.16-31.x`, `192.168.x`), link-local (`169.254.x`), and `file://` URLs
- **Protocol enforcement**: Only `http://` and `https://` are accepted
- **Browser sandboxing**: Puppeteer runs with `--no-sandbox` flags appropriate for containerized environments
- **Always closes browser**: `try/finally` ensures the browser is always cleaned up

---

## 📊 API Reference

### `POST /api/scan`

**Request:**
```json
{ "url": "https://example.com" }
```

**Response:**
```json
{
  "url": "https://example.com",
  "scannedAt": "2024-01-01T00:00:00.000Z",
  "summary": {
    "total": 3,
    "critical": 1,
    "serious": 1,
    "moderate": 1,
    "minor": 0,
    "passes": 47,
    "incomplete": 2,
    "inapplicable": 31
  },
  "violations": [
    {
      "id": "color-contrast",
      "impact": "serious",
      "description": "Ensures the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds",
      "help": "Elements must meet minimum color contrast ratio thresholds",
      "helpUrl": "https://dequeuniversity.com/rules/axe/4.9/color-contrast",
      "wcagTags": ["wcag2aa", "wcag143"],
      "nodes": [
        {
          "html": "<p class=\"muted\">Some text</p>",
          "target": [".muted"],
          "failureSummary": "Fix any of the following: Element has insufficient color contrast..."
        }
      ]
    }
  ]
}
```

**Error Response:**
```json
{ "error": "Could not reach \"https://badurl.xyz\". The domain does not exist." }
```

---

## ⚠️ Limitations

- Automated scanning catches ~57% of accessibility issues (Deque research)
- Dynamic content loaded after interaction (modals, dropdowns) may not be scanned
- Always complement with manual testing and assistive technology testing
- Some sites actively block headless browsers

---

## 📄 License

MIT

# Piyush Jadhav — Personal Brand Website

Personal brand website for **Piyush Anil Jadhav**, Founder & CEO of Imperion Data Systems Pvt. Ltd.

Built from scratch with a lean, high-performance stack.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML5, CSS3 (custom design system), ES6 JavaScript |
| Typography | Google Fonts — Inter |
| Backend API | Vercel Serverless Functions (Node.js) |
| Database | Supabase (PostgreSQL) |
| Email | Resend API |
| Analytics | Google Analytics 4 |
| Hosting | Vercel (CDN, SSL, CI/CD) |
| Version Control | GitHub |

---

## Project Structure

```
founder-website/
├── api/
│   └── submit-lead.js     # Serverless function — lead capture
├── assets/
│   ├── css/
│   │   └── styles.css     # Master design system
│   ├── js/
│   │   ├── nav.js         # Navigation, theme toggle
│   │   ├── animations.js  # Scroll reveal, counters, interactions
│   │   └── form.js        # Contact form handling
│   └── images/
│       ├── founder_piyush.webp
│       └── og-image.webp
├── index.html             # Home
├── about.html             # About
├── projects.html          # Projects & Case Studies
├── expertise.html         # Experience & Expertise
├── insights.html          # Media / Insights
├── contact.html           # Contact
├── sitemap.xml
├── robots.txt
└── vercel.json
```

---

## Pages

| Page | URL | Sections |
|---|---|---|
| Home | `/` | Hero, Trust Strip, Services, Featured Work, Philosophy, Process, Testimonials, CTA |
| About | `/about` | Hero, Origin Story, Education, Imperion Vision, Values, Timeline, Skills, Beyond Work, CTA |
| Projects | `/projects` | Hero, Featured Case Study, Project Grid, Technical Deep-Dive, Impact Metrics, CTA |
| Expertise | `/expertise` | Hero, Competency Cards, Tech Stack, Differentiation, Education, Consulting Models, Methodology, CTA |
| Insights | `/insights` | Hero, Featured Article, Article Grid, Company Updates, Newsletter, Speaking |
| Contact | `/contact` | Hero, Contact Form, Calendly Booking, Business Details, FAQ |

---

## Environment Variables

Set these in the Vercel Dashboard (never commit to git):

```
SUPABASE_URL          =
SUPABASE_ANON_KEY     =
RESEND_API_KEY        =
NOTIFY_EMAIL          =
FROM_EMAIL            =
```

---

## Development

No build step required. Open `index.html` directly in a browser, or use a local server:

```bash
# Using VS Code Live Server, or:
npx serve .
```

For the Vercel Serverless Function, install Vercel CLI and run:

```bash
npm i -g vercel
vercel dev
```

---

## Deployment

1. Push to GitHub: `github.com/mayankjndl/founder-website`
2. Connect repo to Vercel
3. Set environment variables in Vercel Dashboard
4. Deploy — Vercel handles SSL, CDN, and clean URLs automatically

---

## Placeholders to Replace Before Launch

- `#LINKEDIN_PLACEHOLDER` → Real LinkedIn profile URL
- `PLACEHOLDER@imperiondata.com` → Real email address
- `G-XXXXXXXXXX` → Real GA4 Measurement ID
- `https://piyushjadhav.com` → Real domain in canonical tags and OG URLs
- Calendly URL is already live: `https://calendly.com/info-imperiondatasystem/discovery-call`
- WhatsApp is already live: `+91 8308755482`

---

*Built with precision. No frameworks. No bloat.*

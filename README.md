# 🗂️ BD E-Commerce Order Parser

<div align="center">

![Gemini](https://img.shields.io/badge/AI--Powered-Gemini%202.0%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-Apache%202.0-green?style=for-the-badge)

**An AI-powered dashboard that parses Bengali e-commerce order texts into structured CSV data — instantly.**
Supports two shops in one app: **Borno Baby Shop** and **Proyojon.com**, each with their own product catalog, column structure, and live product management.

[Live Demo](https://github.com/somairhossain/BD-e-commerse-order-parser) · [Report a Bug](https://github.com/somairhossain/BD-e-commerse-order-parser/issues) · [Request Feature](https://github.com/somairhossain/BD-e-commerse-order-parser/issues)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [What's New](#-whats-new)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [How It Works](#-how-it-works)
- [Supported Shops & Columns](#-supported-shops--columns)
- [Getting Started](#-getting-started)
- [Deployment Guide](#-deployment-guide)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🧠 About the Project

BD E-Commerce Order Parser is an operational tool for e-commerce businesses that receive customer orders written in Bengali — from Facebook Messenger, WhatsApp, or social media group chats. Manually entering those orders into Google Sheets is slow and error-prone.

This app uses **Google Gemini 2.0 Flash** AI to read raw Bengali order messages and extract all key fields automatically, producing clean CSV rows ready to paste into Google Sheets. It supports two completely separate shops from one interface, switchable in a single click.

**Example Input (Bengali text):**
```
[6:28 PM, 10/12/2025] BBS. Upoma: +966 57 195 5041
৫১ পিছের কাঠের বড় সেট
বিল: ১৫৫০ টাকা
নাম:নুসরাত জাহান তারিন
এলাকার নাম: দিলালপুর শশের দীঘি
থানা: বাজিতপুর
জেলা: কিশোরগঞ্জ
মোবা:০১৭৯৫৩৪২৯১৭
```

**Example Output (CSV row for Google Sheets):**
```
966571955041,Saudi Arabia,Being Processed,,Nusrat Jahan Tarin,01795342917,"Dilalpur Shosher Dighi, Thana: Bajitpur, Dist: Kishoreganj",Kishoreganj,Bajitpur,51_Pcs_wooden_toy_set,,Upoma,1,1550
```

---

## 🆕 What's New

This is a major update from the original single-shop version. Key changes include:

- **Dual-shop dashboard** — Borno Baby Shop and Proyojon.com in one unified interface with sidebar navigation
- **Live Product Management** — Add or remove products from each shop's catalog directly in the app; changes save to browser storage and apply to AI instantly
- **Full dashboard UI** — Professional sidebar layout with environment switching, toolbar, animated extraction preview table, and raw CSV panel
- **Framer Motion animations** — Smooth transitions for notifications, error states, and list items
- **Modular codebase** — System prompts moved to `src/lib/prompts.ts`, product lists to `src/lib/constants.ts`
- **Standalone HTML version** — A single `order-parser.html` file that runs in any browser with no installation

---

## ✨ Features

- 🤖 **AI-Powered Parsing** — Uses Gemini 2.0 Flash to understand unstructured Bengali order text
- 🏪 **Two-Shop Support** — Borno Baby Shop (14 columns) and Proyojon.com (11 columns) from one interface
- ⚙️ **Live Product Management** — Add/remove products from each shop's catalog; changes apply to AI in real time
- 🌐 **Multi-Country Detection** — Detects order country from phone code (Bangladesh, Saudi Arabia, UAE, Qatar, Bahrain, Malaysia, Singapore, Oman)
- 📋 **Smart Product Matching** — Maps Bengali product descriptions to validated product catalogs with intelligent fuzzy rules
- 📍 **Address Extraction** — Extracts district, thana, and full phonetic English address
- 📊 **Live Preview Table** — Results display as a scrollable structured table with all columns
- 💻 **Raw CSV Panel** — Dark-mode code block showing raw CSV output for direct copying
- 📁 **Copy to Clipboard** — One-click copy of all parsed CSV rows
- 📦 **Batch Parsing** — Parse multiple orders from a single paste
- 🎨 **Professional Dashboard UI** — Sidebar navigation, toolbar, environment badges, animated notifications
- 📱 **Mobile Responsive** — Compact mobile header with shop switcher for phone use
- 🗃️ **Persistent Product Lists** — Custom product additions saved to localStorage per shop

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI framework |
| [TypeScript 5.8](https://www.typescriptlang.org/) | Type safety |
| [Vite 6](https://vitejs.dev/) | Build tool & dev server |
| [Tailwind CSS 4](https://tailwindcss.com/) | Styling |
| [Framer Motion 12](https://www.framer.com/motion/) | Animations & transitions |
| [Google GenAI SDK](https://www.npmjs.com/package/@google/genai) | Gemini 2.0 Flash API |
| [Lucide React](https://lucide.dev/) | Icons |

---

## ⚙️ How It Works

```
User selects shop (Borno Baby / Proyojon)
             ↓
User pastes Bengali order messages
             ↓
App builds system prompt with shop rules + current product catalog
             ↓
Prompt + order text sent to Gemini 2.0 Flash API
             ↓
AI extracts: name, phone, address, product, qty, price, salesperson...
             ↓
Results cleaned & displayed as structured table + raw CSV panel
             ↓
User copies CSV → pastes into Google Sheets
```

Each shop uses a separate system prompt with its own parsing rules, product catalog, column order, and salesperson parsing pattern (`BBS. [Name]:` for Borno, `Prjn. [Name]:` for Proyojon).

---

## 📊 Supported Shops & Columns

### 🔵 Borno Baby Shop — 14 Columns

| # | Column | Description |
|---|---|---|
| 1 | Order Person | Sender name or phone (+ removed) |
| 2 | Order Country | Detected from phone code |
| 3 | Order Status | Always "Being Processed" |
| 4 | Order ID | Blank |
| 5 | Name | Customer name in phonetic English |
| 6 | Mobile Number | Clean digits only |
| 7 | Detail Address | Full phonetic English address |
| 8 | District | District in English |
| 9 | Thana | Sub-district in English |
| 10 | Order Set | Matched product from BBS catalog |
| 11 | Note | Extra info, color, special instructions |
| 12 | Sales Person | Parsed from `BBS. [Name]:` pattern (default: Somair) |
| 13 | QTY | Quantity (default 1) |
| 14 | Total | Price in digits |

**Product Categories (85+ items):** Magnetic Sticks (36–128 pcs), Tents, Swimming Pools, Tricycles, Intelligence Books & Combos, Art Sets, RC Cars, Kitchen Sets, Wooden Toy Sets (14–80 pcs, 30+ variants), Aircraft, Drawing Tablets, Flash Cards, and more.

---

### 🟢 Proyojon.com — 11 Columns

| # | Column | Description |
|---|---|---|
| 1 | Order Person | Sender name or phone (+ removed) |
| 2 | Name | Customer name in phonetic English |
| 3 | Contact No | Main phone digits only |
| 4 | Detail Address | Full phonetic English address |
| 5 | District | District in English |
| 6 | Thana | Sub-district in English |
| 7 | Product Name | Matched product from Proyojon catalog |
| 8 | Note | Combos (Moon Ring, Heart Ring), urgent flags, alt numbers |
| 9 | Sales Person | Parsed from `Prjn. [Name]:` pattern |
| 10 | QTY | Quantity (default 1) |
| 11 | Total Bill | Price in digits |

**Product Categories (25 items):** Heart/Round/Square Mirrors (Big, Small, Medium), Love Mirror, Pen Mirror, Watch Mirror, Twin Love Mirror, HF, Heart Queen, Heart Queen New, Ring, Moon, Premium/Black/Red/Pink/Small Boxes (regular and new variants).

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A **Gemini API Key** — get one free at [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/somairhossain/BD-e-commerse-order-parser.git

# 2. Navigate into the project
cd BD-e-commerse-order-parser

# 3. Install dependencies
npm install
```

### Environment Setup

```bash
# 4. Create your local environment file
cp .env.example .env.local

# 5. Open .env.local and add your Gemini API key
GEMINI_API_KEY=your_actual_api_key_here
```

```bash
# 6. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment Guide

### Deploy to Vercel (Recommended)

Vercel is free, fast, and keeps your API key secure server-side.

**Step 1 — Push to GitHub**

```bash
git add .
git commit -m "Latest update"
git push origin main
```

**Step 2 — Connect to Vercel**

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"** → select your repository
3. Vercel auto-detects Vite → click **"Deploy"**

**Step 3 — Add your API Key**

1. Go to your project → **Settings → Environment Variables**
2. Add: Name = `GEMINI_API_KEY`, Value = your Gemini API key
3. Click **Save** → go to **Deployments** → **Redeploy**

Your app is live at `https://your-project.vercel.app` 🎉

**Important:** After deploying, go to **Settings → Deployment Protection** and set **Vercel Authentication to Off** so your team can access the app without a Vercel account.

---

### Deploy to Netlify

```bash
# Build locally
npm run build
```

1. Go to [netlify.com](https://netlify.com) → **"Add new site" → "Deploy manually"**
2. Drag and drop the `dist/` folder
3. Go to **Site Settings → Environment Variables** → add `GEMINI_API_KEY`
4. Trigger a redeploy

---

### Standalone HTML (No Installation)

A fully self-contained `order-parser.html` file is available that runs in any browser — no Node.js, npm, or installation needed. It includes both shops, product switching, and calls the Gemini API directly from the browser.

**To use it:**
1. Open `order-parser.html` in Chrome or Edge
2. Enter your Gemini API key in the app and click Save
3. Start parsing orders immediately

**To share with your team:**
- Upload to [Netlify Drop](https://app.netlify.com/drop) — drag the file and get a permanent public URL in 30 seconds, no account required
- Or share directly via Google Drive / WhatsApp

> ⚠️ **Security Note:** In the standalone HTML version, the API key is stored in browser localStorage. For a shared team tool where you don't want everyone to use their own key, the Vercel/Netlify deployment is recommended as the key stays server-side.

---

## 📁 Project Structure

```
BD-e-commerse-order-parser/
├── public/                        # Static assets
├── src/
│   ├── lib/
│   │   ├── constants.ts           # Default product lists for both shops
│   │   └── prompts.ts             # Gemini system prompt functions per shop
│   ├── services/
│   │   └── geminiService.ts       # Gemini API integration via @google/genai
│   ├── App.tsx                    # Main dashboard UI (sidebar, table, product manager)
│   ├── main.tsx                   # React entry point
│   └── index.css                  # Global styles
├── order-parser.html              # Standalone single-file version (no install needed)
├── .env.example                   # Environment variable template
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🤝 Contributing

Contributions are welcome!

**To add new products to a catalog:** edit `src/lib/constants.ts` and add your product name to `DEFAULT_BORNO_PRODUCTS` or `DEFAULT_PROYOJON_PRODUCTS`. You can also add products live in the app from the **Manage Products** settings page — no code edit needed.

**To modify parsing rules:** edit the system prompt functions in `src/lib/prompts.ts`.

```bash
git checkout -b feature/your-feature-name
git commit -m "Add: your change description"
git push origin feature/your-feature-name
# Then open a Pull Request
```

---

## 📄 License

Distributed under the Apache 2.0 License. See `LICENSE` for more information.

---

<div align="center">
  <p>Built with ❤️ for Borno Baby Shop & Proyojon.com · Powered by Google Gemini AI · © 2026</p>
</div>

# 🗂️ Bengali Order Parser

<div align="center">

![Bengali Order Parser](https://img.shields.io/badge/AI--Powered-Gemini%202.0%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-Apache%202.0-green?style=for-the-badge)

**An AI-powered tool that parses Bengali e-commerce order texts into structured CSV data — instantly.**

[Live Demo](#) · [Report a Bug](../../issues) · [Request Feature](../../issues)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [How It Works](#-how-it-works)
- [Supported Order Fields](#-supported-order-fields)
- [Supported Products](#-supported-products)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
- [Deployment Guide](#-deployment-guide)
  - [Deploy to Vercel (Recommended)](#deploy-to-vercel-recommended)
  - [Deploy to Netlify](#deploy-to-netlify)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🧠 About the Project

Bengali Order Parser is a specialized operational tool built for e-commerce businesses that receive customer orders written in Bengali text (e.g., from Facebook Messenger, WhatsApp, or social media). 

Manually copying order details into spreadsheets is slow and error-prone. This app uses **Google Gemini 2.0 Flash** AI to automatically read raw Bengali order messages and extract all key fields — customer name, phone number, address, product, quantity, price — and format them as clean CSV rows ready to paste into Google Sheets.

**Example Input (Bengali text):**
```
[4:17 PM, 4/22/2026] [Business Name]. Siddiq:+966 57 295 8753
নাম: মোঃ রাকিব হোসেন
মোবাইল: 01712345678
ঠিকানা: গ্রাম: চরমুগরিয়া, থানা: কালিহাতী, জেলা: টাঙ্গাইল
পণ্য: ৬০ পিস কাঠের খেলনা সেট
মূল্য: ১২৫০ টাকা
```

**Example Output (structured CSV):**
```
966572958753,Bangladesh,Being Processed,,Md. Rakib Hossain,01712345678,"Charmuguria, Thana: Kalihai, Dist: Tangail",Tangail,Kalihai,60_Pcs_new_wooden_toy_set,,Siddiq,1,1250
```

---

## ✨ Features

- 🤖 **AI-Powered Parsing** — Uses Gemini 2.0 Flash to understand unstructured Bengali text
- 🌐 **Multi-Country Support** — Detects order origin from phone codes (Bangladesh, Saudi Arabia, UAE, Qatar, Bahrain, Malaysia, Singapore, Oman)
- 📋 **Smart Product Matching** — Maps Bengali product descriptions to a validated product catalog
- 📍 **Address Extraction** — Pulls district, thana, and full address with phonetic English translation
- 📁 **CSV Export** — Copy to clipboard or download as `.csv` file with one click
- 📦 **Batch Processing** — Parse multiple orders at once from a single paste
- 🎨 **Clean UI** — Responsive card-based layout with smooth animations
- ⚡ **Fast** — Results appear in seconds

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI framework |
| [TypeScript 5.8](https://www.typescriptlang.org/) | Type safety |
| [Vite 6](https://vitejs.dev/) | Build tool & dev server |
| [Tailwind CSS 4](https://tailwindcss.com/) | Styling |
| [Google Gemini 2.0 Flash](https://ai.google.dev/) | AI order parsing |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Lucide React](https://lucide.dev/) | Icons |

---

## ⚙️ How It Works

```
User pastes Bengali order text
        ↓
App sends text to Gemini 2.0 Flash API
        ↓
Gemini extracts: name, phone, address, product, qty, price
        ↓
Results validated against product catalog
        ↓
Displayed as structured cards + CSV rows
        ↓
User copies/downloads CSV → pastes into Google Sheets
```

The AI uses a detailed system prompt with:
- **14 extraction rules** covering each CSV column
- **Phonetic transliteration** of Bengali names/addresses to English
- **Phone code → country** mapping
- **Product synonym mapping** (e.g., "ইন্টেলিজেন্স ২ ইন ১ বুক" → `Intellegence_Book_Combo_5`)

---

## 📊 Supported Order Fields

The parser outputs 14 structured fields per order:

| # | Column | Description |
|---|---|---|
| 1 | **Order Person** | Sender name or number |
| 2 | **Order Country** | Detected from phone code |
| 3 | **Order Status** | Always "Being Processed" |
| 4 | **Order ID** | Left blank (filled manually) |
| 5 | **Name** | Customer name in phonetic English |
| 6 | **Mobile Number** | Clean phone number |
| 7 | **Detail Address** | Full address in English |
| 8 | **District** | District in English |
| 9 | **Thana** | Sub-district in English |
| 10 | **Order Set** | Matched product from catalog |
| 11 | **Note** | Any special instructions |
| 12 | **Sales Person** | Extracted from order header |
| 13 | **QTY** | Quantity (default: 1) |
| 14 | **Total** | Price in digits |

---

## 📦 Supported Products

The parser recognizes **80+ products** across these categories:

- 🧲 Magnetic Sticks (36–128 pcs)
- ⛺ Tents (3ft, Medium, House, Castle)
- 🏊 Swimming Pools (34×10 to 210cm)
- 🚲 Tricycles & Combos
- 📚 Intelligence Books & Combos
- 🎨 Art Sets & Education Boards
- 🚗 RC Cars, Police Models, Drift Cars
- 🍳 Kitchen Sets (Smoke, Big, Dream, 20pcs)
- 🪵 Wooden Toy Sets (14–80 pcs, various types)
- ✈️ Aircraft, Drawing Tablets, Flash Cards & more

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A **Gemini API Key** — get one free at [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/bengali-order-parser.git

# 2. Navigate into the project
cd bengali-order-parser

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

Vercel is free, fast, and handles environment variables securely — your API key is never exposed to users.

**Step 1 — Push to GitHub**

```bash
# Initialize git (if not done already)
git init
git add .
git commit -m "Initial commit: Bengali Order Parser"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/bengali-order-parser.git
git branch -M main
git push -u origin main
```

**Step 2 — Connect to Vercel**

1. Go to [vercel.com](https://vercel.com) and sign up/log in with GitHub
2. Click **"Add New Project"**
3. Select your `bengali-order-parser` repository
4. Vercel will auto-detect Vite — click **"Deploy"**

**Step 3 — Add your API Key**

1. After deploy, go to your project → **Settings → Environment Variables**
2. Add a new variable:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** your Gemini API key
3. Click **Save**
4. Go to **Deployments** → click the 3-dot menu → **Redeploy**

Your app is now live at `https://your-project-name.vercel.app` 🎉

---

### Deploy to Netlify

**Step 1 — Build the project locally**

```bash
npm run build
```

This creates a `dist/` folder.

**Step 2 — Deploy on Netlify**

1. Go to [netlify.com](https://netlify.com) and sign up/log in
2. From the dashboard, click **"Add new site" → "Deploy manually"**
3. Drag and drop your `dist/` folder into the upload area
4. Your site is live instantly at a random Netlify URL

**Step 3 — Add your API Key**

1. Go to **Site Settings → Environment Variables**
2. Click **"Add a variable"**
   - **Key:** `GEMINI_API_KEY`
   - **Value:** your Gemini API key
3. Go to **Deploys** → **Trigger deploy → Deploy site**

---

> ⚠️ **Security Note:** Never commit your `.env.local` file or paste your API key directly in the code. Always use environment variables. The `.gitignore` file already excludes `.env.local` from git.

---

## 📁 Project Structure

```
bengali-order-parser/
├── public/                  # Static assets
├── src/
│   ├── services/
│   │   └── geminiService.ts # Gemini API calls & CSV parsing logic
│   ├── App.tsx              # Main UI component
│   ├── constants.ts         # Product catalog, CSV columns, AI system prompt
│   ├── main.tsx             # React entry point
│   └── index.css            # Global styles
├── .env.example             # Environment variable template
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🤝 Contributing

Contributions are welcome! To add new products to the catalog, edit the `ORDER_SET_VALIDATION` array in `src/constants.ts`.

1. Fork the repo
2. Create a branch: `git checkout -b feature/add-new-products`
3. Commit your changes: `git commit -m "Add new product variants"`
4. Push: `git push origin feature/add-new-products`
5. Open a Pull Request

---

## 📄 License

Distributed under the Apache 2.0 License. See `LICENSE` for more information.

---

<div align="center">
  <p>Built with ❤️ using Google Gemini AI · © 2026 Bengali Order Processing System</p>
</div>

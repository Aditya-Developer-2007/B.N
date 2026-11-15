# B.N Enterprises — MERN B2B Wholesale Cosmetic Dealer Platform

A sleek, minimal, and ultra-professional B2B Wholesale Web Application built on the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) for **B.N Enterprises**, an authorized Wholesale Cosmetic & Beauty Supply Dealer.

---

## 1. Design Philosophy: Swiss-Grid Minimalism
- **Borders:** Clean `1px solid #E5E7EB` hairline structural lines.
- **Color Palette:**
  - Primary Surface: Pure White (`#FFFFFF`)
  - Secondary Surface: Off-White / Zinc (`#FAFAFA`)
  - Primary Typography & Accents: Matte Charcoal / Zinc-900 (`#18181B`)
  - Muted Text: Cool Gray (`#71717A`)
- **Typography:** Geometric Sans-Serif (*Plus Jakarta Sans* / *Inter*) paired with Monospace (*JetBrains Mono*) for SKUs, MOQs, and contact numbers.

---

## 2. Project Architecture

```
CM/
├── client/                     # React Frontend (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Minimal header with wordmark & hotline
│   │   │   ├── Hero.jsx           # 2-col asymmetric hero + 3-stat strip
│   │   │   ├── Catalog.jsx        # Wholesale matrix with filter tabs & MOQs
│   │   │   ├── Process.jsx        # 3-step B2B procurement workflow
│   │   │   ├── InquiryForm.jsx    # Dual-submission RFQ form + address config
│   │   │   ├── Footer.jsx         # Minimalist Swiss grid footer
│   │   │   └── MobileActionBar.jsx# Sticky bottom bar (Call & WhatsApp)
│   │   ├── config/
│   │   │   └── business.js        # Single-source-of-truth business variables
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Node.js + Express.js + MongoDB API
│   ├── config/
│   │   └── db.js               # MongoDB connection with graceful fallback
│   ├── controllers/
│   │   ├── catalogController.js# GET /api/catalog (with fallback seed data)
│   │   └── inquiryController.js# POST /api/inquiries (saves & generates WhatsApp)
│   ├── models/
│   │   ├── Product.js          # Mongoose model for wholesale SKUs
│   │   └── Inquiry.js          # Mongoose model for B2B buyer leads
│   ├── routes/
│   │   ├── catalogRoutes.js
│   │   └── inquiryRoutes.js
│   ├── data/
│   │   └── seedData.js         # Built-in wholesale cosmetic catalog data
│   ├── server.js               # Express application entrypoint
│   └── package.json
│
└── package.json                # Root package with helper scripts
```

---

## 3. Quick Start & Execution

### Option A: Run the React Client (Vite Dev Server)
```powershell
cd client
npm run dev
```
The React frontend will be live at `http://localhost:3000`.

### Option B: Run the Express Backend
```powershell
cd server
npm start
```
The API server will be live at `http://localhost:5000`.

### Option C: Run Both from Root
```powershell
npm run client      # Starts Vite client
npm run server      # Starts Express server
```

---

## 4. Key Business Variables
All contact numbers and address placeholders are managed in a single file:
`client/src/config/business.js`:

```javascript
export const BUSINESS_CONFIG = {
  name: 'B.N Enterprises',
  phoneDisplay: '8527606769',
  phoneCall: 'tel:8527606769',
  waNumber: '918527606769',
  // Easily swap the address text here:
  addressPlaceholder: 'Address: To be updated — Contact 8527606769 for dispatch details',
  operatingHours: 'Mon – Sat: 10:00 AM – 8:00 PM (IST)',
};
```


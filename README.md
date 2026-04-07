# 📦 InventoryPro — Full-Stack Inventory Management System

InventoryPro is a production-style **MERN** inventory management platform with authentication, role-based access control, product lifecycle management, purchase/order workflows, reporting dashboards, invoice generation, and automated low-stock alerts.

> This repository contains:
>
> - `Frontend/` → React + Vite dashboard UI
> - `Backend/` → Express + MongoDB API

---

## ✨ Why this project matters

This is not just a CRUD demo. It models real business workflows:

- User authentication with access/refresh token flow
- Role-based access (`user`, `admin`)
- Product, customer, supplier, category, and unit management
- Purchase and order pipelines with status tracking
- PDF invoice generation
- Analytics endpoints for dashboard/stock/sales/purchases/top-products
- Weekly automated low-stock email scheduler

---

## 🧱 Tech Stack

### Frontend

- React 18
- Vite
- React Router
- Ant Design + Ant Design Plots + Recharts
- Tailwind CSS
- Axios

### Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT auth
- Multer + Cloudinary (image upload)
- Nodemailer (email)
- node-cron (scheduler)
- PDFKit (invoice generation)

---

## 🗂️ Project Structure

```text
IMS/
├── Frontend/                 # React app (UI + client logic)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── api/
│   │   └── context/
│   └── package.json
├── Backend/                  # Express API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── package.json
├── Backend/api.md            # Complete endpoint documentation
└── README.md
```

---

## 🚀 Core Modules

- **Auth & Account**: signup/login, refresh token, avatar update, email verification OTP, password reset/change flows
- **Master Data**: categories, units, products, customers, suppliers
- **Operations**: purchases, purchase returns, sales orders, order status transitions
- **Reports**:
  - dashboard KPIs
  - stock report
  - sales report
  - purchase report
  - top products
  - low stock alerts
- **Scheduler**: admin-controlled weekly low-stock email automation

---

## 🔐 Roles & Access

- **User**
  - Can perform CRUD on their own resources
  - Can access their own reports and analytics
- **Admin**
  - Can access all users' records
  - Can manage scheduler endpoints (`/scheduler/*`)

---

## ⚙️ Environment Variables

Create `Backend/.env`:

```env
# Server
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

# Email (Gmail SMTP)
SENDER_EMAIL=your_email@gmail.com
SENDER_PASSWORD=your_app_password
EMAIL_USER=your_email@gmail.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# App URLs
FRONTEND_URL=http://localhost:5173
TIMEZONE=Asia/Kolkata
```

Create `Frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:3001/api/v1
```

---

## 🧪 Run Locally

### 1) Backend

```bash
cd Backend
npm install
npm run dev
```

Backend health endpoints:

- `GET /` → service status
- `GET /api/v1/test` → API smoke check

### 2) Frontend

```bash
cd Frontend
npm install
npm run dev
```

Open: `http://localhost:5173`

---

## 📚 API Documentation

- Full endpoint list and API contract: [`Backend/api.md`](./Backend/api.md)

Base API prefix:

```text
/api/v1
```

---

## 📈 Reporting Features

The reports module supports data visualization for:

- Sales trends by date
- Top-selling products
- Purchase trends and supplier-wise analysis
- Inventory valuation and stock health
- Low-stock and out-of-stock monitoring

---

## 🧾 Invoice & Alerts

- **Invoice Generation**: order invoice PDF endpoint
- **Low Stock Alerts**:
  - Automated cron execution every Monday
  - Manual trigger endpoint for admin testing
  - Threshold configuration endpoint

---

## 🛠️ Available Scripts

### Frontend

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — lint code
- `npm run preview` — preview production build

### Backend

- `npm run dev` — start with nodemon
- `npm start` — start production server

---

## 🎯 Recruiter Highlights

If you are evaluating this project for hiring:

- Demonstrates end-to-end ownership of a business domain
- Includes secure auth design and RBAC
- Uses aggregate pipelines for analytics/reporting
- Handles asynchronous workflows (email + scheduler)
- Implements operational modules beyond basic CRUD
- Shows deployment awareness (CORS, cloud uploads, env-based behavior)

---

## 📸 UI Showcase

The visual walkthrough screenshots are still available in commit history and can be added to a dedicated docs page if needed.

---

## 🙌 Author

Built by **SuryaX2**.

If you’d like, I can also generate:

- a polished **Architecture Diagram** section
- a **Postman collection** + quickstart testing guide
- a **resume-ready project summary** snippet

# Portfolio & CMS Platform — Sulistio Murti Mulyono

A modern, high-performance, full-stack personal portfolio and content administration system engineered for **Sulistio Murti Mulyono (Tio)** — Connecting Business, Technology, Data, and People.

---

## 🌟 Tech Stack & Architecture

### **Frontend**
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Server & Client Components)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with Custom CSS Design Tokens & Dark/Light Mode Theme Provider
- **Animations**: [Framer Motion](https://www.framer-motion.dev/) (Scroll Reveal, Bento Micro-Interactions, Stagger Transitions)
- **Rich Text Editor**: [TipTap WYSIWYG](https://tiptap.dev/) (True visual editor with bold, heading, bullet, quote, and link tools)
- **Icons & UI**: [Lucide React](https://lucide.dev/), [Radix UI](https://www.radix-ui.com/), [Sonner Toast Notifications](https://sonner.emilkowal.ski/)
- **Typography**: `Plus Jakarta Sans` (Headings & Numbers) & `Inter` (Body & Navigation)

### **Backend**
- **Language & Runtime**: [Golang 1.26](https://go.dev/)
- **Framework**: [Gin Gonic Web Framework](https://gin-gonic.com/)
- **ORM & Database**: [GORM](https://gorm.io/) with MySQL 8.4
- **Security & Auth**: Dual Token Architecture (JWT Access Tokens + Rotating Refresh Tokens via HttpOnly Cookies & Bearer Headers), Bcrypt Password Encryption
- **Image Processing**: WebP Auto-Compression & Multi-Resolution Generation (Original, Medium, Thumbnail)
- **Background Worker**: Real-Time SSE / Queue Polling Cache Invalidation Worker

---

## 🚀 Key Features

### 1. 🌐 Public Experience
- **Dynamic Homepage**:
  - Animated Ambient Hero with key impact stats (97% Voter Turnout, IDR 1.7B Budget Managed, 65 Countries).
  - Selected Case Studies & Interactive Projects Showcase.
  - Interactive **Bento Competencies & Toolset Matrix** with proficiency badges.
  - Career Timeline, Accreditations, and SINTA/Scopus Scientific Publications.
- **Deep-Dive Case Study Pages**: Rich media galleries, structured project metadata, live demos, and repository links.
- **Dynamic Path-Based SEO**: Automatic `generateMetadata()` for all public routes (`/projects`, `/experiences`, `/skills`, `/certificates`, etc.) fully editable from Admin.
- **Mobile Responsive Drawer**: Clean 1-column mobile drawer with smooth Framer Motion open/close animations.

### 2. 🔐 Admin CMS Portal (`/admin`)
- **Clean Isolated Access**: Public pages contain no visible admin links; access is protected at `/admin/login` with automatic dashboard redirect for authenticated sessions.
- **Complete Content Management (CRUD)**:
  - **Projects & Categories**: Full WYSIWYG editor, auto-slug generator, multi-image upload, and category management.
  - **Work Experiences & Leadership**: Position, company, dates, description, and status.
  - **Certificates & Accreditations**: Credential URLs, issue dates, and issuers.
  - **Educations**: Degrees, institutions, GPA, and graduation years.
  - **Skills Matrix**: Proficiency percentages, category organizers, and tool badges.
  - **Academic Publications**: Journal titles, publication dates, and DOI indexers.
  - **Single-Door Media Library**: Centralized asset repository with instant upload preview, WebP compression, search, and direct image picker.
  - **Global Site Branding & SEO**: Editable website title, taglines, short bio, base location address, contact email, phone/WhatsApp, logo, browser favicon, footer copyright, and `robots.txt`.
  - **Account & Security Settings**: Live administrator name, login email update, and bcrypt password change.
- **100% Mobile & Tablet Responsive**: Off-canvas slide-over drawer, horizontally scrollable tabs, and flexible data tables.

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js** >= 18.x
- **Go** >= 1.26
- **MySQL Database** (e.g. Laragon / MySQL 8.4 on port `3306`)

---

### 1. Database Configuration
Create a new MySQL database:
```sql
CREATE DATABASE portofolio_tio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### 2. Backend Setup
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```
3. Ensure `.env` matches your MySQL credentials:
   ```env
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=portofolio_tio
   JWT_SECRET=tio_super_secure_jwt_secret_key_2026
   PORT=8080
   APP_ENV=development
   ```
4. Run migrations, seed master data, and start the backend:
   ```bash
   go run cmd/seed/main.go
   go run main.go
   ```
   *Backend server starts at `http://localhost:8080`.*

---

### 3. Frontend Setup
1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Copy environment configuration:
   ```bash
   cp .env.example .env.local
   ```
3. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   *Frontend web application starts at `http://localhost:3000`.*

---

## 🔑 Default Administrator Credentials

| Field | Value |
|---|---|
| **Login Portal** | `http://localhost:3000/admin/login` |
| **Email** | `admin@tiomurti.com` |
| **Password** | `Password123!` |

*(Credentials can be updated immediately inside the Admin Portal at **Site & SEO Settings ➔ Account & Security**).*

---

## 📄 License & Attribution
Designed & developed for **Sulistio Murti Mulyono**. All rights reserved.
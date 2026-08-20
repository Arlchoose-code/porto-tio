# Portfolio Web — Sulistio Murti Mulyono
# PROJECT PLAN

> Stack: Go (Gin + GORM) + Next.js (App Router) + MySQL
> DB Name: portofolio_tio | MySQL via Laragon

---

## OWNER PROFILE (dari dokumen)

- **Nama:** Sulistio Murti Mulyono (dipanggil Tio)
- **Title:** Digital Business & Project Management
- **Tagline:** Connecting Business, Technology, Data, and People to Deliver Impact.
- **Email:** tiomurti4@gmail.com
- **Phone:** +6281919844369
- **LinkedIn:** linkedin.com/in/sulistiomurtimulyono
- **Kota:** Bogor, Indonesia
- **GPA:** 3.72 — Institut Bisnis Nusantara, Finance Management (2020–2026)

---

## ARSITEKTUR UMUM

```
Browser → Next.js (App Router) → Backend Go API
                                       ↓
                                    MySQL DB
                                       ↓
                              Revalidation Worker (SSE)
                                       ↓
                              Next.js /api/revalidate
```

---

## DATABASE TABLES

| No | Table | Keterangan |
|----|-------|-----------|
| 1 | users | Admin login |
| 2 | sessions | Session tracking |
| 3 | personal_access_tokens | JWT refresh token |
| 4 | site_settings | Judul web, logo, favicon, footer, robots.txt |
| 5 | seo_settings | SEO per path (title, desc, og image, json-ld) |
| 6 | social_links | LinkedIn, GitHub, Instagram, dll |
| 7 | projects | Portfolio projects |
| 8 | project_categories | Kategori project |
| 9 | project_images | Gambar per project (multiple) |
| 10 | certificates | Sertifikat Tio |
| 11 | experiences | Pengalaman kerja |
| 12 | educations | Pendidikan |
| 13 | skills | Skill per kategori |
| 14 | skill_categories | Kategori skill |
| 15 | publications | Publikasi ilmiah (SINTA) |
| 16 | media | Media library |
| 17 | pages | Halaman statis bebas |
| 18 | revalidation_jobs | Queue SSE revalidation worker |

---

## BACKEND STRUCTURE

```
portfolio-backend/
├── cmd/worker/
│   └── main.go                        # Entry point worker SSE
├── config/
│   ├── config.go                      # Load .env
│   └── database.go                    # Koneksi GORM MySQL
├── controllers/
│   ├── admin/
│   │   ├── auth.go                    # login, logout, refreshToken, me
│   │   ├── site_setting.go            # getSiteSetting, updateSiteSetting
│   │   ├── seo_setting.go             # getSeoSetting, updateSeoSetting
│   │   ├── social_link.go             # CRUD social link
│   │   ├── project.go                 # CRUD project
│   │   ├── project_category.go        # CRUD project category
│   │   ├── project_image.go           # upload, delete, reorder
│   │   ├── certificate.go             # CRUD certificate
│   │   ├── experience.go              # CRUD experience
│   │   ├── education.go               # CRUD education
│   │   ├── skill.go                   # CRUD skill
│   │   ├── skill_category.go          # CRUD skill category
│   │   ├── publication.go             # CRUD publication
│   │   ├── media.go                   # list, upload, delete media
│   │   └── page.go                    # CRUD page
│   └── public/
│       ├── project.go                 # listProject, getProjectBySlug
│       ├── certificate.go             # listCertificate
│       ├── experience.go              # listExperience
│       ├── education.go               # listEducation
│       ├── skill.go                   # listSkill
│       ├── publication.go             # listPublication
│       ├── page.go                    # getPageBySlug
│       ├── seo.go                     # getSeoByPath
│       └── settings.go                # getSiteInfo
├── database/
│   ├── migration.go
│   └── seeder.go                      # Seed user admin default
├── middlewares/
│   ├── auth.go                        # Validasi JWT httponly cookie
│   ├── cors.go                        # Whitelist Next.js origin
│   ├── role.go                        # Cek role admin
│   ├── upload.go                      # Validasi mime + magic bytes + size
│   └── requestid.go                   # Inject request ID
├── models/
│   ├── user.go
│   ├── session.go
│   ├── personal_access_token.go
│   ├── site_setting.go
│   ├── seo_setting.go
│   ├── social_link.go
│   ├── project.go
│   ├── project_category.go
│   ├── project_image.go
│   ├── certificate.go
│   ├── experience.go
│   ├── education.go
│   ├── skill.go
│   ├── skill_category.go
│   ├── publication.go
│   ├── media.go
│   ├── page.go
│   └── revalidation_job.go
├── routes/
│   ├── admin.go
│   ├── public.go
│   └── helpers.go
├── services/
│   ├── auth_service.go                # JWT generate, validate, refresh
│   ├── image_service.go               # Upload + convert ke WebP
│   ├── image_processor.go             # Resize thumbnail/medium/original
│   ├── slug_service.go                # Auto generate slug dari title, unique
│   ├── seo_service.go                 # Auto generate SEO + JSON-LD
│   ├── revalidate_service.go          # Insert job ke revalidation_jobs
│   ├── sanitize_service.go            # Sanitize HTML dari Tiptap
│   ├── token_service.go               # Manage refresh token di DB
│   └── security_service.go            # Magic bytes check, mime validation
├── structs/
│   ├── auth_struct.go
│   ├── site_setting_struct.go
│   ├── seo_setting_struct.go
│   ├── social_link_struct.go
│   ├── project_struct.go
│   ├── certificate_struct.go
│   ├── experience_struct.go
│   ├── education_struct.go
│   ├── skill_struct.go
│   ├── publication_struct.go
│   ├── media_struct.go
│   ├── page_struct.go
│   ├── revalidation_struct.go
│   ├── common_struct.go               # Response, ResponseWithMeta, Meta, helpers
│   └── pagination_struct.go
├── workers/
│   └── revalidation_worker.go         # Poll jobs, hit Next.js SSE, retry logic
├── storage/
│   └── media/
│       ├── originals/
│       ├── medium/
│       └── thumbnails/
├── .env.example
├── .air.toml
├── go.mod
├── go.sum
└── main.go
```

---

## FRONTEND STRUCTURE

```
portfolio-frontend/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx                 # Load site settings, inject meta global
│   │   ├── page.tsx                   # Home
│   │   ├── projects/
│   │   │   ├── page.tsx               # List project
│   │   │   └── [slug]/
│   │   │       ├── page.tsx           # Detail project
│   │   │       └── opengraph-image.tsx
│   │   ├── certificates/page.tsx
│   │   ├── experiences/page.tsx
│   │   ├── educations/page.tsx
│   │   ├── skills/page.tsx
│   │   ├── publications/page.tsx
│   │   └── [slug]/page.tsx            # Halaman statis
│   ├── (admin)/
│   │   └── admin/
│   │       ├── layout.tsx             # Sidebar, header, auth guard
│   │       ├── login/page.tsx
│   │       ├── dashboard/page.tsx
│   │       ├── projects/
│   │       │   ├── page.tsx           # DataTable list
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/
│   │       │       ├── edit/page.tsx
│   │       │       └── preview/page.tsx
│   │       ├── certificates/
│   │       │   ├── page.tsx
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/edit/page.tsx
│   │       ├── experiences/
│   │       │   ├── page.tsx
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/edit/page.tsx
│   │       ├── educations/
│   │       │   ├── page.tsx
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/edit/page.tsx
│   │       ├── skills/
│   │       │   ├── page.tsx
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/edit/page.tsx
│   │       ├── publications/
│   │       │   ├── page.tsx
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/edit/page.tsx
│   │       ├── pages/
│   │       │   ├── page.tsx
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/
│   │       │       ├── edit/page.tsx
│   │       │       └── preview/page.tsx
│   │       ├── media/page.tsx         # Media library + infinite scroll
│   │       └── settings/page.tsx      # Site, SEO, sosmed, favicon, logo, footer
│   ├── api/
│   │   └── revalidate/route.ts        # Terima trigger dari backend worker
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── icon.tsx
│   ├── opengraph-image.tsx
│   ├── not-found.tsx
│   ├── error.tsx
│   └── layout.tsx
├── components/
│   ├── ui/                            # shadcn/ui components
│   ├── shared/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── MediaLibrary.tsx
│   │   ├── RichEditor.tsx
│   │   ├── SkeletonCard.tsx
│   │   ├── BreadcrumbWithJsonLD.tsx
│   │   ├── ErrorSection.tsx
│   │   ├── ConfirmDialog.tsx
│   │   └── PreviewBanner.tsx
│   └── admin/
│       ├── Sidebar.tsx
│       ├── AdminHeader.tsx
│       ├── DataTable.tsx
│       ├── FormWrapper.tsx
│       ├── ImageUploadField.tsx
│       ├── SlugField.tsx
│       └── StatusBadge.tsx
├── lib/
│   ├── api/
│   │   ├── client.ts
│   │   ├── auth.ts
│   │   ├── projects.ts
│   │   ├── certificates.ts
│   │   ├── experiences.ts
│   │   ├── educations.ts
│   │   ├── skills.ts
│   │   ├── publications.ts
│   │   ├── media.ts
│   │   ├── pages.ts
│   │   ├── settings.ts
│   │   └── seo.ts
│   └── validations/
│       ├── auth.schema.ts
│       ├── project.schema.ts
│       ├── certificate.schema.ts
│       ├── experience.schema.ts
│       ├── education.schema.ts
│       ├── skill.schema.ts
│       ├── publication.schema.ts
│       ├── media.schema.ts
│       ├── page.schema.ts
│       └── settings.schema.ts
├── types/
│   ├── auth.ts
│   ├── project.ts
│   ├── certificate.ts
│   ├── experience.ts
│   ├── education.ts
│   ├── skill.ts
│   ├── publication.ts
│   ├── media.ts
│   ├── page.ts
│   ├── seo.ts
│   ├── settings.ts
│   ├── common.ts
│   └── pagination.ts
├── .env.local.example
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## API RESPONSE FORMAT (WAJIB SEMUA ENDPOINT)

### Success Single
```json
{ "status": true, "message": "...", "data": { } }
```

### Success List + Pagination
```json
{
  "status": true,
  "message": "...",
  "data": [ ],
  "meta": { "page": 1, "per_page": 10, "total": 47, "total_pages": 5 }
}
```

### Error
```json
{ "status": false, "message": "...", "data": null }
```

### Validation Error
```json
{ "status": false, "message": "Validation failed", "errors": { "field": "msg" }, "data": null }
```

---

## QUERY PARAMS PAGINATION

```
?page=1&per_page=10&search=keyword&sort=created_at&order=desc
```

---

## AUTH STRATEGY

- Access token: JWT, httponly cookie, expire 15 menit
- Refresh token: random string, DB + httponly cookie, expire 7 hari
- Rotate refresh token setiap digunakan
- Logout: hapus cookie + hapus refresh token dari DB

---

## IMAGE STRATEGY

- Upload → validasi mime (magic bytes) → convert ke WebP
- Generate 3 ukuran: thumbnail (max 400px), medium (max 900px), original (max 1920px)
- Simpan di storage/media/{thumbnails,medium,originals}/
- Response kembalikan 3 URL

---

## REVALIDATION WORKER STRATEGY

```
Admin mutasi data
  → Insert ke revalidation_jobs (status: pending)
  → Worker poll setiap 2 detik
  → Ambil job pending / failed (attempts < max_attempts=3)
  → Set status: processing
  → POST ke Next.js /api/revalidate (dengan REVALIDATE_SECRET)
  → Sukses → status: done
  → Gagal → attempts++, status: failed, simpan error
  → attempts >= 3 → berhenti retry
```

---

## REVALIDATE MAPPING PER DOMAIN

| Domain | Paths yang di-revalidate |
|--------|--------------------------|
| project | /projects, /projects/{slug}, / |
| certificate | /certificates |
| experience | /experiences |
| education | /educations |
| skill | /skills |
| publication | /publications |
| page | /{slug} |
| site_setting | / (semua, karena navbar/footer) |
| seo_setting | path yang di-update |
| social_link | / (footer) |

---

## ENVIRONMENT VARIABLES

### Backend .env
```
APP_ENV=development
APP_PORT=8080
APP_URL=http://localhost:8080
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=portofolio_tio
JWT_SECRET=your_jwt_secret_here
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=168h
STORAGE_PATH=./storage/media
NEXTJS_URL=http://localhost:3000
NEXTJS_REVALIDATE_SECRET=your_revalidate_secret_here
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend .env.local
```
NEXT_SERVER_API_URL=http://localhost:8080/api
REVALIDATE_SECRET=your_revalidate_secret_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## LIBRARY

### Backend (Go)
- gin, gorm, golang-jwt/jwt, disintegration/imaging, google/uuid, joho/godotenv

### Frontend (Next.js)
- next-themes, shadcn/ui, tailwindcss
- react-hook-form + zod
- sonner (toast)
- @tiptap/react + extensions
- react-intersection-observer
- date-fns

---

## URUTAN PENGERJAAN (77 Task)

### FASE 1 — BACKEND FOUNDATION
- [ ] T01: Setup Go project, go.mod, folder structure
- [ ] T02: Config (load .env, database connection GORM)
- [ ] T03: Migration semua 18 table
- [ ] T04: Seeder user admin default
- [ ] T05: common_struct (Response, ResponseWithMeta, helpers)
- [ ] T06: pagination_service
- [ ] T07: security_service (magic bytes, mime validation)
- [ ] T08: slug_service (auto generate dari title, unique check)
- [ ] T09: image_service + image_processor (WebP convert, 3 ukuran)
- [ ] T10: auth_service + token_service
- [ ] T11: Auth middleware (JWT httponly cookie)
- [ ] T12: CORS middleware
- [ ] T13: Auth controller (login, logout, refreshToken, me)
- [ ] T14: Routes setup (admin + public)
- [ ] T15: revalidate_service (insert job ke DB)
- [ ] T16: Revalidation worker (poll, retry, hit Next.js)

### FASE 2 — BACKEND CRUD
- [ ] T17: Project + project_category + project_image (admin + public)
- [ ] T18: Certificate (admin + public)
- [ ] T19: Experience (admin + public)
- [ ] T20: Education (admin + public)
- [ ] T21: Skill + skill_category (admin + public)
- [ ] T22: Publication (admin + public)
- [ ] T23: Media (upload, list, delete)
- [ ] T24: Page statis (admin + public)
- [ ] T25: Site setting (admin + public)
- [ ] T26: SEO setting (admin + public)
- [ ] T27: Social link (admin + public)
- [ ] T28: seo_service (auto generate SEO + JSON-LD)

### FASE 3 — FRONTEND FOUNDATION
- [ ] T29: Setup Next.js, install semua library, folder structure
- [ ] T30: next-themes setup
- [ ] T31: shadcn/ui init + komponen dasar
- [ ] T32: API client (lib/api/client.ts, semua api modules)
- [ ] T33: Types semua domain
- [ ] T34: Zod schemas semua domain
- [ ] T35: Auth admin (login page + auth guard di layout)
- [ ] T36: Sidebar + AdminHeader
- [ ] T37: DataTable component (reusable, pagination, search)
- [ ] T38: ConfirmDialog component
- [ ] T39: MediaLibrary component (modal, infinite scroll, upload + pilih)
- [ ] T40: RichEditor component (Tiptap)
- [ ] T41: SlugField component (auto-generate, warning kalau diubah)
- [ ] T42: ImageUploadField component
- [ ] T43: StatusBadge component

### FASE 4 — FRONTEND ADMIN CRUD
- [ ] T44: Admin Projects (list + create + edit + preview)
- [ ] T45: Admin Certificates
- [ ] T46: Admin Experiences
- [ ] T47: Admin Educations
- [ ] T48: Admin Skills + Categories
- [ ] T49: Admin Publications
- [ ] T50: Admin Pages (list + create + edit + preview)
- [ ] T51: Admin Media Library halaman
- [ ] T52: Admin Settings (site, SEO global, sosmed, favicon, logo, footer)

### FASE 5 — FRONTEND PUBLIC
- [ ] T53: Layout public (Navbar + Footer dari settings)
- [ ] T54: Home page
- [ ] T55: Projects list + detail
- [ ] T56: Certificates page
- [ ] T57: Experiences page
- [ ] T58: Educations page
- [ ] T59: Skills page
- [ ] T60: Publications page
- [ ] T61: Page statis [slug]

### FASE 6 — FITUR LANJUTAN
- [ ] T62: sitemap.ts (auto generate dari backend)
- [ ] T63: robots.ts (dari site_settings)
- [ ] T64: icon.tsx (favicon dari site_settings)
- [ ] T65: OG Image dynamic per halaman (ImageResponse)
- [ ] T66: Skeleton loading semua halaman public
- [ ] T67: Error boundary per section
- [ ] T68: Breadcrumb + JSON-LD di halaman detail
- [ ] T69: Optimistic update di semua admin list
- [ ] T70: Preview mode (public view dari admin)
- [ ] T71: /api/revalidate route handler di Next.js
- [ ] T72: End-to-end test revalidation flow

### FASE 7 — POLISH
- [ ] T73: Responsive check semua halaman
- [ ] T74: Dark mode check semua halaman
- [ ] T75: SEO audit (meta, og, json-ld)
- [ ] T76: Performance check
- [ ] T77: Final cleanup + dokumentasi

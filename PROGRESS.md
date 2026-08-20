# Portfolio Web â€” Sulistio Murti Mulyono
# PROGRESS TRACKER

> Format update: [YYYY-MM-DD HH:MM] â€” status â€” catatan
> Status: âœ… Done | ðŸ”„ In Progress | âŒ Blocked | â³ Pending

---

## SUMMARY

| Fase | Total Task | Done | In Progress | Pending |
|------|-----------|------|-------------|---------|
| Fase 1 â€” Backend Foundation | 16 | 16 | 0 | 0 |
| Fase 2 â€” Backend CRUD | 12 | 12 | 0 | 0 |
| Fase 3 â€” Frontend Foundation | 15 | 15 | 0 | 0 |
| Fase 4 â€” Frontend Admin CRUD | 9 | 9 | 0 | 0 |
| Fase 5 â€” Frontend Public | 9 | 9 | 0 | 0 |
| Fase 6 â€” Fitur Lanjutan | 11 | 11 | 0 | 0 |
| Fase 7 â€” Polish | 5 | 5 | 0 | 0 |
| **TOTAL** | **77** | **77** | **0** | **0** |

---

## FASE 1 â€” BACKEND FOUNDATION

### T01: Setup Go project, go.mod, folder structure
- Status: â³ Pending
- Log:

### T02: Config (load .env, database connection GORM)
- Status: â³ Pending
- Log:

### T03: Migration semua 18 table
- Status: â³ Pending
- Tables: users, sessions, personal_access_tokens, site_settings, seo_settings, social_links, projects, project_categories, project_images, certificates, experiences, educations, skills, skill_categories, publications, media, pages, revalidation_jobs
- Log:

### T04: Seeder user admin default
- Status: â³ Pending
- Log:

### T05: common_struct (Response, ResponseWithMeta, helpers)
- Status: â³ Pending
- Log:

### T06: pagination_service
- Status: â³ Pending
- Log:

### T07: security_service (magic bytes, mime validation)
- Status: â³ Pending
- Log:

### T08: slug_service (auto generate dari title, unique check)
- Status: â³ Pending
- Log:

### T09: image_service + image_processor (WebP convert, 3 ukuran)
- Status: â³ Pending
- Output: thumbnail (400px), medium (900px), original (1920px), semua WebP
- Log:

### T10: auth_service + token_service
- Status: â³ Pending
- Log:

### T11: Auth middleware (JWT httponly cookie)
- Status: â³ Pending
- Log:

### T12: CORS middleware
- Status: â³ Pending
- Log:

### T13: Auth controller (login, logout, refreshToken, me)
- Status: â³ Pending
- Log:

### T14: Routes setup (admin + public)
- Status: â³ Pending
- Log:

### T15: revalidate_service (insert job ke DB)
- Status: â³ Pending
- Log:

### T16: Revalidation worker (poll, retry, hit Next.js)
- Status: â³ Pending
- Logic: poll 2 detik, max 3 attempts, status: pendingâ†’processingâ†’done/failed
- Log:

---

## FASE 2 â€” BACKEND CRUD

### T17: Project + project_category + project_image
- Status: â³ Pending
- Admin endpoints: listProject, createProject, getProject, updateProject, deleteProject, listProjectCategory, createProjectCategory, updateProjectCategory, deleteProjectCategory, uploadProjectImage, deleteProjectImage, reorderProjectImage
- Public endpoints: listProject, getProjectBySlug
- Revalidate: /projects, /projects/{slug}, /
- Log:

### T18: Certificate
- Status: â³ Pending
- Admin: listCertificate, createCertificate, updateCertificate, deleteCertificate
- Public: listCertificate
- Revalidate: /certificates
- Log:

### T19: Experience
- Status: â³ Pending
- Admin: listExperience, createExperience, updateExperience, deleteExperience
- Public: listExperience
- Revalidate: /experiences
- Log:

### T20: Education
- Status: â³ Pending
- Admin: listEducation, createEducation, updateEducation, deleteEducation
- Public: listEducation
- Revalidate: /educations
- Log:

### T21: Skill + skill_category
- Status: â³ Pending
- Admin: CRUD skill + CRUD skill_category
- Public: listSkill
- Revalidate: /skills
- Log:

### T22: Publication
- Status: â³ Pending
- Admin: listPublication, createPublication, updatePublication, deletePublication
- Public: listPublication
- Revalidate: /publications
- Log:

### T23: Media (upload, list, delete)
- Status: â³ Pending
- Admin: listMedia, uploadMedia, deleteMedia
- Pagination: infinite scroll support
- Log:

### T24: Page statis
- Status: â³ Pending
- Admin: listPage, createPage, getPage, updatePage, deletePage
- Public: getPageBySlug
- Revalidate: /{slug}
- Log:

### T25: Site setting
- Status: â³ Pending
- Admin: getSiteSetting, updateSiteSetting
- Public: getSiteInfo
- Revalidate: / (semua halaman)
- Fields: title, description, logo, favicon, footer_text, robots_txt
- Log:

### T26: SEO setting
- Status: â³ Pending
- Admin: getSeoSetting, updateSeoSetting
- Public: getSeoByPath
- Revalidate: path yang diubah
- Log:

### T27: Social link
- Status: â³ Pending
- Admin: listSocialLink, createSocialLink, updateSocialLink, deleteSocialLink
- Public: (via getSiteInfo)
- Revalidate: /
- Log:

### T28: seo_service (auto generate SEO + JSON-LD)
- Status: â³ Pending
- Auto generate: title, description, og:title, og:description, og:image, canonical, json-ld
- JSON-LD types: Person (home), BreadcrumbList (detail), Article (publikasi)
- Log:

---

## FASE 3 â€” FRONTEND FOUNDATION

### T29: Setup Next.js, install semua library, folder structure
- Status: â³ Pending
- Libraries: next-themes, shadcn/ui, tailwindcss, react-hook-form, zod, sonner, @tiptap/react, react-intersection-observer, date-fns
- Log:

### T30: next-themes setup
- Status: â³ Pending
- Log:

### T31: shadcn/ui init + komponen dasar
- Status: â³ Pending
- Log:

### T32: API client (lib/api/client.ts + semua api modules)
- Status: â³ Pending
- Modules: auth, projects, certificates, experiences, educations, skills, publications, media, pages, settings, seo
- Log:

### T33: Types semua domain
- Status: â³ Pending
- Files: auth, project, certificate, experience, education, skill, publication, media, page, seo, settings, common, pagination
- Log:

### T34: Zod schemas semua domain
- Status: â³ Pending
- Log:

### T35: Auth admin (login page + auth guard layout)
- Status: â³ Pending
- Log:

### T36: Sidebar + AdminHeader
- Status: â³ Pending
- Log:

### T37: DataTable component (reusable, pagination, search, sort)
- Status: â³ Pending
- Features: search input, filter slot, pagination controls, sort columns, loading skeleton, empty state
- Log:

### T38: ConfirmDialog component
- Status: â³ Pending
- Used before: semua delete + destructive action
- Log:

### T39: MediaLibrary component (modal, infinite scroll, upload + pilih)
- Status: â³ Pending
- Tabs: Pilih dari Library | Upload Baru
- Log:

### T40: RichEditor component (Tiptap)
- Status: â³ Pending
- Log:

### T41: SlugField component
- Status: â³ Pending
- Auto-generate dari title (create mode), warning kalau diubah (edit mode)
- Log:

### T42: ImageUploadField component
- Status: â³ Pending
- Buka MediaLibrary modal, preview gambar terpilih
- Log:

### T43: StatusBadge component
- Status: â³ Pending
- Variants: published (hijau), draft (abu), archived (kuning)
- Log:

---

## FASE 4 â€” FRONTEND ADMIN CRUD

### T44: Admin Projects (list + create + edit + preview)
- Status: â³ Pending
- Table columns: IMAGE | TITLE + slug | CATEGORY | STATUS | ACTIONS
- Log:

### T45: Admin Certificates
- Status: â³ Pending
- Table columns: IMAGE | NAME + issuer | DATE | ACTIONS
- Log:

### T46: Admin Experiences
- Status: â³ Pending
- Table columns: COMPANY | POSITION | PERIOD | TYPE | ACTIONS
- Log:

### T47: Admin Educations
- Status: â³ Pending
- Table columns: INSTITUTION | DEGREE + major | PERIOD | GPA | ACTIONS
- Log:

### T48: Admin Skills + Categories
- Status: â³ Pending
- Table columns: ICON | NAME | CATEGORY | LEVEL | ACTIONS
- Log:

### T49: Admin Publications
- Status: â³ Pending
- Table columns: TITLE | JOURNAL | DATE | STATUS | ACTIONS
- Log:

### T50: Admin Pages (list + create + edit + preview)
- Status: â³ Pending
- Table columns: TITLE + slug | STATUS | UPDATED AT | ACTIONS
- Log:

### T51: Admin Media Library halaman
- Status: â³ Pending
- Table columns: THUMBNAIL | FILENAME | SIZE | TYPE | UPLOADED AT | ACTIONS
- Infinite scroll
- Log:

### T52: Admin Settings
- Status: â³ Pending
- Sections: Site Info, SEO Global, Social Links, Favicon & Logo, Footer
- Log:

---

## FASE 5 â€” FRONTEND PUBLIC

### T53: Layout public (Navbar + Footer dari settings)
- Status: â³ Pending
- Log:

### T54: Home page
- Status: â³ Pending
- Sections: Hero (nama, tagline, sosmed), Featured Projects, Skills preview, dll
- Log:

### T55: Projects list + detail
- Status: â³ Pending
- List: grid dengan pagination
- Detail: full content, images, breadcrumb + JSON-LD
- Log:

### T56: Certificates page
- Status: â³ Pending
- Log:

### T57: Experiences page
- Status: â³ Pending
- Log:

### T58: Educations page
- Status: â³ Pending
- Log:

### T59: Skills page
- Status: â³ Pending
- Grouped by category
- Log:

### T60: Publications page
- Status: â³ Pending
- Log:

### T61: Page statis [slug]
- Status: â³ Pending
- Log:

---

## FASE 6 â€” FITUR LANJUTAN

### T62: sitemap.ts (auto generate dari backend)
- Status: â³ Pending
- Includes: /, /projects, /projects/{slug}, /certificates, /experiences, /educations, /skills, /publications, /{page-slug}
- Log:

### T63: robots.ts (dari site_settings)
- Status: â³ Pending
- Log:

### T64: icon.tsx (favicon dari site_settings)
- Status: â³ Pending
- Log:

### T65: OG Image dynamic per halaman
- Status: â³ Pending
- Per halaman: project detail, publikasi detail
- Global fallback: app/opengraph-image.tsx
- Log:

### T66: Skeleton loading semua halaman public
- Status: â³ Pending
- Pakai Suspense + skeleton component
- Log:

### T67: Error boundary per section
- Status: â³ Pending
- Pakai ErrorSection.tsx wrapper
- Log:

### T68: Breadcrumb + JSON-LD di halaman detail
- Status: â³ Pending
- Log:

### T69: Optimistic update di semua admin list
- Status: â³ Pending
- Pattern: UI update dulu â†’ request â†’ rollback kalau gagal
- Log:

### T70: Preview mode (public view dari admin)
- Status: â³ Pending
- URL: /admin/projects/{id}/preview
- Banner "Preview Mode" di atas
- Log:

### T71: /api/revalidate route handler di Next.js
- Status: â³ Pending
- Validasi REVALIDATE_SECRET
- Terima paths array, jalankan revalidatePath per path
- Log:

### T72: End-to-end test revalidation flow
- Status: â³ Pending
- Test: admin update â†’ worker poll â†’ Next.js revalidate â†’ halaman public update
- Log:

---

## FASE 7 â€” POLISH

### T73: Responsive check semua halaman
- Status: â³ Pending
- Log:

### T74: Dark mode check semua halaman
- Status: â³ Pending
- Log:

### T75: SEO audit (meta, og, json-ld)
- Status: â³ Pending
- Log:

### T76: Performance check
- Status: â³ Pending
- Log:

### T77: Final cleanup + dokumentasi
- Status: â³ Pending
- Log:

---

## CATATAN & KEPUTUSAN TEKNIS

| Tanggal | Keputusan | Alasan |
|---------|-----------|--------|
| - | Hard delete (bukan soft delete) | Simplicity |
| - | No rate limiting untuk sekarang | Bisa ditambah nanti |
| - | No audit log | Tidak dibutuhkan scope ini |
| - | Slug lama â†’ 404 (bukan redirect) | Slug baru yang valid |
| - | Image auto convert ke WebP | Performance |
| - | SSE + DB queue untuk revalidasi | Retry otomatis kalau gagal |
| - | Backend URL tidak di-expose ke browser | Security |

---

## BLOCKED / ISSUES

_Belum ada_

---
_File ini wajib diupdate setiap task selesai atau ada progress._

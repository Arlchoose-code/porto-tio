package database

import (
	"log"
	"time"

	"portfolio-backend/models"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func Seed(db *gorm.DB) {
	// 1. Seed User
	var userCount int64
	db.Model(&models.User{}).Count(&userCount)
	if userCount == 0 {
		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("Password123!"), bcrypt.DefaultCost)
		adminUser := models.User{
			Name:     "Sulistio Murti Mulyono",
			Email:    "admin@tiomurti.com",
			Password: string(hashedPassword),
			Role:     "admin",
		}
		db.Create(&adminUser)
		log.Println("Default admin user seeded: admin@tiomurti.com / Password123!")
	}

	// 2. Seed Site Settings
	var siteCount int64
	db.Model(&models.SiteSetting{}).Count(&siteCount)
	if siteCount == 0 {
		siteSetting := models.SiteSetting{
			Title:           "Sulistio Murti Mulyono — Digital Business & Project Management",
			Description:     "Official portfolio of Sulistio Murti Mulyono (Tio). Connecting Business, Technology, Data, and People to Deliver Impact.",
			Logo:            "/assets/logo.webp",
			Favicon:         "/favicon.ico",
			FooterText:      "© 2026 Sulistio Murti Mulyono. All rights reserved. Connecting Business, Technology, Data, and People.",
			RobotsTxt:       "User-agent: *\nAllow: /\nSitemap: http://localhost:3000/sitemap.xml",
			HeroBadge:       "Digital Business & Project Management",
			HeroTitle:       "Connecting Business, Technology, Data, and People.",
			HeroDescription: "Finance Management graduate (GPA 3.72) and international Information Systems scholarship awardee. Proven track record managing multi-billion rupiah budgets, leading cross-functional teams across 65 countries, and engineering user-centered digital platforms.",
			HeroStats:       `[{"id":"stat-1","value":"97%","label":"Voter Turnout","description":"General Election 2024 (Serbia & Montenegro)","color":"primary"},{"id":"stat-2","value":"IDR 1.7B","label":"Budget Managed","description":"Strict financial audit compliance under KPU RI","color":"indigo"},{"id":"stat-3","value":"65 Countries","label":"Global Coordination","description":"OISAA / PPI Dunia Congress & Regulations","color":"blue"},{"id":"stat-4","value":"3.72 / 4.00","label":"Cumulative GPA","description":"Finance Management — Institut Bisnis Nusantara","color":"emerald"}]`,
		}
		db.Create(&siteSetting)
		log.Println("Site settings seeded.")
	}

	// 3. Seed SEO Settings
	var seoCount int64
	db.Model(&models.SeoSetting{}).Count(&seoCount)
	if seoCount == 0 {
		seoList := []models.SeoSetting{
			{
				Path:            "/",
				MetaTitle:       "Sulistio Murti Mulyono — Digital Business & Project Management",
				MetaDescription: "Portfolio of Sulistio Murti Mulyono (Tio) — Experienced Project Manager, Digital Business Strategist, and Finance Graduate.",
				OgTitle:         "Sulistio Murti Mulyono — Digital Business & Project Management",
				OgDescription:   "Connecting Business, Technology, Data, and People to Deliver Impact.",
				CanonicalUrl:    "http://localhost:3000/",
			},
			{
				Path:            "/projects",
				MetaTitle:       "Projects & Initiatives — Sulistio Murti Mulyono",
				MetaDescription: "Explore key technology, civic leadership, and digital business projects led by Sulistio Murti Mulyono.",
				OgTitle:         "Projects & Initiatives — Sulistio Murti Mulyono",
				OgDescription:   "Selected case studies in election operations, blockchain hackathons, e-commerce, and digital platforms.",
				CanonicalUrl:    "http://localhost:3000/projects",
			},
			{
				Path:            "/certificates",
				MetaTitle:       "Certifications & Accreditations — Sulistio Murti Mulyono",
				MetaDescription: "Professional certifications in BNSP Digital Marketing, AWS Cloud, SOLID Principles, and Languages.",
				OgTitle:         "Certifications & Accreditations — Sulistio Murti Mulyono",
				OgDescription:   "Validated credentials in software design, cloud computing, marketing, and leadership.",
				CanonicalUrl:    "http://localhost:3000/certificates",
			},
			{
				Path:            "/experiences",
				MetaTitle:       "Work & Leadership Experience — Sulistio Murti Mulyono",
				MetaDescription: "Track record in international election management, student diplomacy, parliamentary internship, and project leadership.",
				OgTitle:         "Work & Leadership Experience — Sulistio Murti Mulyono",
				OgDescription:   "Demonstrated leadership managing IDR 1.7B budgets, 65 country delegations, and cross-functional teams.",
				CanonicalUrl:    "http://localhost:3000/experiences",
			},
			{
				Path:            "/educations",
				MetaTitle:       "Academic Background — Sulistio Murti Mulyono",
				MetaDescription: "Finance Management (GPA 3.72) at Institut Bisnis Nusantara and Information Systems scholarship at University of Belgrade.",
				OgTitle:         "Academic Background — Sulistio Murti Mulyono",
				OgDescription:   "Finance management and international technological training.",
				CanonicalUrl:    "http://localhost:3000/educations",
			},
			{
				Path:            "/skills",
				MetaTitle:       "Skills & Competencies — Sulistio Murti Mulyono",
				MetaDescription: "Core strengths in Financial Analysis, Project Management, Python, SPSS, Web Development, and Languages.",
				OgTitle:         "Skills & Competencies — Sulistio Murti Mulyono",
				OgDescription:   "Multidisciplinary skill matrix combining business acumen and technology.",
				CanonicalUrl:    "http://localhost:3000/skills",
			},
			{
				Path:            "/publications",
				MetaTitle:       "Scientific Publications — Sulistio Murti Mulyono",
				MetaDescription: "Peer-reviewed SINTA 4 publications in finance event studies, political social media dissemination, and public relations.",
				OgTitle:         "Scientific Publications — Sulistio Murti Mulyono",
				OgDescription:   "Academic research and indexed journal publications by Sulistio Murti Mulyono.",
				CanonicalUrl:    "http://localhost:3000/publications",
			},
		}
		for _, s := range seoList {
			db.Create(&s)
		}
		log.Println("SEO settings seeded.")
	}

	// 4. Seed Social Links
	var socialCount int64
	db.Model(&models.SocialLink{}).Count(&socialCount)
	if socialCount == 0 {
		socials := []models.SocialLink{
			{Platform: "LinkedIn", Url: "https://www.linkedin.com/in/sulistiomurtimulyono", Icon: "Linkedin", Order: 1, IsActive: true},
			{Platform: "Email", Url: "mailto:tiomurti4@gmail.com", Icon: "Mail", Order: 2, IsActive: true},
			{Platform: "WhatsApp", Url: "https://wa.me/6281919844369", Icon: "Phone", Order: 3, IsActive: true},
			{Platform: "GitHub", Url: "https://github.com", Icon: "Github", Order: 4, IsActive: true},
		}
		for _, soc := range socials {
			db.Create(&soc)
		}
		log.Println("Social links seeded.")
	}

	// 5. Seed Project Categories
	var catCount int64
	db.Model(&models.ProjectCategory{}).Count(&catCount)
	if catCount == 0 {
		cats := []models.ProjectCategory{
			{Name: "Civic & International Leadership", Slug: "civic-leadership", Order: 1},
			{Name: "Digital Products & Web Platforms", Slug: "digital-products", Order: 2},
			{Name: "Blockchain & Fintech", Slug: "blockchain-fintech", Order: 3},
			{Name: "Business & Client Solutions", Slug: "business-solutions", Order: 4},
		}
		for _, c := range cats {
			db.Create(&c)
		}
		log.Println("Project categories seeded.")
	}

	// 6. Seed Projects
	var projCount int64
	db.Model(&models.Project{}).Count(&projCount)
	if projCount == 0 {
		projects := []models.Project{
			{
				CategoryID:   1,
				Title:        "2024 Indonesian Overseas General Election in Serbia & Montenegro",
				Slug:         "indonesian-overseas-general-election-2024",
				Subtitle:     "Executive Leadership, Logistics & Budget Management for 170 Citizens",
				Description:  "Served as Head of Finance, Logistics, and HR under KPU RI. Managed IDR 1.7 Billion budget with strict financial accountability, achieving a record-breaking 97% voter turnout.",
				Content:      `<h3>Project Background</h3><p>The 2024 Overseas General Election (PPLN) in Serbia and Montenegro was a critical democratic undertaking for Indonesian citizens living abroad. Supervised directly by the Indonesian General Election Commission (KPU RI), the project required rigorous planning, logistics management across international borders, and transparent financial stewardship.</p><h3>Key Responsibilities & Leadership</h3><ul><li><strong>Financial Management:</strong> Oversaw and audited an operating budget of IDR 1.7 Billion, ensuring zero discrepancies and 100% compliance with Indonesian state audit standards.</li><li><strong>Logistics & Operations:</strong> Coordinated sensitive ballot deliveries, polling station setup in Belgrade, and postal ballot tracking for registered diaspora voters.</li><li><strong>Human Resources:</strong> Recruited, structured, and trained the operational election committee members and KPPSLN teams.</li><li><strong>Digital Outreach:</strong> Spearheaded proactive communication campaigns via social channels and direct messaging, explaining voter rights and registration procedures.</li></ul><h3>Impact & Outcomes</h3><p>Achieved an exceptional <strong>97% voter turnout</strong>, surpassing historical targets and standard overseas averages. The election concluded smoothly with high satisfaction and official commendation from the Indonesian Embassy and KPU RI.</p>`,
				ThumbnailUrl: "/media/projects/election_thumb.webp",
				MediumUrl:    "/media/projects/election_medium.webp",
				OriginalUrl:  "/media/projects/election_orig.webp",
				Status:       "published",
				Featured:     true,
				Order:        1,
			},
			{
				CategoryID:   1,
				Title:        "Technical Training for 20 Countries & First Indonesian Film Screening in Serbia",
				Slug:         "technical-training-film-screening-serbia",
				Subtitle:     "International Diplomacy, Event Management & Cultural Cinema Production",
				Description:  "Coordinated international technical guidance for 60 PPLN delegates across 20 countries, followed by the first-ever Indonesian film screening in Serbian cinema history.",
				Content:      `<h3>Overview</h3><p>This initiative combined high-level bilateral coordination with public cultural diplomacy. As the lead organizer for finance, logistics, and program design, Tio orchestrated a comprehensive technical guidance event for Panitia Pemilihan Luar Negeri (PPLN) alongside a groundbreaking cultural cinema event.</p><h3>Key Accomplishments</h3><ul><li>Hosted 60 delegates representing 20 distinct country election committees across Europe.</li><li>Managed hospitality, visa coordination, conference logistics, and multimedia production in Belgrade.</li><li>Organized the first Indonesian movie premiere screened in a Serbian commercial cinema theater, attended by Indonesian diaspora, university students, and foreign dignitaries.</li><li>Fostered strong cross-cultural understanding and boosted civic engagement among overseas youths.</li></ul>`,
				ThumbnailUrl: "/media/projects/training_thumb.webp",
				MediumUrl:    "/media/projects/training_medium.webp",
				OriginalUrl:  "/media/projects/training_orig.webp",
				Status:       "published",
				Featured:     true,
				Order:        2,
			},
			{
				CategoryID:   3,
				Title:        "NFT Platform for Street Artists — International Blockchain Hackathon",
				Slug:         "nft-platform-street-artists-blockchain",
				Subtitle:     "Award-Winning Web3 Solution Bridging Urban Art & Digital Monetization",
				Description:  "Led a 4-person multidisciplinary engineering team to create a Web3 marketplace enabling Serbian street artists to tokenize and sell artwork. Won 4th Place & Favorite Project.",
				Content:      `<h3>Problem Statement</h3><p>Local urban muralists and street artists in Belgrade struggled with monetization, copyright protection, and access to international art collectors due to traditional gallery barriers.</p><h3>Proposed Solution</h3><p>Our team conceptualized, engineered, and pitched a decentralized marketplace built on smart contracts with an intuitive web application interface. Street artists could register verified physical murals, attach GPS coordinates, and mint fractionalized digital collectibles (NFTs) with built-in royalty distribution mechanisms.</p><h3>Role & Contributions</h3><ul><li><strong>Team Leader & Scrum Master:</strong> Orchestrated sprint planning, presentation pitching, and feature prioritization.</li><li><strong>Frontend Web Developer:</strong> Built responsive user interfaces for artist registration, gallery showcase, and wallet connection.</li><li><strong>Judges' Recognition:</strong> Awarded <strong>4th Place and the Audience Favorite Project Award</strong> among dozens of international teams.</li></ul>`,
				ThumbnailUrl: "/media/projects/hackathon_thumb.webp",
				MediumUrl:    "/media/projects/hackathon_medium.webp",
				OriginalUrl:  "/media/projects/hackathon_orig.webp",
				Status:       "published",
				Featured:     true,
				Order:        3,
			},
			{
				CategoryID:   2,
				Title:        "Avala Shop — Student E-Commerce & Secure Escrow Platform",
				Slug:         "avala-shop-student-ecommerce",
				Subtitle:     "End-to-End Peer-to-Peer University Marketplace",
				Description:  "Designed and built a verified marketplace tailored for university students in Belgrade to safely buy, sell, and trade textbooks, electronics, and study essentials.",
				Content:      `<h3>The Vision</h3><p>International and domestic university students in Serbia frequently experienced scam risks and payment hurdles when buying second-hand items on unmoderated social media groups.</p><h3>Architecture & Features</h3><ul><li><strong>Student Verification:</strong> University email authentication to foster high-trust peer transactions.</li><li><strong>Escrow / Safe Deal Concept:</strong> Built-in deposit protection holding funds until mutual handover confirmation.</li><li><strong>Search & Filter:</strong> Real-time filtering by university campus, item condition, price range, and faculty tags.</li><li><strong>Responsive UI:</strong> Mobile-first design engineered for fast navigation and instant listing uploads.</li></ul>`,
				ThumbnailUrl: "/media/projects/avala_thumb.webp",
				MediumUrl:    "/media/projects/avala_medium.webp",
				OriginalUrl:  "/media/projects/avala_orig.webp",
				Status:       "published",
				Featured:     true,
				Order:        4,
			},
			{
				CategoryID:   4,
				Title:        "Paytrizz — Freelance Web Development Agency & Client Solutions",
				Slug:         "paytrizz-freelance-web-development",
				Subtitle:     "Co-Founder & Client Solutions Director",
				Description:  "Co-founded digital web consultancy delivering customized web portals, e-commerce stores, and corporate profiles for SMEs and institutions.",
				Content:      `<h3>About Paytrizz</h3><p>Paytrizz is a freelance web solutions initiative focused on translating business visions into modern, performant web platforms. As Co-Founder, Tio bridges client requirements with development execution.</p><h3>Scope of Responsibilities</h3><ul><li><strong>Client Negotiation & MoU:</strong> Led discovery meetings, drafted project proposals, negotiated deliverables, and finalized formal agreements.</li><li><strong>Requirements Engineering:</strong> Converted business needs into technical user stories, wireframes, and sprint roadmaps.</li><li><strong>Cross-Functional Coordination:</strong> Managed delivery timelines, QA testing, and client handover workshops.</li></ul>`,
				ThumbnailUrl: "/media/projects/paytrizz_thumb.webp",
				MediumUrl:    "/media/projects/paytrizz_medium.webp",
				OriginalUrl:  "/media/projects/paytrizz_orig.webp",
				Status:       "published",
				Featured:     true,
				Order:        5,
			},
		}
		for _, p := range projects {
			db.Create(&p)
		}
		log.Println("Projects seeded.")
	}

	// 7. Seed Certificates
	var certCount int64
	db.Model(&models.Certificate{}).Count(&certCount)
	if certCount == 0 {
		t1 := time.Date(2022, 12, 14, 0, 0, 0, 0, time.UTC)
		exp1 := time.Date(2025, 12, 14, 0, 0, 0, 0, time.UTC)
		t2 := time.Date(2022, 3, 23, 0, 0, 0, 0, time.UTC)
		t3 := time.Date(2023, 8, 15, 0, 0, 0, 0, time.UTC)
		t4 := time.Date(2024, 4, 20, 0, 0, 0, 0, time.UTC)
		t5 := time.Date(2024, 10, 15, 0, 0, 0, 0, time.UTC)

		certs := []models.Certificate{
			{
				Name:           "Belajar Prinsip Pemrograman SOLID",
				Issuer:         "Dicoding Academy",
				IssueDate:      t1,
				ExpirationDate: &exp1,
				CredentialID:   "JMZVN30W3PN9",
				CredentialURL:  "https://www.dicoding.com/certificates/JMZVN30W3PN9",
				ThumbnailUrl:   "/media/certificates/cert_solid_thumb.webp",
				MediumUrl:      "/media/certificates/cert_solid_medium.webp",
				OriginalUrl:    "/media/certificates/cert_solid_orig.webp",
				Description:    "Comprehensive mastery of Object-Oriented Software Design: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.",
				Order:          1,
			},
			{
				Name:          "Introduction to Amazon Web Services (AWS)",
				Issuer:        "Dicoding Developer Coaching #45",
				IssueDate:     t2,
				CredentialURL: "https://www.dicoding.com/users/1692002/events",
				ThumbnailUrl:  "/media/certificates/cert_aws_thumb.webp",
				MediumUrl:     "/media/certificates/cert_aws_medium.webp",
				OriginalUrl:   "/media/certificates/cert_aws_orig.webp",
				Description:   "Back-End architecture on cloud infrastructure, AWS EC2, S3, IAM security, and serverless concepts.",
				Order:         2,
			},
			{
				Name:         "Professional Certification in Digital Marketing",
				Issuer:       "Badan Nasional Sertifikasi Profesi (BNSP)",
				IssueDate:    t3,
				ThumbnailUrl: "/media/certificates/cert_bnsp_thumb.webp",
				MediumUrl:    "/media/certificates/cert_bnsp_medium.webp",
				OriginalUrl:  "/media/certificates/cert_bnsp_orig.webp",
				Description:  "National professional competency certification covering digital campaign strategy, search optimization, and performance analytics.",
				Order:        3,
			},
			{
				Name:         "Head of Finance & Operations Award — General Election 2024",
				Issuer:       "KPU RI / PPLN Belgrade",
				IssueDate:    t4,
				ThumbnailUrl: "/media/certificates/cert_kpu_thumb.webp",
				MediumUrl:    "/media/certificates/cert_kpu_medium.webp",
				OriginalUrl:  "/media/certificates/cert_kpu_orig.webp",
				Description:  "Certificate of Appreciation for exemplary financial management, logistics, and achievement of 97% voter turnout.",
				Order:        4,
			},
			{
				Name:         "Presidential Mandate & Diplomatic Service",
				Issuer:       "Indonesian Students Association in Serbia (PPI Serbia)",
				IssueDate:    t5,
				ThumbnailUrl: "/media/certificates/cert_ppi_thumb.webp",
				MediumUrl:    "/media/certificates/cert_ppi_medium.webp",
				OriginalUrl:  "/media/certificates/cert_ppi_orig.webp",
				Description:  "Leadership recognition for tenure as President of PPI Serbia, executing cultural festivals and growing social reach by over 40%.",
				Order:        5,
			},
		}
		for _, cert := range certs {
			db.Create(&cert)
		}
		log.Println("Certificates seeded.")
	}

	// 8. Seed Experiences
	var expCount int64
	db.Model(&models.Experience{}).Count(&expCount)
	if expCount == 0 {
		e1Start := time.Date(2025, 8, 1, 0, 0, 0, 0, time.UTC)
		e1End := time.Date(2026, 8, 1, 0, 0, 0, 0, time.UTC)
		e2Start := time.Date(2025, 3, 1, 0, 0, 0, 0, time.UTC)
		e2End := time.Date(2025, 6, 1, 0, 0, 0, 0, time.UTC)
		e3Start := time.Date(2024, 5, 1, 0, 0, 0, 0, time.UTC)
		e3End := time.Date(2024, 8, 1, 0, 0, 0, 0, time.UTC)
		e4Start := time.Date(2023, 9, 1, 0, 0, 0, 0, time.UTC)
		e4End := time.Date(2024, 10, 1, 0, 0, 0, 0, time.UTC)
		e5Start := time.Date(2023, 2, 1, 0, 0, 0, 0, time.UTC)
		e5End := time.Date(2024, 4, 1, 0, 0, 0, 0, time.UTC)

		experiences := []models.Experience{
			{
				Company:        "Tenhal Bekerja Bersama",
				Position:       "Project Manager",
				Location:       "Jakarta, Indonesia",
				EmploymentType: "Contract",
				StartDate:      e1Start,
				EndDate:        &e1End,
				IsCurrent:      true,
				Description:    "Managing end-to-end overseas workforce placement projects, ensuring strict regulatory compliance, timely milestones, and seamless multi-stakeholder communication across cross-functional teams.",
				Order:          1,
			},
			{
				Company:        "DPRD Kota Bogor (Regional People's Representative Council)",
				Position:       "Finance & Public Administration Intern",
				Location:       "Bogor, Indonesia",
				EmploymentType: "Internship",
				StartDate:      e2Start,
				EndDate:        &e2End,
				IsCurrent:      false,
				Description:    "Assisted parliamentary budget planning and financial reporting across legislative divisions. Researched public finance regulations, analyzed socio-political public opinion trends, and supported parliamentary faction hearings.",
				Order:          2,
			},
			{
				Company:        "Overseas Indonesian Students Association Alliance (OISAA / PPI Dunia)",
				Position:       "Ad Hoc Secretary",
				Location:       "Global (65 Countries)",
				EmploymentType: "Organizational",
				StartDate:      e3Start,
				EndDate:        &e3End,
				IsCurrent:      false,
				Description:    "Established organizational regulations and oversaw the transparent election congress for the 2024–2025 OISAA World Coordinator. Coordinated 65 country representatives and the host selection process for the 2025 International Symposium.",
				Order:          3,
			},
			{
				Company:        "Indonesian Students Association in Serbia (PPI Serbia)",
				Position:       "President",
				Location:       "Belgrade, Serbia",
				EmploymentType: "Organizational",
				StartDate:      e4Start,
				EndDate:        &e4End,
				IsCurrent:      false,
				Description:    "Led executive cabinet of 21 members. Directed community empowerment programs, fostered diplomatic collaborations with the Indonesian Embassy in Belgrade, represented Indonesia at global festivals, and scaled social media engagement from 700 to 1,000+ followers.",
				Order:          4,
			},
			{
				Company:        "Overseas General Election Committee (PPLN Serbia & Montenegro / KPU RI)",
				Position:       "Head of Finance, Logistics, and Human Resources",
				Location:       "Belgrade, Serbia",
				EmploymentType: "Contract",
				StartDate:      e5Start,
				EndDate:        &e5End,
				IsCurrent:      false,
				Description:    "Directed election execution across 2 countries for 170 registered citizens. Managed IDR 1.7 Billion budget with full transparency, organized multi-country technical guidance for 60 participants from 20 nations, and achieved record 97% voter turnout.",
				Order:          5,
			},
		}
		for _, exp := range experiences {
			db.Create(&exp)
		}
		log.Println("Experiences seeded.")
	}

	// 9. Seed Educations
	var eduCount int64
	db.Model(&models.Education{}).Count(&eduCount)
	if eduCount == 0 {
		edus := []models.Education{
			{
				Institution: "Institut Bisnis Nusantara",
				Degree:      "Bachelor's Degree (S.E.)",
				Major:       "Finance Management",
				GPA:         "3.72 / 4.00",
				StartYear:   2020,
				EndYear:     2026,
				Description: "Specialized in Corporate Financial Analysis, Capital Markets, and Investment Decisions. Won 3rd place in an inter-campus radio competition and developed the student broadcast division's digital website portal.",
				Order:       1,
			},
			{
				Institution: "University of Belgrade, Serbia",
				Degree:      "International Scholarship & Study Program",
				Major:       "Information Systems & Technologies / Serbian Language",
				GPA:         "Excellent",
				StartYear:   2023,
				EndYear:     2024,
				Description: "Awarded bilateral governmental scholarship. Completed rigorous Serbian language training and coursework in software engineering, database design, and systems architecture.",
				Order:       2,
			},
		}
		for _, edu := range edus {
			db.Create(&edu)
		}
		log.Println("Educations seeded.")
	}

	// 10. Seed Skill Categories & Skills
	var skillCatCount int64
	db.Model(&models.SkillCategory{}).Count(&skillCatCount)
	if skillCatCount == 0 {
		cats := []struct {
			Name   string
			Slug   string
			Order  int
			Skills []models.Skill
		}{
			{
				Name:  "Business & Project Management",
				Slug:  "business-pm",
				Order: 1,
				Skills: []models.Skill{
					{Name: "Project Management (Agile / Scrum)", Proficiency: 95, Icon: "FolderKanban", Order: 1},
					{Name: "Financial Budgeting & Auditing", Proficiency: 92, Icon: "BadgeDollarSign", Order: 2},
					{Name: "Cross-Functional Team Leadership", Proficiency: 95, Icon: "Users", Order: 3},
					{Name: "Client Negotiation & MoU Structuring", Proficiency: 90, Icon: "Handshake", Order: 4},
					{Name: "Public Speaking & Presentations", Proficiency: 90, Icon: "Mic", Order: 5},
				},
			},
			{
				Name:  "Technology & Development",
				Slug:  "tech-dev",
				Order: 2,
				Skills: []models.Skill{
					{Name: "Web Development (HTML/CSS/JS)", Proficiency: 88, Icon: "Globe", Order: 1},
					{Name: "Python Programming", Proficiency: 82, Icon: "Code", Order: 2},
					{Name: "SOLID Architecture & OOP", Proficiency: 85, Icon: "Cpu", Order: 3},
					{Name: "Relational Databases & SQL", Proficiency: 85, Icon: "Database", Order: 4},
					{Name: "Git & Version Control", Proficiency: 88, Icon: "GitBranch", Order: 5},
				},
			},
			{
				Name:  "Data & Analytical Tools",
				Slug:  "data-analytics",
				Order: 3,
				Skills: []models.Skill{
					{Name: "Statistical Analysis (SPSS)", Proficiency: 90, Icon: "BarChart3", Order: 1},
					{Name: "Excel Financial Modeling", Proficiency: 94, Icon: "Sheet", Order: 2},
					{Name: "Market & Event Study Research", Proficiency: 88, Icon: "TrendingUp", Order: 3},
					{Name: "Data Cleansing & Processing", Proficiency: 86, Icon: "LineChart", Order: 4},
				},
			},
			{
				Name:  "Digital Media & Languages",
				Slug:  "media-languages",
				Order: 4,
				Skills: []models.Skill{
					{Name: "Digital Marketing & Social Campaigns", Proficiency: 92, Icon: "Share2", Order: 1},
					{Name: "Canva & Visual Design", Proficiency: 90, Icon: "Palette", Order: 2},
					{Name: "Filmora Video Production", Proficiency: 85, Icon: "Video", Order: 3},
					{Name: "English Language (Professional)", Proficiency: 90, Icon: "Languages", Order: 4},
					{Name: "Serbian Language (Working)", Proficiency: 80, Icon: "Languages", Order: 5},
				},
			},
		}

		for _, c := range cats {
			category := models.SkillCategory{
				Name:  c.Name,
				Slug:  c.Slug,
				Order: c.Order,
			}
			db.Create(&category)

			for _, sk := range c.Skills {
				sk.CategoryID = category.ID
				db.Create(&sk)
			}
		}
		log.Println("Skill categories & skills seeded.")
	}

	// 11. Seed Publications
	var pubCount int64
	db.Model(&models.Publication{}).Count(&pubCount)
	if pubCount == 0 {
		d1 := time.Date(2024, 6, 15, 0, 0, 0, 0, time.UTC)
		d2 := time.Date(2024, 9, 20, 0, 0, 0, 0, time.UTC)
		d3 := time.Date(2024, 11, 10, 0, 0, 0, 0, time.UTC)

		pubs := []models.Publication{
			{
				Title:           "Analisis Perbedaan Abnormal Return dan Trading Volume Terhadap Pergantian Menteri Keuangan: Studi Peristiwa Pada Saham Perbankan dan Energi",
				Journal:         "Jurnal Riset Manajemen dan Bisnis",
				IndexType:       "SINTA 4",
				PublicationDate: d1,
				DOI:             "10.35829/jrmb.v9i2.142",
				Url:             "https://sinta.kemdikbud.go.id",
				Abstract:        "Penelitian ini menganalisis reaksi pasar modal Indonesia terhadap peristiwa pengumuman pergantian menteri keuangan dengan mengukur abnormal return dan trading volume activity pada sektor perbankan dan energi.",
				Authors:         "Sulistio Murti Mulyono, dkk.",
				Order:           1,
			},
			{
				Title:           "Optimalisasi Pengelolaan Media Sosial Dalam Diseminasi Informasi Sosial Dan Politik Oleh Humas DPRD Kota Bogor",
				Journal:         "Jurnal Komunikasi Pembangunan & Kebijakan Publik",
				IndexType:       "SINTA 4",
				PublicationDate: d2,
				DOI:             "10.29244/jkp.v12i3.219",
				Url:             "https://sinta.kemdikbud.go.id",
				Abstract:        "Mengkaji efektivitas strategi komunikasi digital dan engagement publik humas lembaga legislatif daerah dalam menyebarluaskan kebijakan dan program kerja kepada generasi muda.",
				Authors:         "Sulistio Murti Mulyono, dkk.",
				Order:           2,
			},
			{
				Title:           "Peran Humas DPRD Bogor Dalam Menjaga Reputasi Lembaga Legislatif Melalui Pendekatan Komunikasi Partisipatif Dan Responsif",
				Journal:         "Jurnal Ilmiah Manajemen Publik dan Kebijakan Daerah",
				IndexType:       "SINTA 4",
				PublicationDate: d3,
				DOI:             "10.31294/jimp.v8i2.311",
				Url:             "https://sinta.kemdikbud.go.id",
				Abstract:        "Studi kualitatif mengenai manajemen reputasi institusi pemerintahan daerah melalui integrasi kanal komunikasi dua arah, penanganan keluhan warga, dan transparansi anggaran.",
				Authors:         "Sulistio Murti Mulyono, dkk.",
				Order:           3,
			},
		}
		for _, pub := range pubs {
			db.Create(&pub)
		}
		log.Println("Publications seeded.")
	}

	// 12. Seed Pages
	var pageCount int64
	db.Model(&models.Page{}).Count(&pageCount)
	if pageCount == 0 {
		page := models.Page{
			Title:           "About Sulistio Murti Mulyono",
			Slug:            "about",
			Content:         `<h2>Who is Sulistio Murti Mulyono?</h2><p>Sulistio Murti Mulyono (known warmly as <strong>Tio</strong>) is a finance-trained digital business strategist and project manager who combines analytical financial thinking, agile project execution, client negotiation, and international cross-cultural leadership.</p><h3>The Intersection of Finance, Technology & Leadership</h3><p>Graduating with a 3.72 GPA in Finance Management from Institut Bisnis Nusantara and having studied Information Systems at the University of Belgrade on a governmental scholarship, Tio has a rare blend of balance-sheet literacy and technical fluency.</p><h3>Key Milestones</h3><ul><li><strong>Overseas General Election 2024:</strong> Head of Finance, Logistics & HR across Serbia & Montenegro (IDR 1.7B budget, 97% turnout).</li><li><strong>OISAA World Congress:</strong> Ad Hoc Secretary coordinating 65 country student unions globally.</li><li><strong>PPI Serbia:</strong> President leading a 21-member executive team and diplomatic initiatives.</li><li><strong>Web3 Hackathon:</strong> 4th Place & Favorite Project for decentralized street art platform.</li></ul>`,
			Status:          "published",
			MetaTitle:       "About Sulistio Murti Mulyono — Digital Business & Project Manager",
			MetaDescription: "Full biography, professional narrative, and core strengths of Sulistio Murti Mulyono (Tio).",
		}
		db.Create(&page)
		log.Println("Static pages seeded.")
	}
}

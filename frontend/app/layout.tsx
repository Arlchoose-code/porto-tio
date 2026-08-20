import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Toaster } from "sonner";
import { settingsApi } from "@/lib/api/settings";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  let title = "Sulistio Murti Mulyono — Digital Business & Project Management";
  let description = "Official portfolio of Sulistio Murti Mulyono (Tio). Connecting Business, Technology, Data, and People to Deliver Impact.";
  let favicon = "/favicon.ico";

  try {
    const res = await settingsApi.getPublicSettings();
    if (res.data?.site_setting) {
      title = res.data.site_setting.title || title;
      description = res.data.site_setting.description || description;
      if (res.data.site_setting.favicon) {
        favicon = res.data.site_setting.favicon;
      }
    }
  } catch {
    // Fallback to defaults if backend is restarting
  }

  return {
    title: {
      default: title,
      template: `%s | ${title.split("—")[0].trim()}`,
    },
    description,
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    keywords: [
      "Sulistio Murti Mulyono",
      "Tio Murti",
      "Digital Project Manager",
      "Finance Management",
      "KPU Serbia",
      "PPI Serbia",
      "OISAA",
      "Paytrizz",
      "Blockchain Hackathon",
    ],
    authors: [{ name: "Sulistio Murti Mulyono" }],
    creator: "Sulistio Murti Mulyono",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "http://localhost:3000",
      title,
      description,
      siteName: title,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
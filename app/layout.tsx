import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Site metadata configuration
export const metadata: Metadata = {
  metadataBase: new URL("https://legend4tech.com"),
  title: {
    template: "Dennis Ajulu (legend4tech) | %s",
    default: "Dennis Ajulu (legend4tech) - Software Engineer & Full-Stack Developer",
  },
  description:
    "Dennis Ajulu (legend4tech) is a Software Engineer, Full-Stack Developer, and Web3 Builder. Founder of BiteHub, Stellar Nigeria Ambassador, and Top Open-Source Contributor.",
  keywords: [
    "Dennis Ajulu",
    "Ajulu Dennis",
    "legend4tech",
    "Legend4Tech",
    "Software Engineer",
    "Full-Stack Developer",
    "Web3 Developer",
    "BiteHub Founder",
    "Stellar Nigeria Ambassador",
    "Starknet Basecamp",
    "React",
    "Next.js",
    "TypeScript",
    "Open-Source Contributor",
    "Computer Scientist",
  ],
  authors: [{ name: "Dennis Ajulu (legend4tech)", url: "https://legend4tech.com" }],
  creator: "Dennis Ajulu (legend4tech)",
  publisher: "Dennis Ajulu",

  // ✅ Enhanced Open Graph for WhatsApp, Facebook, LinkedIn
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: "https://legend4tech.com",
    title: "Dennis Ajulu (legend4tech) - Software Engineer & Full-Stack Developer",
    description:
      "Software Engineer, Full-Stack & Web3 Developer, Founder of BiteHub, Stellar Nigeria Ambassador, and Top Open-Source Contributor.",
    siteName: "Dennis Ajulu (legend4tech)",
    images: [
      {
        url: "https://legend4tech.com/og-image-V1.png", // ✅ Absolute URL required for WhatsApp & social platforms
        width: 1200,
        height: 630,
        alt: "Dennis Ajulu (legend4tech) - Software Engineer & Full-Stack Developer",
        type: "image/png",
      },
    ],
  },

  // ✅ Enhanced Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Dennis Ajulu (legend4tech) - Software Engineer & Full-Stack Developer",
    description:
      "Software Engineer, Full-Stack & Web3 Developer, Founder of BiteHub, Stellar Nigeria Ambassador, and Top Open-Source Contributor.",
    images: ["https://legend4tech.com/og-image-V1.png"],
    creator: "@legend4tech",
    site: "@legend4tech",
  },

  // ✅ Additional meta tags for better search engine discovery
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#7b3fe4",
      },
    ],
  },

  manifest: "/site.webmanifest",

  // ✅ Canonical link
  alternates: {
    canonical: "https://legend4tech.com",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a051a" },
  ],
};

// ✅ Schema.org Structured Data (JSON-LD) for Google Knowledge Graph & Entity Authority
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://legend4tech.com/#person",
      name: "Dennis Ajulu",
      alternateName: ["legend4tech", "Legend4Tech", "Ajulu Dennis", "legend"],
      url: "https://legend4tech.com",
      image: "https://legend4tech.com/profile.jpg",
      jobTitle: "Software Engineer & Full-Stack Developer",
      description:
        "Software Engineer, Full-Stack Developer, Founder of BiteHub, Stellar Nigeria Ambassador, and Top Open-Source Contributor.",
      sameAs: [
        "https://x.com/legend4tech",
        "https://www.linkedin.com/in/legend4tech/",
        "https://github.com/legend4tech",
        "https://www.drips.network/wave/users/380f2af6-d004-4e11-838f-77cdaeec6488",
      ],
      knowsAbout: [
        "Software Engineering",
        "Full-Stack Development",
        "Web3",
        "Next.js",
        "TypeScript",
        "React",
        "Stellar",
        "Starknet",
        "Rust",
        "Node.js",
        "MongoDB",
        "Open-Source Software",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://legend4tech.com/#website",
      url: "https://legend4tech.com",
      name: "Dennis Ajulu (legend4tech) - Portfolio",
      description:
        "Official website and portfolio of Dennis Ajulu (legend4tech), Software Engineer and Web3 Developer.",
      publisher: {
        "@id": "https://legend4tech.com/#person",
      },
    },
    {
      "@type": "ProfilePage",
      "@id": "https://legend4tech.com/#profilepage",
      url: "https://legend4tech.com",
      name: "Dennis Ajulu (legend4tech)",
      mainEntity: {
        "@id": "https://legend4tech.com/#person",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="custom-scrollbar">
      <head>
        {/* ✅ Structured Data (JSON-LD) for Google Knowledge Graph */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* ✅ Additional meta tags for WhatsApp/social previews */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <main>{children}</main>
          <Toaster position="top-right" closeButton richColors />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}

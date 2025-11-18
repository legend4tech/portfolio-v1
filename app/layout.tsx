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
    template: "Legend4tech | %s",
    default: "Legend4tech - Full-Stack Developer & Web3 Enthusiast",
  },
  description:
    "Passionate Computer Scientist and Full-Stack Developer specializing in Web2/Web3 development. Creating dynamic, user-friendly digital experiences with cutting-edge technology.",
  keywords: [
    "Legend4tech",
    "Full-Stack Developer",
    "Web3 Developer",
    "Blockchain",
    "React",
    "Next.js",
    "Smart Contracts",
    "DApp Development",
    "Web Development",
    "Computer Science",
  ],
  authors: [{ name: "Legend4Tech", url: "https://legend4tech.com" }],
  creator: "Legend4Tech",
  publisher: "Legend4Tech",

  // ✅ Enhanced Open Graph for WhatsApp, Facebook, LinkedIn
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://legend4tech.com",
    title: "Legend4Tech - Full-Stack & Web3 Developer",
    description:
      "Passionate Computer Scientist specializing in Full-Stack and Web3 development. Building innovative solutions with React, Next.js, and blockchain technology.",
    siteName: "Legend4Tech",
    images: [
      {
        url: "https://legend4tech.com/og-image.png", // ✅ Absolute URL required for WhatsApp
        width: 1200,
        height: 630,
        alt: "Legend4Tech - Full-Stack & Web3 Developer",
        type: "image/png",
      },
    ],
  },

  // ✅ Enhanced Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Legend4Tech - Full-Stack & Web3 Developer",
    description:
      "Passionate Computer Scientist specializing in Full-Stack and Web3 development. Building innovative digital experiences.",
    images: ["https://legend4tech.com/og-image.png"], // ✅ Absolute URL
    creator: "@legend4tech",
    site: "@legend4tech",
  },

  // ✅ Additional meta tags for better social sharing
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

  // ✅ Additional metadata for better SEO
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="custom-scrollbar">
      <head>
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

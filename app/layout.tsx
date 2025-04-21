import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Site metadata configuration
export const metadata: Metadata = {
  metadataBase: new URL("https://legend4tech.com"),
  title: {
    template: "Legend4tech | %s ",
    default: "Legend4tech",
  },
  description:
    "Am Legend4tech A passionate Computer Scientist and Full-Stack Developer And Web3 Enthusiast with a strong focus on crafting dynamic and user-friendly digital experiences. I specialize in Full-Stack development, blending creativity with performance optimization to build seamless, high-quality web applications. Always eager to learn and push boundaries, I strive to create innovative solutions that make an impact.",
  keywords: [
    "technology",
    "legend",
    "legend4tech",
    "web development",
    "IT services",
  ],
  authors: [{ name: "Legend4Tech" }],
  creator: "Legend4Tech",
  publisher: "Legend4Tech",

  // Open Graph / Facebook metadata
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://legend4tech.com",
    title: "Legend4Tech - Technology Solutions",
    description:
      "Am Legend4tech A passionate Computer Scientist and Full-Stack Developer And Web3 Enthusiast with a strong focus on crafting dynamic and user-friendly digital experiences. I specialize in Full-Stack development, blending creativity with performance optimization to build seamless, high-quality web applications. Always eager to learn and push boundaries, I strive to create innovative solutions that make an impact.",
    siteName: "Legend4Tech",
    images: [
      {
        url: "/og-image.png", // 1200x630px recommended
        width: 1200,
        height: 630,
        alt: "Legend4Tech - Technology Solutions",
      },
    ],
  },

  // Twitter metadata
  twitter: {
    card: "summary_large_image",
    title: "Legend4Tech - Technology Solutions",
    description:
      "Am Legend4tech A passionate Computer Scientist and Full-Stack Developer And Web3 Enthusiast with a strong focus on crafting dynamic and user-friendly digital experiences. I specialize in Full-Stack development, blending creativity with performance optimization to build seamless, high-quality web applications. Always eager to learn and push boundaries, I strive to create innovative solutions that make an impact.",
    images: ["/og-image.png"],
    creator: "@legend4tech",
  },

  // Icons configuration
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
        color: "#5bbad5",
      },
    ],
  },

  // Web manifest
  manifest: "/site.webmanifest",

  // Microsoft specific
  // verification: {
  //   google: "your-google-site-verification-if-you-have-one",
  // },

  // Additional browser configurations
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a051a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="custom-scrollbar">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  `}
      >
        <Providers>
          <main>{children}</main>
          <Toaster position="top-right" closeButton richColors />
        </Providers>
      </body>
    </html>
  );
}

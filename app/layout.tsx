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

export const metadata: Metadata = {
  title: {
    template: "Legend4tech | %s ",
    default: "Legend4tech", // This is used when no title is provided by the page
  },
  description:
    "Am Legend4tech A passionate Computer Scientist and Full-Stack Developer And Web3 Enthusiast with a strong focus on crafting dynamic and user-friendly digital experiences. I specialize in Full-Stack development, blending creativity with performance optimization to build seamless, high-quality web applications. Always eager to learn and push boundaries, I strive to create innovative solutions that make an impact.",
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

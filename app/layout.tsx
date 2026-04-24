import type { Metadata } from "next";
import { Be_Vietnam_Pro, Inter } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Mumbai Cloud Kitchen",
    template: "%s | Mumbai Cloud Kitchen",
  },
  description: "Real-time cloud kitchen ordering for a Mumbai-based delivery kitchen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${beVietnamPro.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#F9F9F7] text-[#1A1A1A]">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

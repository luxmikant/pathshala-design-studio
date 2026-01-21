import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Pathshala Design Studio | LFA Design Platform",
  description:
    "A gamified platform to design Logical Framework Analysis (LFA) for education programs across India. Part of the Shikshagraha ecosystem.",
  keywords: [
    "LFA",
    "Logical Framework Analysis",
    "Education",
    "India",
    "Shikshagraha",
    "Program Design",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ICRACE 2026 | International Conference on Research and Advanced Computing",
  description:
    "The International Conference on Research and Advanced Computing (ICRACE 2026) brings together researchers, academicians, and industry professionals to share cutting-edge research.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.variable + " font-sans antialiased"}>
        {children}
      </body>
    </html>
  );
}

import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist_Mono, Public_Sans } from "next/font/google";
import "@/lib/orpc.server"; // for pre-rendering

// Import css
import "./globals.css";
import { Toaster } from "sonner";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "thoughtboard",
  description: "An echo chamber for thoughts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${publicSans.variable} ${geistMono.variable} antialiased dark`}
        >
          <div className="root">
            <main>{children}</main>
            <Toaster />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}

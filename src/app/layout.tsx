import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./myComponents/navigation/navbar";
import { Toaster } from "@/components/ui/toaster";
import { AI } from "./myComponents/chat/actions"
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NoteIt",
  description: "Note taking app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <AI>
          {children}
        </AI>
        <Toaster />
      </body>
    </html>
  );
}

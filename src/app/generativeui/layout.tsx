
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AI } from "./actions";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function UILayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={cn(inter.className, "mt-[200px] w-[500px] mx-auto border border-primary")}>
      <AI>
        {children}
      </AI>
    </main>
  );
}

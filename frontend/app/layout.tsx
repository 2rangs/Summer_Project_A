import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Summer Project A",
    description: "여름 프로젝트",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className="dark">
        <body className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-white antialiased transition-colors duration-300">
        <main className="flex flex-col min-h-screen">{children}</main>
        </body>
        </html>
    );
}

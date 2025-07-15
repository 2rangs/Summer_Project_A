import "./globals.css"
import type { Metadata } from "next"
import { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Summer Project A",
  description: "여름 프로젝트",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
      <html lang="en">
      <head />
      <body>
      <header>
        <nav>
          {/* 네비게이션 바 */}
          <h1>My App</h1>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <p>&copy; {new Date().getFullYear()} My App</p>
      </footer>
      </body>
      </html>
  )
}

import type { Metadata } from "next"
import { StrictMode } from "react"
import { CoAuthorAuthProvider } from "@/components/organisms/CoAuthorAuthProvider"
import { Toaster } from "@/components/ui/sonner"

import "./globals.css"

export const metadata: Metadata = {
  title: "CoAuthor",
  description: "",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ja' suppressHydrationWarning={true}>
      <body className='h-screen font-mono'>
        <StrictMode>
          <CoAuthorAuthProvider>{children}</CoAuthorAuthProvider>

          <Toaster richColors />
        </StrictMode>
      </body>
    </html>
  )
}

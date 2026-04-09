import type { Metadata } from 'next'
import { Geist, Geist_Mono, Prompt } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

const prompt = Prompt({
    variable: '--font-prompt',
    subsets: ['thai'],
    weight: ['400'],
})

export const metadata: Metadata = {
    title: 'QR generator',
    description: 'QR Generator for Easy to use.',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="h-screen w-screen overflow-y-hidden overscroll-y-none max-sm:h-[90vh] dark:bg-[#121212]">
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}

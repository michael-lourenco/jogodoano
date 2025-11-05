import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import { AuthProvider } from "./auth-provider";
import { Toaster } from "@/components/ui/sonner";
import CookieConsent from "@/components/CookieConsent";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Jogo do Ano",
  description: "Escolha seu jogo do ano",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <Providers>
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <CookieConsent />
            <Toaster
              richColors
              position="top-right"
              className="font-sans"
              toastOptions={{
                style: {
                  borderRadius: 'var(--radius)',
                  fontFamily: 'var(--font-geist-sans)',
                },
              }}
            />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
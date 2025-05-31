import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import { AuthProvider } from "./auth-provider";
import { Toaster } from "sonner";
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
              theme="dark"
              className="font-sans"
              toastOptions={{
                style: {
                  borderRadius: 'var(--radius)',
                  fontFamily: 'var(--font-geist-sans)',
                  background: 'hsl(var(--background))',
                  color: 'hsl(var(--foreground))',
                  border: '1px solid hsl(var(--border))',
                },
                classNames: {
                  toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
                  description: "group-[.toast]:text-muted-foreground",
                  actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                  cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
                },
              }}
            />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
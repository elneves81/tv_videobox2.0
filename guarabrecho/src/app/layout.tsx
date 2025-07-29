import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
// import PWAInstaller from "@/components/PWAInstaller";

export const metadata: Metadata = {
  title: "GuaraBrechó - O Brechó Digital da Nossa Cidade",
  description: "Marketplace local para compra, venda, troca e doação de produtos usados em Guarapuava. Conecte-se com a comunidade de forma sustentável.",
  keywords: "brechó, Guarapuava, marketplace, produtos usados, venda, troca, doação, sustentável",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GuaraBrechó"
  },
  other: {
    "mobile-web-capable": "yes",
    "apple-mobile-web-app-capable": "yes"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#16a34a"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased font-sans bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
        <ThemeProvider>
          <NotificationProvider>
            <NextAuthProvider>
              <AuthProvider>
                <Header />
                <main>{children}</main>
                <Footer />
              </AuthProvider>
            </NextAuthProvider>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

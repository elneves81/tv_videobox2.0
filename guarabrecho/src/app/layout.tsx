import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "GuaraBrechó - O Brechó Digital da Nossa Cidade",
  description: "Marketplace local para compra, venda, troca e doação de produtos usados em Guarapuava. Conecte-se com a comunidade de forma sustentável.",
  keywords: "brechó, Guarapuava, marketplace, produtos usados, venda, troca, doação, sustentável",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased font-sans">
        <NextAuthProvider>
          <AuthProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}

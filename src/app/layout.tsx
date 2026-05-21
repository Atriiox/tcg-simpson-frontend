import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { StoreProvider } from "../store/store";
import { ThemeProvider } from "next-themes";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const fredokaVariable = localFont({
  src: "./fonts/Fredoka-Variable.ttf",
  weight: "300 700",
  style: "normal",
  variable: "--font-fredoka",
});

export const metadata: Metadata = {
  title: "Trading Cards Game Simpson",
  description: "Jeu de cartes à collectionner sur le thème des simpson",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${fredokaVariable.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-svh flex flex-col" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light">
          <StoreProvider>
            <Header />
            {children}
            <Footer />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

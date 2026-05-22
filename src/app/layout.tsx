import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { StoreProvider } from "../store/store"; 
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
      className={`${fredokaVariable.variable} antialiased h-full w-full overflow-hidden`}
      suppressHydrationWarning
    >
      {/* 🎯 h-svh + overflow-hidden ici verrouille l'écran. Le Header et le Footer deviennent fixes. */}
      <body className="h-svh w-full flex flex-col overflow-hidden bg-white dark:bg-simpson-dark" suppressHydrationWarning>
        <StoreProvider>
          <Header />
          {/* 🎯 Le main prend tout l'espace restant entre le header et le footer et bloque tout scroll externe */}
          <main className="flex-1 overflow-hidden flex w-full relative">
            {children}
          </main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
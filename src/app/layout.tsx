import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { StoreProvider } from "../store/store"; // Ton StoreProvider qui va gérer le thème
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
      suppressHydrationWarning // On le garde au cas où une extension chrome touche au DOM
    >
<body className="min-h-svh flex flex-col w-full" suppressHydrationWarning>
        <StoreProvider>
          <Header />
       <main className="flex-1 overflow-hidden flex w-full">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}

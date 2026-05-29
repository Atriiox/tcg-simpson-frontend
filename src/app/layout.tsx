import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { StoreProvider } from "../store/store";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RewardProvider } from "@/components/RewardContext";

const fredokaVariable = localFont({
  src: "./fonts/fredoka-variable.ttf",
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
      <body
        className="h-svh w-full flex flex-col overflow-hidden bg-white dark:bg-simpson-dark"
        suppressHydrationWarning
      >
        <StoreProvider>
          <RewardProvider>
            <Header />
            <main className="flex-1 overflow-hidden flex w-full relative">
              {children}
            </main>
            <Footer />
          </RewardProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

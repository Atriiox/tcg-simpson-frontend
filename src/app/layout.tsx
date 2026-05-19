import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

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
      className={`${fredokaVariable.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

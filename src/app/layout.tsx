import type { Metadata } from "next";
import "./globals.css";

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
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

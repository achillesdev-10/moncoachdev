import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "MonCoachDev - Maîtrisez le code par le défi",
    template: "%s | MonCoachDev"
  },
  description: "Apprenez le code avec MonCoachDev : Défis Python, JavaScript, PHP et plus. Plateforme EdTech n°1 en Côte d'Ivoire pour maîtriser le développement web.",
  keywords: ["Apprendre le code", "Défis Python", "PHP Côte d'Ivoire", "MonCoachDev", "Formation Développeur", "Coding Challenges"],
  authors: [{ name: "MonCoachDev", url: "mailto:achillesdev10@gmail.com" }],
  creator: "MonCoachDev",
  publisher: "MonCoachDev",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'), // À mettre à jour avec l'URL réelle en prod
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "MonCoachDev - Maîtrisez le code par le défi",
    description: "La plateforme ultime pour les développeurs en Côte d'Ivoire. Défis interactifs, cours et playground.",
    url: '/',
    siteName: 'MonCoachDev',
    locale: 'fr_FR',
    type: 'website',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

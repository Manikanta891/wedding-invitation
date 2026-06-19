import type { Metadata } from "next";
import { Playfair_Display, Poppins, Dancing_Script } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { BackgroundProvider } from "./components/BackgroundProvider";
import Navbar from "./components/Navbar";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-script",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Harshavardhan & Indumathi | Wedding Invitation",
  description: "Join us in celebrating the wedding of Madugula Harshavardhan and Kundrapu Indumathi on 21st June 2026.",
  openGraph: {
    title: "Harshavardhan & Indumathi | Wedding Invitation",
    description: "Join us in celebrating the wedding of Madugula Harshavardhan and Kundrapu Indumathi on 21st June 2026.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${poppins.variable} ${dancingScript.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body>
        <div className="fixed inset-0 bg-pattern pointer-events-none z-0" />
        <ThemeProvider>
          <BackgroundProvider>
            <Navbar />
            <div className="relative z-10">{children}</div>
          </BackgroundProvider>
        </ThemeProvider>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-294LLNVWB8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-294LLNVWB8');`}
        </Script>
      </body>
    </html>
  );
}

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://mybelovedinvitations.com"),
  title: {
    default: "My Beloved | Bespoke Digital Invitations & Celebration Platform",
    template: "%s | My Beloved Digital Invitations",
  },
  description:
    "Elevate your weddings, anniversaries, and milestone celebrations with immersive 3D animated envelopes, background music, live RSVP tracking, and instant WhatsApp sharing.",
  keywords: [
    "digital wedding invitation",
    "online wedding card",
    "3d envelope invitation",
    "whatsapp wedding invite",
    "digital rsvp tracking",
    "indian wedding invitation online",
  ],
  authors: [{ name: "My Beloved Studio" }],
  openGraph: {
    title: "My Beloved | Bespoke Digital Invitations & Celebrations",
    description:
      "Luxury digital wedding and celebration invitations with 3D wax-seal envelopes, custom soundtracks, photo vaults, and live RSVP.",
    url: "https://mybelovedinvitations.com",
    siteName: "My Beloved Digital Invitations",
    images: [
      {
        url: "/photos/L-1.jpeg",
        width: 1200,
        height: 630,
        alt: "My Beloved Digital Wedding Invitation Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Beloved | Bespoke Digital Invitations",
    description: "Immersive 3D animated digital invitations for weddings and special celebrations.",
    images: ["/photos/L-1.jpeg"],
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

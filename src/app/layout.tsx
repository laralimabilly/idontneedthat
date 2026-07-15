import type { Metadata } from "next";
import { Raleway, Baloo_2, Geist, Geist_Mono, Space_Grotesk, Alatsi } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["400", "900"],
  style: ["normal", "italic"],
});

const alatsi = Alatsi({
  variable: "--font-alatsi",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: {
    default: "I Don't Need That — Products You Didn't Know You Needed",
    template: "%s | I Don't Need That",
  },
  description:
    "Discover the most wonderfully useless products that you'll oddly feel you need. Curated picks with affiliate links to top stores.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${baloo.variable} ${raleway.variable} ${alatsi.variable} h-full antialiased`}
    >
      <GoogleTagManager gtmId="GTM-N4G7VSRK" />
      <body className="min-h-full flex flex-col">
        {/* Adobe Fonts (Museo Sans Rounded) — React hoists these into <head> */}
        <link
          rel="preconnect"
          href="https://use.typekit.net"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://use.typekit.net/tlg6beu.css"
          precedence="default"
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}

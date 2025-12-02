import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import ScriptLoader from "./components/ScriptLoader";
import SocialProof from "./components/SocialProof";
import { ToastProvider } from "./contexts/ToastContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Yara Tours & Travel | Portuguese South African Tours & Adventures",
  description:
    "Discover breathtaking destinations with Yara Tours & Travel. We offer curated tour packages in Portuguese, personalized travel planning, and expert guides to make your adventure unforgettable. Book your dream vacation today!",
  openGraph: {
    title: "Yara Tours & Travel | Portuguese South African Tours & Adventures",
    description:
      "Discover breathtaking destinations with Yara Tours & Travel. We offer curated tour packages in Portuguese, personalized travel planning, and expert guides to make your adventure unforgettable. Book your dream vacation today!",
    url: "https://yaratoursntravel.com/",
    siteName: "Yara Tours & Travel",
    images: [
      {
        url: "https://yaratoursntravel.com/assets/img/YaraTours&Travel-logo.png",
        width: 800,
        height: 600,
        alt: "Yara Tours & Travel Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yara Tours & Travel | Portuguese South African Tours & Adventures",
    description:
      "Discover breathtaking destinations with Yara Tours & Travel. We offer curated tour packages in Portuguese, personalized travel planning, and expert guides to make your adventure unforgettable. Book your dream vacation today!",
    images: ["https://yaratoursntravel.com/assets/img/YaraTours&Travel-logo.png"],
  },
  icons: {
    icon: [
      { url: "/assets/img/favicons/favicon-16x16.png", sizes: "16x16" },
      { url: "/assets/img/favicons/favicon-32x32.png", sizes: "32x32" },
      { url: "/assets/img/favicons/favicon-96x96.png", sizes: "96x96" },
    ],
    apple: [
      { url: "/assets/img/favicons/apple-icon-57x57.png", sizes: "57x57" },
      { url: "/assets/img/favicons/apple-icon-60x60.png", sizes: "60x60" },
      { url: "/assets/img/favicons/apple-icon-72x72.png", sizes: "72x72" },
      { url: "/assets/img/favicons/apple-icon-76x76.png", sizes: "76x76" },
      { url: "/assets/img/favicons/apple-icon-114x114.png", sizes: "114x114" },
      { url: "/assets/img/favicons/apple-icon-120x120.png", sizes: "120x120" },
      { url: "/assets/img/favicons/apple-icon-144x144.png", sizes: "144x144" },
      { url: "/assets/img/favicons/apple-icon-152x152.png", sizes: "152x152" },
      { url: "/assets/img/favicons/apple-icon-180x180.png", sizes: "180x180" },
    ],
    other: [
      {
        rel: "android-chrome",
        url: "/assets/img/favicons/android-icon-192x192.png",
        sizes: "192x192",
      },
    ],
  },
  manifest: "/assets/img/favicons/manifest.json",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="no-js">
      <body className={`${inter.variable} ${manrope.variable}`}>
        <ToastProvider>
          {children}
        </ToastProvider>

        <SocialProof />

        {/* Scripts */}
        <Script src="/assets/js/vendor/jquery-3.6.0.min.js" strategy="beforeInteractive" />
        <Script src="/assets/js/swiper-bundle.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/bootstrap.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/jquery.magnific-popup.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/jquery.counterup.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/jquery-ui.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/imagesloaded.pkgd.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/isotope.pkgd.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/gsap.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/circle-progress.js" strategy="afterInteractive" />
        <Script src="/assets/js/matter.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/matterjs-custom.js" strategy="afterInteractive" />
        <Script src="/assets/js/nice-select.min.js" strategy="afterInteractive" />
        <ScriptLoader />
      </body>
    </html>
  );
}

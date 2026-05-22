import type { Metadata } from "next";
import { Be_Vietnam_Pro, Geist_Mono, Dancing_Script, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import SiteLayout from "@/components/layouts/SiteLayout";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Haniu - Cửa Hàng Quà Tặng Cao Cấp",
  description: "Trải nghiệm quà tặng cá nhân hóa cao cấp - Hộp quà lãng mạn, đồ lưu niệm độc bản",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${geistMono.variable} ${dancingScript.variable} ${cormorantGaramond.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-800 dark:bg-zinc-950 dark:text-zinc-100 font-sans">
        <AuthProvider>
          <SiteLayout>{children}</SiteLayout>
        </AuthProvider>
      </body>
    </html>
  );
}



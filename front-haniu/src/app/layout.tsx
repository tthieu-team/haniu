import type { Metadata } from "next";
import { Be_Vietnam_Pro, Geist_Mono, Dancing_Script, Cormorant_Garamond, Patrick_Hand, Mali } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import SiteLayout from "@/components/layouts/SiteLayout";
import { cookies } from 'next/headers';

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

const patrickHand = Patrick_Hand({
  variable: "--font-patrick-hand",
  subsets: ["latin", "vietnamese"],
  weight: ["400"],
});

const mali = Mali({
  variable: "--font-mali",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://haniu.vercel.app'),
  title: {
    default: "Haniu - Cửa Hàng Quà Tặng Cá Nhân Hóa Cao Cấp",
    template: "%s | Haniu Gift Shop"
  },
  description: "Haniu mang đến các giải pháp quà tặng cá nhân hóa độc đáo, hộp quà lãng mạn, sổ tay da thật khắc tên và đồ lưu niệm tinh tế được thiết kế riêng theo yêu cầu.",
  keywords: ["quà tặng cá nhân hóa", "hộp quà lãng mạn", "quà lưu niệm độc bản", "sổ tay da thật khắc tên", "haniu", "haniu gift shop", "quà tặng sinh nhật", "quà valentine"],
  authors: [{ name: "Haniu Team" }],
  creator: "Haniu",
  publisher: "Haniu",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://haniu.vercel.app",
    title: "Haniu - Cửa Hàng Quà Tặng Cá Nhân Hóa Cao Cấp",
    description: "Haniu mang đến các giải pháp quà tặng cá nhân hóa độc đáo, hộp quà lãng mạn, sổ tay da thật khắc tên và đồ lưu niệm tinh tế được thiết kế riêng theo yêu cầu.",
    siteName: "Haniu",
    images: [
      {
        url: "/banner.png", // fallback or default banner
        width: 1200,
        height: 630,
        alt: "Haniu - Quà Tặng Cá Nhân Hóa Cao Cấp",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Haniu - Quà Tặng Cá Nhân Hóa Cao Cấp",
    description: "Haniu mang đến các giải pháp quà tặng cá nhân hóa độc đáo, hộp quà lãng mạn, sổ tay da thật khắc tên và đồ lưu niệm tinh tế được thiết kế riêng theo yêu cầu.",
    images: ["/banner.png"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
  alternates: {
    canonical: 'https://haniu.vercel.app',
    languages: {
      'vi': 'https://haniu.vercel.app/?lang=vi',
      'en': 'https://haniu.vercel.app/?lang=en',
      'ja': 'https://haniu.vercel.app/?lang=ja',
      'zh': 'https://haniu.vercel.app/?lang=zh',
      'x-default': 'https://haniu.vercel.app/',
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const language = cookieStore.get('haniu_lang')?.value || 'vi';

  return (
    <html
      lang={language}
      className={`${beVietnamPro.variable} ${geistMono.variable} ${dancingScript.variable} ${cormorantGaramond.variable} ${patrickHand.variable} ${mali.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@100;300;450;500;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Dancing+Script:wght@400;600;700&family=Mali:wght@400;500;600;700&family=Patrick+Hand&display=swap" rel="stylesheet" />
        <script
          id="theme-initializer"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storedTheme = localStorage.getItem('theme');
                  var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var activeTheme = storedTheme === 'dark' || (!storedTheme && systemPrefersDark) ? 'dark' : 'light';
                  
                  if (activeTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  
                  var storedConfigStr = localStorage.getItem('theme_config');
                  if (storedConfigStr) {
                    var config = JSON.parse(storedConfigStr);
                    var colors = config[activeTheme];
                    if (colors) {
                      document.documentElement.style.setProperty('--background-val', colors.background);
                      document.documentElement.style.setProperty('--foreground-val', colors.foreground);
                      document.documentElement.style.setProperty('--card-val', colors.cardBg);
                      document.documentElement.style.setProperty('--border-val', colors.borderColor);
                      document.documentElement.style.setProperty('--primary-val', colors.primaryColor);
                      document.documentElement.style.setProperty('--muted-val', colors.mutedColor);
                      document.documentElement.style.setProperty('--accent-val', colors.accentColor);
                    }
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className="min-h-full bg-slate-50 text-slate-800 dark:bg-zinc-950 dark:text-zinc-100 font-sans">
        <AuthProvider>
          <LanguageProvider>
            <ToastProvider>
              <SiteLayout>{children}</SiteLayout>
            </ToastProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}



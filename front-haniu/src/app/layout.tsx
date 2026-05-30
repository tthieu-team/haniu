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
      suppressHydrationWarning
    >
      <head>
        <script
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
          <SiteLayout>{children}</SiteLayout>
        </AuthProvider>
      </body>
    </html>
  );
}



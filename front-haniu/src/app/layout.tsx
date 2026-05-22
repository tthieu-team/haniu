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



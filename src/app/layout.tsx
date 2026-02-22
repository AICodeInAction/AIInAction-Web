import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/session-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AI In Action - Learn AI by Building",
    template: "%s | AI In Action",
  },
  description:
    "Master AI through hands-on challenge projects. Build real web apps, games, mobile apps, and AI tools.",
  metadataBase: new URL("https://aiinaction.top"),
  openGraph: {
    title: "AI In Action - Learn AI by Building",
    description:
      "Master AI through hands-on challenge projects. Build real web apps, games, mobile apps, and AI tools.",
    url: "https://aiinaction.top",
    siteName: "AI In Action",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI In Action - Learn AI by Building",
    description:
      "Master AI through hands-on challenge projects. Build real web apps, games, mobile apps, and AI tools.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <SessionProvider>
          <ThemeProvider>
            <TooltipProvider>
              <div className="flex min-h-svh flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </TooltipProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

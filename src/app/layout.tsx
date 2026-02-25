import "./globals.css";

// Root layout must not render <html>/<body> — those are in [locale]/layout.tsx
// This exists only to import globals.css
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

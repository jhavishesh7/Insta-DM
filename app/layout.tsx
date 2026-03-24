import ReactQueryProvider from "@/providers/react-query-provider";
import ReduxProvider from "@/providers/redux-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

import NextTopLoader from "nextjs-toploader";
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "ZeroPilot | Elite AI Instagram DM & Comment Automation",
    template: "%s | ZeroPilot",
  },
  description: "Scale your Instagram engagement with ZeroPilot. The advanced AI-powered engine for your DMs and comments. Developed by Vishesh Jha.",
  keywords: ["Instagram Automation", "AI DM Bot", "Instagram AI", "Social Media Automation", "ZeroPilot"],
  metadataBase: new URL("https://zero-pilot.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ZeroPilot | Elite AI Instagram DM & Comment Automation",
    description: "Scale your Instagram engagement with ZeroPilot. The advanced AI-powered engine for your DMs and comments.",
    url: "https://zero-pilot.vercel.app",
    siteName: "ZeroPilot",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ZeroPilot | Next Gen Instagram Automation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZeroPilot | AI Instagram Automation",
    description: "Scale your Instagram engagement with ZeroPilot.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/logo.svg" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={jakarta.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <NextTopLoader color="#4a7dff" showSpinner={false} />
            <ReduxProvider>
              <ReactQueryProvider>{children}</ReactQueryProvider>
            </ReduxProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

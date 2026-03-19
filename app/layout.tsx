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
  title: "ZeroPilot | Elite AI Instagram DM & Comment Automation",
  description: "Scale your Instagram engagement with ZeroPilot. The advanced AI-powered engine for your DMs and comments. Developed by Vishesh Jha.",
  keywords: ["Instagram Automation", "AI DM Bot", "Instagram AI", "Social Media Automation", "ZeroPilot"],
  icons: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40' fill='none'><rect width='40' height='40' rx='10' fill='%234a7dff'/><path d='M12 12H28V15L16 25V25.5H28V29H12V26L24 16V15.5H12V12Z' fill='white'/></svg>",
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

//src/app/layout.tsx
"use client";

import "./globals.css";
import React, { useEffect } from "react";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import { ClerkProvider } from "@clerk/nextjs";

import { ThemeProvider } from "@/app/(app)/component/theme-provider";
import Header from "@/app/(app)/component/header";
import Footer from "@/app/(app)/component/footer";
import ChatbotWidget from "@/components/ChatbotWidget";


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    document.title = "ReadSphere - Personalized Book Recommendations";
  }, [pathname]);

  // ✅ MUST return a boolean expression
  const isAuthPage =
    pathname?.startsWith("/sign-in") ||
    pathname?.startsWith("/sign-up");

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/"
      afterSignUpUrl="/"
      afterSignOutUrl="/sign-in"
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <title>ReadSphere - Personalized Book Recommendations</title>
          <meta
            name="description"
            content="Discover books you'll love with ReadSphere."
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.png" />
        </head>

        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex flex-col min-h-screen">
              <div suppressHydrationWarning>
  {!isAuthPage && <Header />}
  <main className="flex-grow">{children}</main>
  {!isAuthPage && <Footer />}
  <ChatbotWidget />
</div>

            </div>
            
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

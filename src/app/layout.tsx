import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/Providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import SessionProviderWrapper from "@/Providers/SessionProvider";
import SocketProvider from "@/Providers/SocketProvider";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <SessionProviderWrapper>
            <SocketProvider>
              <ThemeProvider>{children}</ThemeProvider>
            </SocketProvider>
          </SessionProviderWrapper>
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  );
}

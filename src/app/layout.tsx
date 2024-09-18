import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./Providers";
import { Bebas_Neue } from "next/font/google";
import { cn } from "@/lib/utils/utils";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const BebasNeueFont = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-BebasNeue",
});

export const metadata: Metadata = {
  title: "Phenic",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          BebasNeueFont.variable,
          "antialiased"
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

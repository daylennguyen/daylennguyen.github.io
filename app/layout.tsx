import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const alagard = localFont({
  src: "../public/alagard.ttf",
  variable: "--font-alagard",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Daylen Nguyen",
  description: "Personal website of Daylen Nguyen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${alagard.variable} font-alagard`}>
        {children}
      </body>
    </html>
  );
}


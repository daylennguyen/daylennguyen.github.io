import type { Metadata } from "next";
import React95Provider from "./components/React95Provider";
import "./globals.css";

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
      <body>
        <React95Provider>{children}</React95Provider>
      </body>
    </html>
  );
}


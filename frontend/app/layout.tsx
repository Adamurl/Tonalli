import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Tonalli — Today’s Mexica Calendar",
  description: "Explore today’s Tonalpohualli and Xihuitl calendar signs.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <SiteHeader />
      </body>
    </html>
  );
}

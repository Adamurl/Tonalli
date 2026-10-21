import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { DayTransitionProvider } from "../components/DayTransitionContext";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Tonalli — Today’s Mexica Calendar",
  description: "Explore today’s Tonalpohualli and Xihuitl calendar signs.",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{ children: ReactNode; modal: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <DayTransitionProvider>
          {children}
          {modal}
          <SiteHeader />
        </DayTransitionProvider>
      </body>
    </html>
  );
}

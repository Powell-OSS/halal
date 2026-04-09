import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

import { cn } from "@powell-oss/ui";
import { ThemeProvider } from "@powell-oss/ui/theme";
import { Toaster } from "@powell-oss/ui/toast";

import { Header } from "~/components/header";
import { LocationOnboarding } from "~/components/location-onboarding";
import { env } from "~/env";
import { LocationProvider } from "~/providers/location-provider";
import { TRPCReactProvider } from "~/trpc/react";

import "~/app/styles.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://halal.example.com"
      : "http://localhost:3000",
  ),
  title: "Halal Food Finder",
  description:
    "Find verified halal restaurants near you, certified by trusted authorities.",
  openGraph: {
    title: "Halal Food Finder",
    description:
      "Find verified halal restaurants near you, certified by trusted authorities.",
    siteName: "Halal Food Finder",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBF7EE" },
    { media: "(prefers-color-scheme: dark)", color: "#1E1814" },
  ],
};

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background text-foreground min-h-screen font-sans antialiased",
          geistSans.variable,
          geistMono.variable,
          instrumentSerif.variable,
        )}
      >
        <ThemeProvider>
          <TRPCReactProvider>
            <LocationProvider>
              <LocationOnboarding />
              <Header />
              {props.children}
            </LocationProvider>
          </TRPCReactProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

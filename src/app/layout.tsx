import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MockMaster - AI-Powered Mock API Generator",
  description: "Create mock REST APIs in seconds, not hours. Generate realistic test data with AI, simulate chaos mode, and test all HTTP methods instantly.",
  keywords: ["mock api", "api testing", "fake api", "test data", "api generator", "developer tools"],
  authors: [{ name: "MockMaster" }],
  openGraph: {
    title: "MockMaster - AI-Powered Mock API Generator",
    description: "Create mock REST APIs in seconds, not hours. Generate realistic test data with AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

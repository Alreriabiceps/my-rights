import { Outfit } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "LegAIze - Your Legal First AI-d",
  description:
    "Know Your Rights. LegAIze Your Fight. AI-powered Philippine legal assistance - analyze your case, find relevant laws, and get recommended lawyers.",
  keywords: [
    "LegAIze",
    "Philippine law",
    "legal assistance",
    "AI legal aid",
    "know your rights",
    "abogado",
    "batas ng Pilipinas",
    "legal first aid",
  ],
  authors: [{ name: "LegAIze" }],
  icons: {
    icon: "/LOGO.png",
    apple: "/LOGO.png",
  },
  openGraph: {
    title: "LegAIze - Your Legal First AI-d",
    description:
      "Know Your Rights. LegAIze Your Fight. AI-powered Philippine legal assistance.",
    type: "website",
    locale: "fil_PH",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fil">
      <body className={`${outfit.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

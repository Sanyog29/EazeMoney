import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { BankingProvider } from "@/hooks/useBanking";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EazeMoney Banking App",
  description: "A modern banking application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <BankingProvider>
            {children}
          </BankingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

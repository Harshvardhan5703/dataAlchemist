import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Data Alchemist - AI-Powered Resource Allocation Configurator',
  description: 'Transform your data with AI-powered validation, cleaning, and business rule configuration for optimal resource allocation.',
  authors:[{name:'Harshvardhan Singh', url:'https://hrsh.is-a.dev'}]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ASX Company Information',
  description: 'Search for Australian Stock Exchange listed companies',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#f8f9fa] text-[#212529]">{children}</body>
    </html>
  );
}

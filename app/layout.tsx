import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WealthForge - Africa\'s Creative + Financial Wealth Operating System',
  description: 'Build wealth with WealthForge, Africa\'s leading financial wealth operating system.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

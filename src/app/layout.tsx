import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import Header from '@/components/header/Header';
import Footer from '@/components/Footer';
import { ToastContainer } from 'react-toastify';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cloud hosting',
  description: 'Cloud Hosting Project',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Header />
        <ToastContainer theme="colored" position="top-center" />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

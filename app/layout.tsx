import '@/app/ui/global.css';
import StuLogo from './ui/stu-logo';
import Head from 'next/head'


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="top-0 left-0 w-full">
        {/* Header with Logo */}
        <Head>
          <StuLogo />
        </Head>

        {/* Main Content */}
        <main className="pt-16">{children}</main>
      </body>

      <footer className="flex justify-center items-center h-10 bg-gray-100"></footer>
    </html>
  );
}
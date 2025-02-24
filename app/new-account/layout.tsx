import Header from "../ui/header";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main> {/* Ensures pages display correctly */}
      </body>
    </html>
  );
}
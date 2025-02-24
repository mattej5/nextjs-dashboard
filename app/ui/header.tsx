import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex w-full items-center px-6 py-2 bg-gray-100 shadow-md">
      <Link href="/">
        <Image src="/logo.png" alt="STU Logo" width={70} height={70} />
      </Link>
    </header>
  );
}
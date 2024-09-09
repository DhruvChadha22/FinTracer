import Image from "next/image";
import Link from "next/link";

export const Navbar = () => {
    return <div className="text-white px-4 lg:px-6 h-16 flex items-center justify-between">
        <Link className="flex items-center gap-2" href="/">
            <Image src="/logo.svg" alt="Logo" height={30} width={30}/>
            <span className="text-lg font-semibold hover:bg-gray-800 p-2 rounded-lg transition-all">FinTracer</span>
        </Link>
        <div className="hidden lg:flex lg:items-center gap-6">
            <Link className="hover:underline" href="#features">
                Features
            </Link>
            <Link className="hover:underline" href="#about">
                About
            </Link>
            <Link className="hover:underline" href="#contact">
                Contact
            </Link>
            <Link className="hidden lg:inline-flex h-10 items-center justify-center rounded-md bg-green-400 px-5 text-sm font-medium text-black shadow transition-colors hover:bg-green-600" href="/sign-in">
                Try for Free
            </Link>
        </div>
    </div>
};

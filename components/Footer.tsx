import Image from "next/image";
import Link from "next/link";

export default function() {
    return <div className="text-white py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between">
            <Link className="flex items-center gap-2" href="/">
                <Image src="/logo.svg" alt="Logo" height={30} width={30}/>
                <span className="text-lg font-semibold hover:bg-gray-800 p-2 rounded-lg transition-all">FinTracer</span>
            </Link>
            <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
                <Link className="hover:underline" href="#">
                    Privacy Policy
                </Link>
                <Link className="hover:underline" href="#">
                    Terms of Service
                </Link>
                <Link className="hover:underline" href="#contact">
                    Contact Us
                </Link>
            </div>
        </div>
  </div>
}

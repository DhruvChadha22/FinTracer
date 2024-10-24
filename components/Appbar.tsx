import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@/components/UserButton";

export const Appbar = () => {
    return <div className="absolute inset-0 z-20 h-fit">
    <div className="fixed w-full">
        <div className="hidden lg:flex">
            <div className="bg-gray-900 w-full p-3">
                <div className="flex items-center justify-between">
                    <Link className="flex items-center gap-x-2 text-white" href="/">
                        <Image src="/logo.svg" alt="Logo" height={30} width={30}/>
                        <span className="ml-1 text-lg font-semibold">FinTracer</span>
                    </Link>
                    <UserButton />
                </div>
            </div>
        </div>
    </div>
    </div>
};

import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function() {
    return <div className="absolute inset-0 z-20 h-fit">
    <div className="fixed w-full">
        <div className="hidden lg:flex">
            <div className="bg-gray-900 w-full p-3">
                <div className="flex items-center justify-between">
                    <Link className="flex items-center gap-x-2 text-white" href="/">
                        <Image src="/logo.svg" alt="Logo" height={30} width={30}/>
                        <span className="ml-1 text-lg font-semibold">FinTracer</span>
                    </Link>
                    <ClerkLoaded>
                        <UserButton />
                    </ClerkLoaded> 
                    <ClerkLoading>
                        <Loader2 className="text-white animate-spin"/>
                    </ClerkLoading>
                </div>
            </div>
        </div>
    </div>
    </div>
}

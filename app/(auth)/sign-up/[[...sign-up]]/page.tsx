import React from "react";
import Image from "next/image";
import { ClerkLoaded, ClerkLoading, SignUp } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function SignUpPage() {
    return <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        <div className="col-span-1 hidden lg:flex items-end justify-center">
            <Image src="/finance-image-1.svg" alt="Finance-Image" height={512} width={512}/>
            <span className="absolute flex items-end justify-end">
                Designed by
                <meta name="referrer" content="no-referrer" />
                <a href="https://www.freepik.com/free-vector/hand-drawn-digital-natives-illustration_144618753.htm#fromView=search&page=1&position=1&uuid=c5cfd0bd-6649-4117-846e-fc7feb16f7b9">&nbsp;Freepik</a>
            </span>
        </div>
        <div className="col-span-1 flex items-center justify-center">
            <ClerkLoaded>
                <SignUp />
            </ClerkLoaded>
                <ClerkLoading>
                <Loader2 className="animate-spin" />
            </ClerkLoading>
        </div>
        <div className="col-span-1 hidden xl:flex items-end justify-center">
            <Image src="/finance-image-2.svg" alt="Finance-Image" height={512} width={512} />
            <span className="absolute flex items-end justify-end">
                Designed by
                <meta name="referrer" content="no-referrer" />
                <a href="https://www.freepik.com/free-vector/hand-drawn-employee-savings-plan-illustration_79310803.htm#fromView=search&page=1&position=48&uuid=c5cfd0bd-6649-4117-846e-fc7feb16f7b9">&nbsp;Freepik</a>
            </span>
        </div>
    </div>
};

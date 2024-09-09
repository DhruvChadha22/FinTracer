"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useMedia } from "react-use";
import Image from "next/image";
import Link from "next/link";
import { 
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Loader2, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";


const routes = [
    {
        href: "/overview",
        label: "Overview",
        src: "/overview-icon.svg",
        alt: "Overview-Icon"
    },
    {
        href: "/transactions",
        label: "Transactions",
        src: "/transaction-icon.svg",
        alt: "Transaction-Icon"
    },
    {
        href: "/accounts",
        label: "Accounts",
        src: "/account-icon.svg",
        alt: "Account-Icon"
    },
    {
        href: "/budgets",
        label: "Budgets",
        src: "/budget-icon.svg",
        alt: "Budget-Icon"
    }
];

export const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const pathname = usePathname();
    const router = useRouter();
    const isMobile = useMedia("(max-width: 1024px)", false);

    const onClick = (href: string) => {
        router.push(href);
        setIsOpen(false);
    }

    if (isMobile) {
        return <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <div className="absolute inset-0 z-10 h-fit">
                <div className="fixed flex justify-between items-center w-full bg-gray-900 py-1 px-2">
                    <SheetTrigger>
                        <Button 
                            size="sm"
                            className="font-normal border-none hover:bg-white/20 hover:text-white focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none transition"
                        >
                            <Menu className="size-4" />
                        </Button>
                    </SheetTrigger>
                    <ClerkLoaded>
                        <UserButton />
                    </ClerkLoaded> 
                    <ClerkLoading>
                        <Loader2 className="text-white animate-spin"/>
                    </ClerkLoading>
                </div>
            </div>
            <SheetContent side="left" className="bg-gray-900 w-fit px-3 border-none">
                {routes.map((route) => (
                    <Button
                        key={route.label}
                        variant="outline"
                        className={cn(
                            "w-full flex justify-start text-xl px-6 mt-5 gap-2 border-none hover:bg-white/20 hover:text-white focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white transition",
                            pathname === route.href ? "bg-green-600 hover:bg-green-700" : "bg-transparent"
                        )}
                        onClick={() => onClick(route.href)}
                    >
                        <Image src={route.src} alt={route.alt} height={30} width={30} className="text-white"/>
                        <Link href={route.href}>
                            {route.label}
                        </Link>
                    </Button>
                ))}
            </SheetContent>
        </Sheet>
    }

    return <div className="absolute inset-0 z-10 w-fit">
        <div className="fixed flex flex-col items-center min-h-screen bg-gray-900 max-w-56 border-x-4 border-gray-900 pt-14">
            {routes.map((route) => (
                <Link href={route.href} key={route.label}>
                    <Button
                    variant="outline"
                    className={cn(
                        "w-52 flex justify-start text-xl px-6 mt-5 gap-2 border-none hover:bg-white/20 hover:text-white focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white transition",
                        pathname === route.href ? "bg-green-600 hover:bg-green-700" : "bg-transparent"
                    )}>
                        <Image src={route.src} alt={route.alt} height={30} width={30} className="text-white"/>
                        {route.label}
                    </Button>
                </Link>
            ))}
        </div>
    </div>
};

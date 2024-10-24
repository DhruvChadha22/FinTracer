"use client";

import { useSession, signOut } from "next-auth/react";
import { Loader2, LogOut, User } from "lucide-react";
import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage
} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export const UserButton = () => {
    const session = useSession();
    
    if (session.status === "loading") {
        return <Loader2 className="size-4 animate-spin text-muted-foreground" />
    }

    if (session.status === "unauthenticated" || !session.data) {
        return null;
    }

    const name = session.data?.user?.name!;
    const imageUrl = session.data?.user?.image;

    return <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="outline-none relative">
            <Avatar className="size-7 hover:opcaity-75 transition">
                <AvatarImage alt={name} src={imageUrl || ""} />
                <AvatarFallback className="bg-emerald-600 font-medium text-white text-sm flex items-center justify-center">
                    {name.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuItem className="h-10">
                <User className="size-4 mr-2" />
                {name}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="h-10 hover:cursor-pointer" onClick={() => signOut()}>
                <LogOut className="size-4 mr-2" />
                Log out
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
};

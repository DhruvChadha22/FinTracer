"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Card,
    CardTitle,
    CardHeader,
    CardContent,
    CardDescription,
} from "@/components/ui/card";

export const SignInCard = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const params = useSearchParams();
    const error = params.get("error");

    const onCredentialsSignIn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        signIn("credentials", {
            email: email,
            password: password,
            callbackUrl: "/overview",
        });
    };

    const onProvidersSignIn = (provider: "google") => {
        signIn(provider, { callbackUrl: "/overview" });
    };

    return <Card className="w-full p-8">
        <CardHeader className="px-0 pt-0">
            <CardTitle>
                Login to continue
            </CardTitle>
            <CardDescription>
                Use your email or another service to continue
            </CardDescription>
        </CardHeader>
        {!!error && (
            <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
                <TriangleAlert className="size-4" />
                <p>Invalid email or password</p>
            </div>
        )}
        <CardContent className="space-y-5 px-0 pb-0">
            <form onSubmit={onCredentialsSignIn} className="space-y-2.5">
                <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    type="email"
                    required
                />
                <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    type="password"
                    required
                />
                <Button type="submit" className="w-full" size="lg">
                    Continue
                </Button>
            </form>
            <Separator />
            <Button
                onClick={() => onProvidersSignIn("google")}
                variant="outline"
                size="lg"
                className="w-full relative"
            >
                <FcGoogle className="mr-2 size-5 top-2.5 left-2.5 absolute" />
                Continue with Google
            </Button>
            <p className="text-xs text-muted-foreground">
                Don&apos;t have an account? <Link href="/register"><span className="text-sky-700 hover:underline">Sign up</span></Link>
            </p>
        </CardContent>
    </Card>
};

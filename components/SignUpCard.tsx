"use client";

import Link from "next/link";
import { useState } from "react";
import { useSignUp } from "@/hooks/users/api/useSignUp";
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

export const SignUpCard = () => {
    const mutation = useSignUp();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onProvidersSignUp = (provider: "google") => {
        signIn(provider, { callbackUrl: "/overview" });
    };

    const onCredentialsSignUp = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        mutation.mutate({
            name,
            email,
            password
        }, {
            onSuccess: () => {
                signIn("credentials", {
                    email,
                    password,
                    callbackUrl: "/overview",
                });
            },
        });
    };

    return <Card className="w-full p-8">
        <CardHeader className="px-0 pt-0">
            <CardTitle>
                Create an account
            </CardTitle>
            <CardDescription>
                Use your email or another service to continue
            </CardDescription>
        </CardHeader>
        {!!mutation.error && (
            <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
                <TriangleAlert className="size-4" />
                <p>Something went wrong</p>
            </div>
        )}
        <CardContent className="space-y-5 px-0 pb-0">
            <form onSubmit={onCredentialsSignUp} className="space-y-2.5">
                <Input
                    disabled={mutation.isPending}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    type="text"
                    required
                />
                <Input
                    disabled={mutation.isPending}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    type="email"
                    required
                />
                <Input
                    disabled={mutation.isPending}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    type="password"
                    required
                    minLength={3}
                    maxLength={20}
                />
                <Button 
                    disabled={mutation.isPending} 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                >
                    Continue
                </Button>
            </form>
            <Separator />
            <Button
                disabled={mutation.isPending}
                onClick={() => onProvidersSignUp("google")}
                variant="outline"
                size="lg"
                className="w-full relative"
            >
                <FcGoogle className="mr-2 size-5 top-2.5 left-2.5 absolute" />
                Continue with Google
            </Button>
            <p className="text-xs text-muted-foreground">
                Already have an account? <Link href="/login"><span className="text-sky-700 hover:underline">Sign in</span></Link>
            </p>
        </CardContent>
    </Card>
};

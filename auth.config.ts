import { z } from "zod";
import { JWT } from "next-auth/jwt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import type { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

const CredentialsSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

declare module "next-auth/jwt" {
    interface JWT {
        id: string | undefined;
    }
}

declare module "@auth/core/jwt" {
    interface JWT {
        id: string | undefined;
    }
}

export default {
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                pasword: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const validatedFields = CredentialsSchema.safeParse(credentials);

                if (!validatedFields.success) {
                    return null;
                }

                const { email, password } = validatedFields.data;

                const user = await prisma.user.findUnique({
                    where: {
                        email: email,
                    },
                });

                if (!user || !user.password) {
                    return null;
                }

                const passwordsMatch = await bcrypt.compare(
                    password,
                    user.password,
                );

                if (!passwordsMatch) {
                    return null;
                }

                return user;
            },
        }), 
        Google,
    ],
    pages: {
        signIn: "/login",
        error: "/login"
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        session({ session, token }) {
            if (token.id) {
                session.user.id = token.id;
            }

            return session;
        },
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;  
            }

            return token;
        }
    },
} satisfies NextAuthConfig;

import { z } from "zod";
import { Hono } from "hono";
import { prisma } from "@/lib/db";
import { zValidator } from "@hono/zod-validator";
import bcrypt from "bcryptjs";

const app = new Hono()
    .post(
        "/",
        zValidator(
            "json",
            z.object({
                name: z.string(),
                email: z.string().email(),
                password: z.string().min(3).max(20),
            }),
        ),
        async (c) => {
            const { name, email, password } = c.req.valid("json");

            const hashedPassword = await bcrypt.hash(password, 12);

            const user = await prisma.user.findUnique({
                where: {
                    email: email,
                },
            });

            if (user) {
                return c.json({ error: "Email already in use" }, 400);
            }

            await prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    password: hashedPassword,
                },
            });
            
            return c.json(null, 200);
    });

export default app;
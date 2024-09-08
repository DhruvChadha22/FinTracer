import { Hono } from "hono";
import { z } from "zod";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { prisma } from "@/lib/db";
import { zValidator } from "@hono/zod-validator";
import { CategoriesModel } from "@/prisma/zod";

const app = new Hono()
    .get(
        "/", 
        clerkMiddleware(),
        async (c) => {
            const auth = getAuth(c);

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await prisma.categories.findMany({
                where: {
                    userId: auth.userId
                },
                select: {
                    id: true,
                    name: true,
                },
            });

            return c.json({ data });
    })
    .post(
        "/",
        clerkMiddleware(),
        zValidator(
            "json", 
            CategoriesModel.omit({
                id: true,
                userId: true,
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            const values = c.req.valid("json");

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await prisma.categories.create({
                data: {
                    userId: auth.userId,
                    ...values
                },
            });

            return c.json({ data });
    })
    .get(
        "/:id",
        clerkMiddleware(),
        zValidator(
            "param", 
            z.object({
                id: z.string().optional(),
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid("param");

            if (!id) {
                return c.json({ error: "Missing id" }, 400);
            }

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await prisma.categories.findUnique({
                where: {
                    id: id,
                    userId: auth.userId
                },
                select: {
                    id: true,
                    name: true,
                }
            });

            if (!data) {
                return c.json({ error: "Not found" }, 404);
            }

            return c.json({ data });
    })
    .patch(
        "/:id",
        clerkMiddleware(),
        zValidator(
            "param",
            z.object({
                id: z.string().optional(),
            })
        ),
        zValidator(
            "json",
            CategoriesModel.omit({
                id: true,
                userId: true,
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid("param");
            const values = c.req.valid("json");

            if (!id) {
                return c.json({ error: "Missing id" }, 400);
            }

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await prisma.categories.update({
                where: {
                    id: id,
                    userId: auth.userId,
                },
                data: {
                    ...values
                }
            });

            if (!data) {
                return c.json({ error: "Not found" }, 404);
            }

            return c.json({ data });
    })
    .delete(
        "/:id",
        clerkMiddleware(),
        zValidator(
            "param",
            z.object({
                id: z.string().optional(),
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid("param");

            if (!id) {
                return c.json({ error: "Missing id" }, 400);
            }

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await prisma.categories.delete({
                where: {
                    id: id,
                    userId: auth.userId,
                }
            })

            if (!data) {
                return c.json({ error: "Not found" }, 404);
            }

            return c.json({ data });
    })

export default app;
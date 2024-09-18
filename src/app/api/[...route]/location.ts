import { auth } from "@/lib/auth";
import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { zValidator } from "@hono/zod-validator";
import { zHandler } from "@/lib/server/zod";
import { getUserId } from "@/lib/server/hono";

export const schemas = {
  $post: z.object({
    id: z.string().optional(),
    name: z
      .string()
      .min(1, "Name must be at least 1 character")
      .max(255, "Name must be at most 255 characters"),
  }),
};

const app = new Hono()
  .get("/", async (c) => {
    const userId = getUserId();
    const locations = await prisma.location.findMany({
      where: {
        userId: userId,
      },
    });

    return c.json(locations ?? []);
  })
  .post("/", zValidator("json", schemas.$post, zHandler), async (c) => {
    const body = c.req.valid("json");
    const userId = getUserId();

    const existingLocation = await prisma.location.findFirst({
      where: {
        name: body.name,
        userId: userId,
        NOT: {
          id: body.id,
        },
      },
    });
    if (existingLocation) {
      return c.json({ error: `${body.name} is already exists` }, 400);
    }

    // Create new location
    if (!body.id) {
      const location = await prisma.location.create({
        data: {
          name: body.name,
          userId: userId,
        },
      });

      return c.json(location);
    }

    // Update existing location
    const location = await prisma.location.update({
      where: {
        id: body.id,
        userId: userId,
      },
      data: {
        name: body.name,
      },
    });

    return c.json(location);
  })
  .get(
    "/delete/:id",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      }),
      zHandler,
    ),
    async (c) => {
      const body = c.req.valid("param");
      const userId = getUserId();

      const location = await prisma.location.delete({
        where: {
          id: body.id,
          userId: userId,
        },
      });

      return c.json(location);
    },
  )
  .get(
    "/default/:id",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      }),
      zHandler,
    ),
    async (c) => {
      const body = c.req.valid("param");
      const userId = getUserId();

      await prisma.location.updateMany({
        where: {
          userId: userId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });

      const location = await prisma.location.update({
        where: {
          id: body.id,
          userId: userId,
        },
        data: {
          isDefault: true,
        },
      });

      return c.json(location);
    },
  );

export default app;

import { auth } from "../../../lib/auth";
import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";
import { zValidator } from "@hono/zod-validator";
import { zHandler } from "./zod";

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
    const session = await auth();

    if (!session || !session?.user || !session.user.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const locations = await prisma.location.findMany({
      where: {
        userId: session.user.id,
      },
    });

    return c.json(locations ?? []);
  })
  .post("/", zValidator("json", schemas.$post, zHandler), async (c) => {
    const session = await auth();
    if (!session?.user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const body = c.req.valid("json");

    const existingLocation = await prisma.location.findFirst({
      where: {
        name: body.name,
        userId: session.user.id,
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
          userId: session.user.id,
        },
      });

      return c.json(location);
    }

    // Update existing location
    const location = await prisma.location.update({
      where: {
        id: body.id,
        userId: session.user.id,
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
      const session = await auth();
      if (!session?.user?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const body = c.req.valid("param");

      const location = await prisma.location.delete({
        where: {
          id: body.id,
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
      const session = await auth();

      if (!session || !session?.user || !session.user.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const body = c.req.valid("param");

      await prisma.location.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });

      const location = await prisma.location.update({
        where: {
          id: body.id,
          userId: session.user.id,
        },
        data: {
          isDefault: true,
        },
      });

      return c.json(location);
    },
  );

export default app;

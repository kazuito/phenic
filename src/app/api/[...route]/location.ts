import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/server/hono";
import { zHandler } from "@/lib/server/zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

export const schemas = {
  $post: z.object({
    name: z
      .string()
      .min(1, "Name must be at least 1 character")
      .max(100, "Name must be at most 100 characters"),
  }),
  $put: z.object({
    name: z
      .string()
      .min(1, "Name must be at least 1 character")
      .max(100, "Name must be at most 100 characters"),
  }),
};

const app = new Hono()
  // Get locations
  .get("/", async (c) => {
    const userId = getUserId();
    const locations = await prisma.location.findMany({
      where: {
        userId: userId,
      },
    });

    return c.json(locations ?? []);
  })
  // Create new location
  .post("/", zValidator("json", schemas.$post, zHandler), async (c) => {
    const body = c.req.valid("json");
    const userId = getUserId();

    const existingLocation = await prisma.location.findFirst({
      where: {
        name: body.name,
        userId: userId,
      },
    });
    if (existingLocation) {
      return c.json({ error: `${body.name} is already exists` }, 400);
    }

    const location = await prisma.location.create({
      data: {
        name: body.name,
        userId: userId,
      },
    });

    return c.json(location);
  })
  // Update location
  .put("/:id", zValidator("json", schemas.$put, zHandler), async (c) => {
    const { id } = c.req.param();
    const body = c.req.valid("json");
    const userId = getUserId();

    const location = await prisma.location.findUnique({
      where: {
        id: id,
        userId: userId,
      },
    });
    if (!location) {
      return c.json({ error: "Location not found" }, 404);
    }

    const existingLocation = await prisma.location.findFirst({
      where: {
        name: body.name,
        userId: userId,
        NOT: {
          id: id,
        },
      },
    });
    if (existingLocation) {
      return c.json({ error: `${body.name} is already exists` }, 400);
    }

    const updatedLocation = await prisma.location.update({
      where: {
        id: id,
        userId: userId,
      },
      data: {
        name: body.name,
      },
    });

    return c.json(updatedLocation);
  })
  // Delete location
  .delete("/:id", async (c) => {
    const { id } = c.req.param();
    const userId = getUserId();

    const deletedLocation = await prisma.location.delete({
      where: {
        id: id,
        userId: userId,
      },
    });

    return c.json(deletedLocation);
  })
  // Set default location
  .put("/default/:id", async (c) => {
    const { id } = c.req.param();
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

    const newDefaultLocation = await prisma.location.update({
      where: {
        id: id,
        userId: userId,
      },
      data: {
        isDefault: true,
      },
    });

    return c.json(newDefaultLocation);
  });

export default app;

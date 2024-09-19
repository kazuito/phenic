import { prisma } from "@/lib/prisma";
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { getUserId } from "@/lib/server/hono";
import { zHandler } from "@/lib/server/zod";

export const schemas = {
  $get: z.object({
    limit: z.string().optional(),
    offset: z.string().optional(),
  }),
  $post: z.object({
    date: z.string(),
    locationId: z.string(),
    newLocationName: z.string(),
  }),
};

const app = new Hono()
  // get all workout
  .get("/", zValidator("query", schemas.$get, zHandler), async (c) => {
    const { limit, offset } = c.req.valid("query");
    const userId = getUserId();

    const workouts = await prisma.workout.findMany({
      where: {
        userId: userId,
      },
      include: {
        sets: {
          include: {
            exercise: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        location: true,
      },
      orderBy: {
        date: "desc",
      },
      take: parseInt(limit || "10"),
      skip: parseInt(offset || "0"),
    });

    return c.json(workouts);
  })
  // get workout by id
  .get("/:id", async (c) => {
    const { id } = c.req.param();
    const userId = getUserId();

    const workout = await prisma.workout.findUnique({
      where: {
        id: id,
        userId: userId,
      },
      include: {
        sets: {
          include: {
            exercise: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        location: true,
      },
    });

    if (!workout) {
      return c.json({ error: "Not found" }, 404);
    }

    return c.json(workout);
  })
  // create new workout
  .post("/", zValidator("json", schemas.$post), async (c) => {
    const body = c.req.valid("json");
    const userId = getUserId();

    let locationId = body.locationId;

    if (body.locationId === "new") {
      const newLocation = await prisma.location.create({
        data: {
          name: body.newLocationName,
          userId: userId,
        },
      });

      locationId = newLocation.id;
    }

    const newWorkout = await prisma.workout.create({
      data: {
        date: new Date(body.date),
        userId: userId,
        locationId: locationId,
      },
      include: {
        sets: {
          include: {
            exercise: true,
          },
        },
        location: true,
      },
    });

    return c.json(newWorkout);
  })
  .delete("/:id", async (c) => {
    const { id } = c.req.param();
    const userId = getUserId();

    const workout = await prisma.workout.delete({
      where: {
        id: id,
        userId: userId,
      },
    });

    return c.json(workout);
  });

export default app;

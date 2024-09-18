import { prisma } from "@/lib/prisma";
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { getUserId } from "@/lib/server/hono";

export const schemas = {
  $post: z.object({
    date: z.string(),
    locationId: z.string(),
    newLocationName: z.string(),
  }),
  delete: {
    [":id"]: {
      $get: z.object({
        id: z.string(),
      }),
    },
  },
};

const app = new Hono()
  // get all workout
  .get("/", async (c) => {
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
    });

    return c.json(workouts);
  })
  // get workout by id
  .get("/:id", zValidator("param", z.object({ id: z.string() })), async (c) => {
    const params = c.req.valid("param");

    const workout = await prisma.workout.findUnique({
      where: {
        id: params.id,
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
  .get(
    "/delete/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const params = c.req.valid("param");
      const userId = getUserId();

      const workout = await prisma.workout.delete({
        where: {
          id: params.id,
          userId: userId,
        },
      });

      return c.json(workout);
    },
  );

export default app;

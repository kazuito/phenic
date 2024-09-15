import { prisma } from "@/lib/prisma";
import { auth } from "../../../lib/auth";
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

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
    const session = await auth();

    if (!session || !session?.user || !session.user.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const workouts = await prisma.workout.findMany({
      where: {
        userId: session.user.id,
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
    const session = await auth();

    if (!session || !session?.user || !session.user.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

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
    const session = await auth();

    if (!session || !session?.user || !session.user.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = c.req.valid("json");

    let locationId = body.locationId;

    if (body.locationId === "new") {
      const newLocation = await prisma.location.create({
        data: {
          name: body.newLocationName,
          userId: session.user.id,
        },
      });

      locationId = newLocation.id;
    }

    const newWorkout = await prisma.workout.create({
      data: {
        date: new Date(body.date),
        userId: session.user.id,
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
      const session = await auth();
      if (!session || !session?.user || !session.user.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const params = c.req.valid("param");

      const workout = await prisma.workout.delete({
        where: {
          id: params.id,
          userId: session.user.id,
        },
      });

      return c.json(workout);
    }
  );

export default app;

import { auth } from "../../../lib/auth";
import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";
import { zValidator } from "@hono/zod-validator";
import { ExerciseType } from "@prisma/client";

export const schemas = {
  post: z.object({}),
};

const app = new Hono()
  .get("/", async (c) => {
    const session = await auth();
    if (!session?.user?.id) return c.json({ error: "Unauthorized" }, 401);

    const exercises = await prisma.exercise.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return c.json(exercises);
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        id: z.string().optional(),
        name: z.string(),
        type: z.nativeEnum(ExerciseType),
      })
    ),
    async (c) => {
      const session = await auth();
      if (!session?.user?.id) return c.json({ error: "Unauthorized" }, 401);
      const body = c.req.valid("json");

      const existingExercise = await prisma.exercise.findFirst({
        where: {
          title: body.name,
          userId: session.user.id,
        },
      });
      if (existingExercise) {
        return c.json({ error: `${body.name} is already exists` }, 400);
      }

      // Create new exercise
      if (body.id === undefined) {
        const exercise = await prisma.exercise.create({
          data: {
            title: body.name,
            type: body.type,
            userId: session.user.id,
          },
        });

        return c.json(exercise);
      }

      // Update existing exercise
      // Users can't update 'type' of exercise
      const exercise = await prisma.exercise.update({
        where: {
          id: body.id,
          userId: session.user.id,
        },
        data: {
          title: body.name,
        },
      });

      return c.json(exercise);
    }
  )
  .get(
    "/delete/:id",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      const session = await auth();
      if (!session?.user?.id) return c.json({ error: "Unauthorized" }, 401);
      const body = c.req.valid("param");

      const exercise = await prisma.exercise.delete({
        where: {
          id: body.id,
          userId: session.user.id,
        },
      });

      return c.json(exercise);
    }
  );
export default app;

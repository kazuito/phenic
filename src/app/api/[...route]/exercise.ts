import { auth } from "../../../lib/auth";
import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";
import { zValidator } from "@hono/zod-validator";
import { ExerciseType, Prisma } from "@prisma/client";
import { zHandler } from "./zod";

export const schemas = {
  $post: z.object({
    id: z.string().optional(),
    name: z
      .string()
      .min(1, "Name must be at least 1 character")
      .max(255, "Name must be at most 255 characters"),
    iconName: z.string(),
    type: z.nativeEnum(ExerciseType),
  }),
};

const basicExerciseSelect: Partial<Prisma.ExerciseSelect> = {
  id: true,
  title: true,
  type: true,
  iconName: true,
  createdAt: true,
};

const minimalExerciseSelect: Partial<Prisma.ExerciseSelect> = {
  id: true,
};

const app = new Hono()
  .get("/", async (c) => {
    const session = await auth();
    if (!session?.user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const exercises = await prisma.exercise.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        title: "asc",
      },
      select: basicExerciseSelect,
    });

    return c.json(exercises);
  })
  .post("/", zValidator("json", schemas.$post, zHandler), async (c) => {
    const session = await auth();
    if (!session?.user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const body = c.req.valid("json");

    const existingExercise = await prisma.exercise.findFirst({
      where: {
        title: body.name,
        userId: session.user.id,
        NOT: {
          id: body.id,
        },
      },
      select: minimalExerciseSelect,
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
          iconName: body.iconName,
          userId: session.user.id,
        },
        select: basicExerciseSelect,
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
        iconName: body.iconName,
      },
      select: basicExerciseSelect,
    });

    return c.json(exercise);
  })
  .get(
    "/delete/:id",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      }),
      zHandler
    ),
    async (c) => {
      const session = await auth();
      if (!session?.user?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const body = c.req.valid("param");

      const exercise = await prisma.exercise.delete({
        where: {
          id: body.id,
          userId: session.user.id,
        },
        select: minimalExerciseSelect,
      });

      return c.json(exercise);
    }
  );
export default app;

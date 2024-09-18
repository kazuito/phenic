import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { zValidator } from "@hono/zod-validator";
import { ExerciseType, Prisma } from "@prisma/client";
import { zHandler } from "@/lib/server/zod";
import { getUserId } from "@/lib/server/hono";

export const schemas = {
  $post: z.object({
    name: z
      .string()
      .min(1, "Name must be at least 1 character")
      .max(255, "Name must be at most 255 characters"),
    iconName: z.string(),
    type: z.nativeEnum(ExerciseType),
  }),
  $put: z.object({
    name: z
      .string()
      .min(1, "Name must be at least 1 character")
      .max(255, "Name must be at most 255 characters"),
    iconName: z.string(),
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
  // Get exercises
  .get("/", async (c) => {
    const userId = getUserId();
    const exercises = await prisma.exercise.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        title: "asc",
      },
      select: basicExerciseSelect,
    });

    return c.json(exercises);
  })
  // Create new exercise
  .post("/", zValidator("json", schemas.$post, zHandler), async (c) => {
    const body = c.req.valid("json");
    const userId = getUserId();

    const existingExercise = await prisma.exercise.findFirst({
      where: {
        title: body.name,
        userId: userId,
      },
      select: minimalExerciseSelect,
    });
    if (existingExercise) {
      return c.json({ error: `${body.name} is already exists` }, 400);
    }

    const exercise = await prisma.exercise.create({
      data: {
        title: body.name,
        type: body.type,
        iconName: body.iconName,
        userId: userId,
      },
      select: basicExerciseSelect,
    });

    return c.json(exercise);
  })
  // Update existing exercise
  .put("/:id", zValidator("json", schemas.$put, zHandler), async (c) => {
    const { id } = c.req.param();
    const body = c.req.valid("json");
    const userId = getUserId();

    const existingExercise = await prisma.exercise.findFirst({
      where: {
        title: body.name,
        userId: userId,
        NOT: {
          id: id,
        },
      },
      select: minimalExerciseSelect,
    });

    if (existingExercise) {
      return c.json({ error: `${body.name} is already exists` }, 400);
    }

    const exercise = await prisma.exercise.update({
      where: {
        id: id,
        userId: userId,
      },
      data: {
        title: body.name,
        iconName: body.iconName,
      },
      select: basicExerciseSelect,
    });

    return c.json(exercise);
  })
  // Delete exercise
  .delete("/:id", async (c) => {
    const { id } = c.req.param();
    const userId = getUserId();

    const set = await prisma.set.findFirst({
      where: {
        exerciseId: id,
      },
      select: {
        id: true,
      },
    });

    if (set) {
      return c.json({ error: "Cannot delete exercise connected to set" }, 400);
    }

    const exercise = await prisma.exercise.delete({
      where: {
        id: id,
        userId: userId,
      },
      select: minimalExerciseSelect,
    });

    return c.json(exercise);
  });

export default app;

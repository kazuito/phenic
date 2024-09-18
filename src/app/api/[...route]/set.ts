import { prisma } from "@/lib/prisma";
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { ExerciseType } from "@prisma/client";
import { getUserId } from "@/lib/server/hono";
import { zHandler } from "@/lib/server/zod";

export const schemas = {
  $post: z.object({
    exerciseId: z.string(),
    weight: z.number().min(0, "Weight must be greater than or equal to 0"),
    reps: z
      .number()
      .int("Reps must be integer")
      .min(0, "Reps must be greater than or equal to 0"),
    distance: z.number().min(0, "Distance must be greater than or equal to 0"),
    time: z.number().min(0, "Time must be greater than or equal to 0"),
    memo: z.string().max(255, "Memo is too long"),
    workoutId: z.string(),
  }),
  $put: z.object({
    exerciseId: z.string(),
    weight: z.number().min(0, "Weight must be greater than or equal to 0"),
    reps: z
      .number()
      .int("Reps must be integer")
      .min(0, "Reps must be greater than or equal to 0"),
    distance: z.number().min(0, "Distance must be greater than or equal to 0"),
    time: z.number().min(0, "Time must be greater than or equal to 0"),
    memo: z.string().max(255, "Memo is too long"),
    workoutId: z.string(),
  }),
  delete: z.object({
    id: z.string(),
  }),
};

const app = new Hono()
  // Create new set
  .post("/", zValidator("json", schemas.$post), async (c) => {
    const body = c.req.valid("json");
    const userId = getUserId();

    const exercise = await prisma.exercise.findUnique({
      where: {
        id: body.exerciseId,
        userId: userId,
      },
    });
    if (!exercise) {
      return c.json({ error: "Exercise not found" }, 404);
    }

    const newSet = await prisma.set.create({
      data: {
        userId: userId,
        exerciseId: body.exerciseId,
        weight: body.weight,
        reps: body.reps,
        distance: body.distance,
        time: body.time,
        memo: body.memo,
        workoutId: body.workoutId,
      },
      include: {
        exercise: true,
      },
    });

    return c.json(newSet);
  })
  // Update set
  .put("/:id", zValidator("json", schemas.$put, zHandler), async (c) => {
    const { id } = c.req.param();
    const body = c.req.valid("json");
    const userId = getUserId();

    const set = await prisma.set.findUnique({
      where: {
        id: id,
        userId: userId,
      },
    });
    if (!set) {
      return c.json({ error: "Set not found" }, 404);
    }

    const updatedSet = await prisma.set.update({
      where: {
        id: id,
        userId: userId,
      },
      data: {
        exerciseId: body.exerciseId,
        weight: body.weight,
        reps: body.reps,
        distance: body.distance,
        time: body.time,
        memo: body.memo,
      },
      include: {
        exercise: true,
      },
    });

    return c.json(updatedSet);
  })
  // Delete set
  .delete("/:id", async (c) => {
    const { id } = c.req.param();
    const userId = getUserId();

    const deletedSet = await prisma.set.delete({
      where: {
        id: id,
        userId: userId,
      },
    });

    return c.json(deletedSet);
  });

export default app;

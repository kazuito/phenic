import { prisma } from "@/lib/prisma";
import { auth } from "../../../lib/auth";
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

export const schemas = {
  post: z.object({
    exerciseId: z.string(),
    weight: z.number().min(0, "Weight must be greater than or equal to 0"),
    reps: z
      .number()
      .int("Reps must be integer")
      .min(0, "Reps must be greater than or equal to 0"),
    memo: z.string().max(255, "Memo is too long"),
    workoutId: z.string(),
    newExerciseName: z.string(),
    setId: z.string().optional(),
  }),
};

const app = new Hono().post(
  "/",
  zValidator("json", schemas.post),
  async (c) => {
    const session = await auth();

    console.log(session);

    if (!session || !session?.user || !session.user.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = c.req.valid("json");

    // Create new exercise
    if (body.exerciseId === "new") {
      if (!body.newExerciseName.trim()) {
        return c.json({ error: "Missing new exercise name" }, 400);
      }

      const newExercise = await prisma.exercise.create({
        data: {
          title: body.newExerciseName,
          userId: session.user.id,
        },
      });

      body.exerciseId = newExercise.id;
    }

    // Update existing set
    if (body.setId) {
      const updatedWork = await prisma.set.update({
        where: {
          id: body.setId,
          userId: session.user.id,
        },
        data: {
          exerciseId: body.exerciseId,
          weight: body.weight,
          reps: body.reps,
          memo: body.memo,
        },
        include: {
          exercise: true,
        },
      });

      return c.json(updatedWork);
    }

    // Create new set
    const newWork = await prisma.set.create({
      data: {
        userId: session.user.id,
        exerciseId: body.exerciseId,
        weight: body.weight,
        reps: body.reps,
        memo: body.memo,
        workoutId: body.workoutId,
      },
      include: {
        exercise: true,
      },
    });

    return c.json(newWork);
  }
);

export default app;

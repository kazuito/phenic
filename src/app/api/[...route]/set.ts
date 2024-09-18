import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { ExerciseType } from "@prisma/client";
import { getUserId } from "@/lib/server/hono";

export const schemas = {
  post: z.object({
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
    newExerciseName: z.string(),
    newExerciseType: z.nativeEnum(ExerciseType),
    newIconName: z.string(),
    setId: z.string().optional(),
  }),
  delete: z.object({
    id: z.string(),
  }),
};

const app = new Hono()
  .post("/", zValidator("json", schemas.post), async (c) => {
    const body = c.req.valid("json");
    const userId = getUserId();
    let exerciseType = body.newExerciseType;

    // Create new exercise
    if (body.exerciseId === "new") {
      if (!body.newExerciseName.trim()) {
        return c.json({ error: "Missing new exercise name" }, 400);
      }
      const existingExercise = await prisma.exercise.findFirst({
        where: {
          title: body.newExerciseName,
          userId: userId,
        },
      });
      if (existingExercise) {
        return c.json({ error: "Exercise already exists" }, 400);
      }

      const newExercise = await prisma.exercise.create({
        data: {
          title: body.newExerciseName,
          type: body.newExerciseType,
          iconName: body.newIconName,
          userId: userId,
        },
      });
      body.exerciseId = newExercise.id;
    } else {
      const exercise = await prisma.exercise.findUnique({
        where: {
          id: body.exerciseId,
          userId: userId,
        },
      });
      if (!exercise) {
        return c.json({ error: "Exercise not found" }, 404);
      }
      exerciseType = exercise.type;
    }

    // Update existing set
    if (body.setId) {
      const updatedWork = await prisma.set.update({
        where: {
          id: body.setId,
          userId: userId,
        },
        data: {
          exerciseId: body.exerciseId,
          weight:
            exerciseType === ExerciseType.STRENGTH ? body.weight : undefined,
          reps: exerciseType === ExerciseType.STRENGTH ? body.reps : undefined,
          distance:
            exerciseType === ExerciseType.CARDIO ? body.distance : undefined,
          time: exerciseType === ExerciseType.CARDIO ? body.time : undefined,
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
        userId: userId,
        exerciseId: body.exerciseId,
        weight:
          exerciseType === ExerciseType.STRENGTH ? body.weight : undefined,
        reps: exerciseType === ExerciseType.STRENGTH ? body.reps : undefined,
        distance:
          exerciseType === ExerciseType.CARDIO ? body.distance : undefined,
        time: exerciseType === ExerciseType.CARDIO ? body.time : undefined,
        memo: body.memo,
        workoutId: body.workoutId,
      },
      include: {
        exercise: true,
      },
    });

    return c.json(newWork);
  })
  .delete("/:id", zValidator("param", schemas.delete), async (c) => {
    const params = c.req.valid("param");
  });

export default app;

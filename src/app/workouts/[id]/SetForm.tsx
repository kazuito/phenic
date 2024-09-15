"use client";

import { useForm } from "@tanstack/react-form";
import Icon from "@/components/Icon";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import client from "@/lib/hono";
import { Textarea } from "@/components/ui/textarea";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { InferResponseType } from "hono";
import { $Enums, ExerciseType, Prisma } from "@prisma/client";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { toast } from "sonner";

type Props = {
  setSets: Dispatch<
    SetStateAction<
      Prisma.SetGetPayload<{
        include: {
          exercise: true;
        };
      }>[]
    >
  >;
  workoutId: string;
  defaultValues?: Prisma.SetGetPayload<{
    include: {
      exercise: true;
    };
  }>;
};

const WorkForm = (props: Props) => {
  const isUpdate = props.defaultValues ? true : false;

  const [exercises, setExercises] = useState<
    InferResponseType<typeof client.api.exercise.$get, 200>
  >([]);

  const { Field, handleSubmit, useStore } = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: props.defaultValues
      ? {
          exerciseId: props.defaultValues.exerciseId,
          weight: props.defaultValues.weight ?? 0.0,
          reps: props.defaultValues.reps ?? 0,
          memo: props.defaultValues.memo,
          newExerciseName: "",
          newExerciseType: "STRENGTH",
        }
      : {
          exerciseId: "",
          weight: 0.0,
          reps: 0,
          memo: "",
          newExerciseName: "",
          newExerciseType: "STRENGTH",
        },
    onSubmit: async ({ value }) => {
      console.log(value);

      const res = await client.api.set.$post({
        json: {
          exerciseId: value.exerciseId,
          weight: value.weight,
          reps: value.reps,
          memo: value.memo,
          newExerciseName: value.newExerciseName,
          workoutId: props.workoutId,
          setId: props.defaultValues?.id,
        },
      });

      if (!res.ok) {
        toast.error(
          isUpdate ? "Failed to update set" : "Failed to add new set"
        );
        return;
      }

      toast.success(
        isUpdate ? "Updated set successfully" : "Added new set successfully"
      );

      const newSet: Prisma.SetGetPayload<{
        include: {
          exercise: true;
        };
      }> = await res.json().then((w) => {
        return {
          ...w,
          createdAt: new Date(w.createdAt),
          updatedAt: new Date(w.updatedAt),
          exercise: {
            ...w.exercise,
            createdAt: new Date(w.exercise.createdAt),
            updatedAt: new Date(w.exercise.updatedAt),
          },
        };
      });

      if (isUpdate) {
        props.setSets((prev) =>
          prev.map((s) => (s.id === newSet.id ? newSet : s))
        );
      } else {
        props.setSets((prev) => [...prev, newSet]);
      }
    },
  });

  const values = useStore((state) => state.values);

  const fetchExercises = async () => {
    const res = await client.api.exercise.$get();

    if (!res.ok) {
      return;
    }

    const exercises = await res.json();

    setExercises(exercises);
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Field
        name="exerciseId"
        children={({ state, handleChange, handleBlur }) => (
          <Select
            defaultValue={state.value === "" ? undefined : state.value}
            onValueChange={handleChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Exercise" />
            </SelectTrigger>
            <SelectContent onBlur={handleBlur}>
              {exercises.map((exercise, i) => {
                return (
                  <SelectItem key={i} value={exercise.id}>
                    {exercise.title}
                  </SelectItem>
                );
              })}
              <SelectItem value="new">Add new exercise</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
      {values.exerciseId === "new" && (
        <div className="p-4 -mt-3 bg-neutral-50 rounded-b-lg flex space-y-2 flex-col shadow-md border border-dashed">
          <Field
            name="newExerciseName"
            children={({ state, handleChange, handleBlur }) => (
              <Input
                error={state.meta.errors[0]?.toString()}
                placeholder="Exercise name"
                value={state.value}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={handleBlur}
              />
            )}
          />
          <Field
            name="newExerciseType"
            children={({ state, handleChange, handleBlur }) => (
              <Select
                defaultValue={state.value === "" ? undefined : state.value}
                onValueChange={handleChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Exercise Type" />
                </SelectTrigger>
                <SelectContent onBlur={handleBlur}>
                  {["STRENGTH", "CARDIO"].map((t, i) => {
                    return (
                      <SelectItem key={i} value={t}>
                        {t.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      )}
      <Field
        name="weight"
        children={({ state, handleChange, handleBlur }) => (
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                handleChange((prev) => (prev - 10 >= 0 ? prev - 10 : 0))
              }
              size="icon"
              className="shrink-0"
              disabled={state.value <= 0}
            >
              -10
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                handleChange((prev) => (prev - 2.5 >= 0 ? prev - 2.5 : 0))
              }
              size="icon"
              className="shrink-0"
              disabled={state.value <= 0}
            >
              -2.5
            </Button>
            <div className="grow flex justify-center items-baseline">
              <Input
                type="number"
                className="border-none text-3xl font-bold text-center p-0"
                value={state.value}
                onChange={(e) => handleChange(Number(e.target.value))}
                onBlur={handleBlur}
                style={{
                  width: `${
                    state.value.toString().replace(".", "").length + 1
                  }ch`,
                }}
              />
              <div>kg</div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleChange((prev) => prev + 2.5)}
              size="icon"
              className="shrink-0"
            >
              +2.5
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleChange((prev) => prev + 10)}
              size="icon"
              className="shrink-0"
            >
              +10
            </Button>
          </div>
        )}
      />
      <Field
        name="reps"
        children={({ state, handleChange, handleBlur }) => (
          <div className="flex gap-1.5">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                handleChange((prev) => (prev - 10 >= 0 ? prev - 10 : 0))
              }
              size="icon"
              className="shrink-0"
              disabled={state.value <= 0}
            >
              -10
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                handleChange((prev) => (prev - 1 >= 0 ? prev - 1 : 0))
              }
              size="icon"
              className="shrink-0"
              disabled={state.value <= 0}
            >
              -1
            </Button>
            <div className="grow justify-center flex items-baseline">
              <Input
                size={1}
                className="border-none text-3xl font-bold text-center p-0"
                style={{
                  width: `${
                    state.value.toString().replace(".", "").length + 1
                  }ch`,
                }}
                type="number"
                value={state.value}
                onChange={(e) => handleChange(parseInt(e.target.value))}
                onBlur={handleBlur}
              />
              <div className="">reps</div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleChange((prev) => prev + 1)}
              size="icon"
              className="shrink-0"
            >
              +1
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleChange((prev) => prev + 10)}
              size="icon"
              className="shrink-0"
            >
              +10
            </Button>
          </div>
        )}
      />
      <Field
        name="memo"
        children={({ state, handleChange, handleBlur }) => (
          <Textarea
            value={state.value}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            placeholder="Memo"
          />
        )}
      />

      <div className="flex flex-row">
        {isUpdate && (
          <Button type="button" variant="destructive">
            Delete
          </Button>
        )}
        <Button type="submit" className="ml-auto gap-1.5">
          {isUpdate ? "Update" : "Add"}
        </Button>
      </div>
    </form>
  );
};

export default WorkForm;

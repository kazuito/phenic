"use client";

import { FieldState, Updater, useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import client from "@/lib/hono";
import { Textarea } from "@/components/ui/textarea";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { InferResponseType } from "hono";
import { ExerciseType, Prisma } from "@prisma/client";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExtraSheet from "@/components/myui/extra-sheet";

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
  isEdit?: boolean;
  initialOpen?: boolean;
};

const WorkForm = ({ isEdit = false, initialOpen = false, ...props }: Props) => {
  const [exercises, setExercises] = useState<
    InferResponseType<typeof client.api.exercise.$get, 200>
  >([]);
  const [selectedExerciseType, setSelectedExerciseType] =
    useState<ExerciseType | null>(props.defaultValues?.exercise.type ?? null);

  const { Field, handleSubmit, useStore } = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: props.defaultValues
      ? {
          exerciseId: props.defaultValues.exerciseId,
          weight: props.defaultValues.weight ?? 0.0,
          reps: props.defaultValues.reps ?? 0,
          memo: props.defaultValues.memo,
          distance: props.defaultValues.distance ?? 0.0,
          time: props.defaultValues.time ?? 0,
          newExerciseName: "",
          newExerciseType: "STRENGTH",
        }
      : {
          exerciseId: "",
          weight: 0.0,
          reps: 0,
          distance: 0.0,
          time: 0,
          memo: "",
          newExerciseName: "",
          newExerciseType: "STRENGTH",
        },
    onSubmit: async ({ value }) => {
      const res = await client.api.set.$post({
        json: {
          exerciseId: value.exerciseId,
          weight: value.weight,
          reps: value.reps,
          distance: value.distance,
          time: value.time,
          memo: value.memo,
          newExerciseName: value.newExerciseName,
          newExerciseType: value.newExerciseType as ExerciseType,
          workoutId: props.workoutId,
          setId: isEdit ? props.defaultValues?.id : undefined,
        },
      });

      if (!res.ok) {
        toast.error(isEdit ? "Failed to update set" : "Failed to add new set");
        return;
      }

      toast.success(
        isEdit ? "Updated set successfully" : "Added new set successfully"
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

      if (isEdit) {
        props.setSets((prev) =>
          prev.map((s) => (s.id === newSet.id ? newSet : s))
        );
      } else {
        props.setSets((prev) => [...prev, newSet]);
      }
    },
  });

  const values = useStore((state) => state.values);
  const isSubmitting = useStore((state) => state.isSubmitting);

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

  type CustomNumberInputProps = {
    state: FieldState<number>;
    handleChange: (updater: Updater<number>) => void;
    handleBlur: () => void;
    values: {
      in?: (value: number) => number;
      out?: (value: number) => number;
      unit: string;
    }[];
    smallValue: number;
    bigValue: number;
  };

  const CustomNumberInput = ({
    state,
    handleChange,
    handleBlur,
    values = [],
    smallValue,
    bigValue,
  }: CustomNumberInputProps) => {
    return (
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            handleChange((prev) => (prev - bigValue >= 0 ? prev - bigValue : 0))
          }
          size="icon"
          className="shrink-0"
          disabled={state.value <= 0}
        >
          -{bigValue}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            handleChange((prev) =>
              prev - smallValue >= 0 ? prev - smallValue : 0
            )
          }
          size="icon"
          className="shrink-0"
          disabled={state.value <= 0}
        >
          -{smallValue}
        </Button>
        <div className="grow flex justify-center items-center -space-x-1">
          {values.map((value, i) => {
            const outValue = value.out ? value.out(state.value) : state.value;
            return (
              <div key={i} className="flex items-baseline -space-x-1">
                <Input
                  type="number"
                  className="bg-transparent border-none text-3xl font-bold text-center p-0"
                  value={outValue}
                  onChange={(e) =>
                    handleChange(() => {
                      if (value.in) {
                        return value.in(Number(e.target.value));
                      }
                      return Number(e.target.value);
                    })
                  }
                  onBlur={handleBlur}
                  style={{
                    width: `${
                      outValue.toString().replace(".", "").length + 1
                    }ch`,
                  }}
                />
                <div>{value.unit}</div>
              </div>
            );
          })}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleChange((prev) => prev + smallValue)}
          size="icon"
          className="shrink-0"
        >
          +{smallValue}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleChange((prev) => prev + bigValue)}
          size="icon"
          className="shrink-0"
        >
          +{bigValue}
        </Button>
      </div>
    );
  };

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
            defaultOpen={initialOpen}
            defaultValue={state.value === "" ? undefined : state.value}
            onValueChange={(value) => {
              handleChange(value);
              setSelectedExerciseType(
                exercises.find((exercise) => exercise.id === value)?.type ??
                  null
              );
            }}
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
              <SelectSeparator />
              <SelectItem value="new">Add new exercise</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
      {values.exerciseId === "new" && (
        <ExtraSheet className="-mt-3">
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
              <Tabs
                defaultValue={state.value}
                value={state.value}
                onValueChange={handleChange}
                onBlur={handleBlur}
              >
                <TabsList className="w-full">
                  <TabsTrigger className="grow" value="STRENGTH">
                    Strength
                  </TabsTrigger>
                  <TabsTrigger className="grow" value="CARDIO">
                    Cardio
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          />
        </ExtraSheet>
      )}
      {selectedExerciseType == ExerciseType.STRENGTH ||
      (values.exerciseId === "new" &&
        values.newExerciseType == ExerciseType.STRENGTH) ? (
        <>
          <Field
            name="weight"
            children={({ state, handleChange, handleBlur }) => (
              <CustomNumberInput
                state={state}
                handleChange={handleChange}
                handleBlur={handleBlur}
                values={[{ unit: "kg" }]}
                smallValue={2.5}
                bigValue={10}
              />
            )}
          />
          <Field
            name="reps"
            children={({ state, handleChange, handleBlur }) => (
              <CustomNumberInput
                state={state}
                handleChange={handleChange}
                handleBlur={handleBlur}
                values={[{ unit: "reps" }]}
                smallValue={1}
                bigValue={10}
              />
            )}
          />
        </>
      ) : null}

      {selectedExerciseType == ExerciseType.CARDIO ||
      (values.exerciseId === "new" &&
        values.newExerciseType === ExerciseType.CARDIO) ? (
        <>
          <Field
            name="distance"
            children={({ state, handleChange, handleBlur }) => (
              <CustomNumberInput
                state={state}
                handleChange={handleChange}
                handleBlur={handleBlur}
                values={[{ unit: "km" }]}
                smallValue={0.1}
                bigValue={1}
              />
            )}
          />
          <Field
            name="time"
            children={({ state, handleChange, handleBlur }) => (
              <CustomNumberInput
                state={state}
                handleChange={handleChange}
                handleBlur={handleBlur}
                values={[
                  {
                    in: (value) => value * 60,
                    out: (value) => Math.floor(value / 60),
                    unit: "m",
                  },
                  {
                    in: (value) => value,
                    out: (value) => value % 60,
                    unit: "s",
                  },
                ]}
                smallValue={15}
                bigValue={120}
              />
            )}
          />
        </>
      ) : null}

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
        {isEdit && (
          <Button type="button" variant="destructive">
            Delete
          </Button>
        )}
        <Button
          type="submit"
          className="ml-auto gap-1.5"
          isLoading={isSubmitting}
        >
          {isEdit ? "Update" : "Add"}
        </Button>
      </div>
    </form>
  );
};

export default WorkForm;

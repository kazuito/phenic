"use client";

import ExtraSheet from "@/components/myui/extra-sheet";
import TempMessage from "@/components/TempMessage";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import client from "@/lib/hono";
import { getExerciseIcon } from "@/lib/utils/getIcon";
import { ExerciseType, Prisma } from "@prisma/client";
import { FieldState, Updater, useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { InferResponseType } from "hono";
import { PlusIcon } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
          memo: "",
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
    onSubmit: async ({ value, formApi }) => {
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
        const e = await res.json();
        toast.error("error" in e ? e.error : "Something went wrong");
        return;
      }

      setMessage(isEdit ? "Updated" : "Added");

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

      formApi.setFieldValue("memo", "");
    },
  });

  const [message, setMessage] = useState<string | null>();

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
    disabled?: boolean;
  };

  const CustomNumberInput = ({
    state,
    handleChange,
    handleBlur,
    values = [],
    smallValue,
    bigValue,
    disabled,
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
          disabled={state.value <= 0 || disabled}
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
          disabled={state.value <= 0 || disabled}
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
          disabled={disabled}
        >
          +{smallValue}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleChange((prev) => prev + bigValue)}
          size="icon"
          className="shrink-0"
          disabled={disabled}
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
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Exercise" />
            </SelectTrigger>
            <SelectContent onBlur={handleBlur}>
              {exercises.map((exercise, i) => {
                return (
                  <SelectItem key={i} value={exercise.id}>
                    <div className="flex items-center gap-2">
                      {getExerciseIcon(exercise.iconName, { size: 18 })}
                      <span className="font-semibold">{exercise.title}</span>
                    </div>
                  </SelectItem>
                );
              })}
              <SelectSeparator />
              <SelectItem value="new">
                <div className="flex items-center gap-2">
                  <PlusIcon size={16} />
                  Add new exercise
                </div>
              </SelectItem>
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
                disabled={isSubmitting}
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
                  <TabsTrigger
                    className="grow"
                    value="STRENGTH"
                    disabled={isSubmitting}
                  >
                    Strength
                  </TabsTrigger>
                  <TabsTrigger
                    className="grow"
                    value="CARDIO"
                    disabled={isSubmitting}
                  >
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
            disabled={isSubmitting}
            className="min-h-[42px]"
            rows={1}
          />
        )}
      />

      <div className="flex flex-row justify-between">
        {isEdit && (
          <Button type="button" variant="destructive" disabled={isSubmitting}>
            Delete
          </Button>
        )}
        <TempMessage
          trigger={message}
          setter={setMessage}
          className="flex items-center"
        >
          <Alert type="inline" color="success" heading={message}></Alert>
        </TempMessage>
        <Button type="submit" className="" isLoading={isSubmitting}>
          {isEdit ? "Update" : "Add"}
        </Button>
      </div>
    </form>
  );
};

export default WorkForm;

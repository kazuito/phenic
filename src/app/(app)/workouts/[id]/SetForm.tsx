"use client";

import IconSelector from "@/components/IconSelector";
import ExtraSheet from "@/components/myui/extra-sheet";
import TempMessage from "@/components/TempMessage";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { showErrorToast } from "@/lib/utils/utils";
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
  defaultSet?: Prisma.SetGetPayload<{
    include: {
      exercise: true;
    };
  }>;
  isEdit?: boolean;
  initialOpen?: boolean;
  exercises: InferResponseType<typeof client.api.exercise.$get, 200>;
  onDelete?: (setId: string) => void;
};

const WorkForm = ({
  isEdit = false,
  initialOpen = false,
  onDelete,
  ...props
}: Props) => {
  const [exercises, setExercises] = useState<
    InferResponseType<typeof client.api.exercise.$get, 200>
  >(props.exercises);
  const [selectedExerciseType, setSelectedExerciseType] =
    useState<ExerciseType | null>(
      props.defaultSet?.exercise.type ?? exercises[0]?.type ?? null,
    );

  const { Field, handleSubmit, useStore } = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: props.defaultSet
      ? {
          exerciseId: props.defaultSet.exerciseId,
          weight: props.defaultSet.weight ?? 0.0,
          reps: props.defaultSet?.reps ?? 0,
          memo: isEdit ? props.defaultSet.memo : "",
          distance: props.defaultSet.distance ?? 0.0,
          time: props.defaultSet.time ?? 0,
          newExerciseName: "",
          newExerciseType: "STRENGTH",
          newIconName: props.defaultSet.exercise.iconName,
        }
      : {
          exerciseId: exercises[0]?.id ?? "",
          weight: 0.0,
          reps: 0,
          distance: 0.0,
          time: 0,
          memo: "",
          newExerciseName: "",
          newExerciseType: "STRENGTH",
          newIconName: "dumbbell",
        },
    onSubmit: async ({ value, formApi }) => {
      let exerciseId = value.exerciseId;
      let newSet: InferResponseType<typeof client.api.set.$post, 200>;

      // Create new exercise
      if (value.exerciseId === "new") {
        const res = await client.api.exercise.$post({
          json: {
            name: value.newExerciseName,
            iconName: value.newIconName,
            type: value.newExerciseType as ExerciseType,
          },
        });

        if (!res.ok) {
          showErrorToast(res);
          return;
        }

        const newExercise = await res.json();
        setExercises((prev) => [...prev, newExercise]);
        formApi.setFieldValue("exerciseId", newExercise.id);
        setSelectedExerciseType(newExercise.type);
        exerciseId = newExercise.id;
      }

      // Update set
      if (isEdit) {
        const res = await client.api.set[":id"].$put({
          param: {
            id: props.defaultSet?.id ?? "",
          },
          json: {
            exerciseId: exerciseId,
            weight: value.weight,
            reps: value.reps,
            distance: value.distance,
            time: value.time,
            memo: value.memo,
            workoutId: props.workoutId,
          },
        });

        if (!res.ok) {
          showErrorToast(res);
          return;
        }

        newSet = await res.json();
        setMessage("Updated");
      }
      // Create new set
      else {
        const res = await client.api.set.$post({
          json: {
            exerciseId: exerciseId,
            weight: value.weight,
            reps: value.reps,
            distance: value.distance,
            time: value.time,
            memo: value.memo,
            workoutId: props.workoutId,
          },
        });

        if (!res.ok) {
          showErrorToast(res);
          return;
        }

        newSet = await res.json();
        setMessage("Added");
      }

      const typedNewSet: Prisma.SetGetPayload<{
        include: {
          exercise: true;
        };
      }> = {
        ...newSet,
        createdAt: new Date(newSet.createdAt),
        updatedAt: new Date(newSet.updatedAt),
        exercise: {
          ...newSet.exercise,
          createdAt: new Date(newSet.exercise.createdAt),
          updatedAt: new Date(newSet.exercise.updatedAt),
        },
      };

      if (isEdit) {
        props.setSets((prev) =>
          prev.map((s) => (s.id === newSet.id ? typedNewSet : s)),
        );
      } else {
        props.setSets((prev) => [...prev, typedNewSet]);
      }

      formApi.setFieldValue("memo", "");
    },
  });

  const [message, setMessage] = useState<string | null>();

  const values = useStore((state) => state.values);
  const isSubmitting = useStore((state) => state.isSubmitting);

  const deleteSet = async () => {
    const res = await client.api.set[":id"].$delete({
      param: {
        id: props.defaultSet?.id ?? "",
      },
    });
    if (!res.ok) {
      return;
    }
    const deletedSet = await res.json();
    onDelete?.(deletedSet.id);
    toast.success(`${props.defaultSet?.exercise.title ?? "Exercise"} Deleted`);
  };

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
              prev - smallValue >= 0 ? prev - smallValue : 0,
            )
          }
          size="icon"
          className="shrink-0"
          disabled={state.value <= 0 || disabled}
        >
          -{smallValue}
        </Button>
        <div className="flex grow items-center justify-center -space-x-1">
          {values.map((value, i) => {
            const outValue = value.out ? value.out(state.value) : state.value;
            return (
              <div key={i} className="flex items-baseline -space-x-1">
                <Input
                  type="number"
                  className="border-none bg-transparent p-0 text-center text-3xl font-bold"
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
      {values.exerciseId === "new" ? (
        <Field
          name="newIconName"
          children={({ state, handleChange }) => (
            <Popover>
              <PopoverTrigger asChild>
                <div className="mx-auto w-fit cursor-pointer rounded-lg border border-dashed p-2 transition-colors hover:bg-neutral-50">
                  {getExerciseIcon(state.value, {
                    size: 60,
                  })}
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <IconSelector
                  defaultValue={state.value}
                  value={state.value}
                  onSelected={handleChange}
                />
              </PopoverContent>
            </Popover>
          )}
        />
      ) : (
        <div className="mx-auto w-fit p-2">
          {getExerciseIcon(
            exercises.find((e) => e.id === values.exerciseId)?.iconName,
            {
              size: 60,
            },
          )}
        </div>
      )}
      <Field
        name="exerciseId"
        children={({ state, handleChange, handleBlur }) => (
          <Select
            defaultOpen={initialOpen}
            defaultValue={state.value}
            onValueChange={(value) => {
              handleChange(value);
              setSelectedExerciseType(
                exercises.find((exercise) => exercise.id === value)?.type ??
                  null,
              );
            }}
            disabled={isSubmitting}
          >
            <SelectTrigger className="justify-center gap-2">
              {state.value === "" || state.value === "new" ? (
                <SelectValue placeholder="Select exercise" />
              ) : (
                <SelectValue className="w-full text-center">
                  <span className="font-semibold">
                    {exercises.find((e) => e.id === state.value)?.title}
                  </span>
                </SelectValue>
              )}
            </SelectTrigger>
            <SelectContent onBlur={handleBlur}>
              {exercises
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((exercise, i) => {
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
          <DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={() => deleteSet()}
              disabled={isSubmitting}
            >
              Delete
            </Button>
          </DialogClose>
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

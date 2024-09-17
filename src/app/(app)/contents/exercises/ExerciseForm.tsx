import IconSelector from "@/components/IconSelector";
import TempMessage from "@/components/TempMessage";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import client from "@/lib/hono";
import { ExerciseIconName, getExerciseIcon } from "@/lib/utils/getIcon";
import { ExerciseType } from "@prisma/client";
import { useForm } from "@tanstack/react-form";
import { InferResponseType } from "hono";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

type Props = {
  defaultValue?: InferResponseType<typeof client.api.exercise.$get, 200>[0];
  setExercises: Dispatch<
    SetStateAction<InferResponseType<typeof client.api.exercise.$get, 200>>
  >;
  isEdit?: boolean;
};

const ExerciseForm = ({
  defaultValue,
  setExercises,
  isEdit = false,
}: Props) => {
  const { Field, handleSubmit, useStore } = useForm({
    defaultValues: defaultValue
      ? {
          name: defaultValue.title,
          type: defaultValue.type,
          iconName: defaultValue.iconName,
        }
      : {
          name: "",
          type: "STRENGTH",
          iconName: "dumbbell",
        },
    onSubmit: async ({ value }) => {
      const res = await client.api.exercise.$post({
        json: {
          id: isEdit ? defaultValue?.id : undefined,
          name: value.name,
          iconName: value.iconName,
          type: value.type as ExerciseType,
        },
      });

      if (!res.ok) {
        const e = await res.json();
        toast.error("error" in e ? e.error : "Something went wrong");
        return;
      }

      const data = await res.json();
      setMessage(isEdit ? "Updated" : "Added");

      if (isEdit) {
        setExercises((prev) => prev.map((e) => (e.id === data.id ? data : e)));
      } else {
        setExercises((prev) => [data, ...prev]);
      }
    },
  });

  const [message, setMessage] = useState<string | null>(null);

  const isSubmitting = useStore((state) => state.isSubmitting);

  return (
    <div className="">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col gap-3"
      >
        <Field
          name="iconName"
          children={({ state, handleChange, handleBlur }) => (
            <Popover>
              <PopoverTrigger asChild>
                <div className="cursor-pointer p-2 border border-dashed rounded-lg w-fit mx-auto hover:bg-neutral-50 transition-colors">
                  {getExerciseIcon(state.value as ExerciseIconName, {
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
        <Field
          name="name"
          children={({ state, handleChange, handleBlur }) => (
            <Input
              className="text-base"
              value={state.value}
              onChange={(e) => handleChange(e.target.value)}
              onBlur={handleBlur}
              placeholder="Exercise name"
            />
          )}
        />
        <Field
          name="type"
          children={({ state, handleChange }) => (
            <Tabs
              defaultValue={state.value}
              value={state.value}
              onValueChange={handleChange}
            >
              <TabsList className="w-full">
                <TabsTrigger
                  className="grow"
                  value={ExerciseType.STRENGTH}
                  disabled={isEdit}
                >
                  Strength
                </TabsTrigger>
                <TabsTrigger
                  className="grow"
                  value={ExerciseType.CARDIO}
                  disabled={isEdit}
                >
                  Cardio
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        />
        <div className="flex">
          <TempMessage
            trigger={message}
            setter={setMessage}
            className="flex items-center"
          >
            <Alert type="inline" color="success" heading={message}></Alert>
          </TempMessage>
          <Button type="submit" className="ml-auto" isLoading={isSubmitting}>
            {isEdit ? "Update" : "Add"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ExerciseForm;

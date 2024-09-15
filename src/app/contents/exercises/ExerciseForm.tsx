import { useForm } from "@tanstack/react-form";
import { InferResponseType } from "hono";
import client from "@/lib/hono";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";

type Props = {
  defaultValue?: InferResponseType<typeof client.api.exercise.$get, 200>[0];
  setExercises: Dispatch<
    SetStateAction<InferResponseType<typeof client.api.exercise.$get, 200>>
  >;
};

const ExerciseForm = ({ defaultValue, setExercises }: Props) => {
  const isEditing = defaultValue ? true : false;

  const { Field, handleSubmit } = useForm({
    defaultValues: defaultValue
      ? {
          name: defaultValue.title,
        }
      : {
          name: "",
        },
    onSubmit: async ({ value }) => {
      const res = await client.api.exercise.$post({
        json: {
          id: defaultValue?.id ?? "",
          name: value.name,
        },
      });

      if (!res.ok) return;

      const data = await res.json();

      if (isEditing) {
        setExercises((prev) => prev.map((e) => (e.id === data.id ? data : e)));
      } else {
        setExercises((prev) => [data, ...prev]);
      }
    },
  });

  return (
    <div className="">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
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
        <div className="flex mt-4">
          <DialogClose asChild>
            <Button type="submit" className="ml-auto">
              Save
            </Button>
          </DialogClose>
        </div>
      </form>
    </div>
  );
};

export default ExerciseForm;

import { useForm } from "@tanstack/react-form";
import { InferResponseType } from "hono";
import client from "@/lib/hono";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

type Props = {
  defaultValue?: InferResponseType<typeof client.api.location.$get, 200>[0];
  setLocations: Dispatch<
    SetStateAction<InferResponseType<typeof client.api.location.$get, 200>>
  >;
};

const LocationForm = ({ defaultValue, setLocations }: Props) => {
  const isEditing = defaultValue ? true : false;

  const { Field, handleSubmit } = useForm({
    defaultValues: defaultValue
      ? {
          name: defaultValue.name,
        }
      : {
          name: "",
        },
    onSubmit: async ({ value }) => {
      const res = await client.api.location.$post({
        json: {
          id: defaultValue?.id ?? "",
          name: value.name,
        },
      });

      if (!res.ok) {
        toast.error("Failed to save location");
        return;
      }

      toast.success(
        `Location ${isEditing ? "updated" : "created"} successfully`
      );

      const data = await res.json();

      if (isEditing) {
        setLocations((prev) => prev.map((e) => (e.id === data.id ? data : e)));
      } else {
        setLocations((prev) => [data, ...prev]);
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
              placeholder="Location name"
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

export default LocationForm;

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import client from "@/lib/hono";
import { useForm } from "@tanstack/react-form";
import { InferResponseType } from "hono";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

type Props = {
  defaultValue?: InferResponseType<typeof client.api.location.$get, 200>[0];
  setLocations: Dispatch<
    SetStateAction<InferResponseType<typeof client.api.location.$get, 200>>
  >;
  isEdit?: boolean;
};

const LocationForm = ({
  defaultValue,
  setLocations,
  isEdit = false,
}: Props) => {
  const { Field, handleSubmit, useStore } = useForm({
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
          id: isEdit ? defaultValue?.id : undefined,
          name: value.name,
        },
      });

      if (!res.ok) {
        const e = await res.json();
        toast.error("error" in e ? e.error : "Something went wrong");
        return;
      }

      toast.success(`Location ${isEdit ? "updated" : "created"} successfully`);

      const data = await res.json();

      if (isEdit) {
        setLocations((prev) => prev.map((e) => (e.id === data.id ? data : e)));
      } else {
        setLocations((prev) => [data, ...prev]);
      }
    },
  });

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
        <div className="flex">
          <Button type="submit" className="ml-auto" isLoading={isSubmitting}>
            {isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LocationForm;

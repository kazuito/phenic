import TempMessage from "@/components/TempMessage";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import client from "@/lib/hono";
import { getErrorMessage, showErrorToast } from "@/lib/utils/utils";
import { useForm } from "@tanstack/react-form";
import { InferResponseType } from "hono";
import { Dispatch, SetStateAction, useState } from "react";

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
  const [error, setError] = useState<string>();
  const { Field, handleSubmit, useStore } = useForm({
    defaultValues: defaultValue
      ? {
          name: defaultValue.name,
        }
      : {
          name: "",
        },
    onSubmit: async ({ value }) => {
      if (isEdit) {
        const res = await client.api.location[":id"].$put({
          param: {
            id: defaultValue?.id ?? "",
          },
          json: {
            name: value.name,
          },
        });

        if (!res.ok) {
          setError(await getErrorMessage(res));
          return;
        }

        const data = await res.json();
        setLocations((prev) => prev.map((e) => (e.id === data.id ? data : e)));
        setMessage("Updated");
      } else {
        const res = await client.api.location.$post({
          json: {
            name: value.name,
          },
        });

        if (!res.ok) {
          setError(await getErrorMessage(res));
          return;
        }

        const data = await res.json();
        setLocations((prev) => [data, ...prev]);
        setMessage("Added");
      }

      setError("");
    },
  });

  const [message, setMessage] = useState<string | null>();

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
              error={error || state.meta.errors.join(", ")}
            />
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
            {isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LocationForm;

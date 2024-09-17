"use client";

import ExtraSheet from "@/components/myui/extra-sheet";
import TempMessage from "@/components/TempMessage";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import client from "@/lib/hono";
import { useForm } from "@tanstack/react-form";
import dayjs from "dayjs";
import { InferResponseType } from "hono";
import { Calendar as IconCalendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const WorkoutForm = () => {
  const router = useRouter();

  const { Field, useStore, handleSubmit, setFieldValue } = useForm({
    defaultValues: {
      date: new Date(),
      locationId: "",
      newLocationName: "",
    },
    onSubmit: async ({ value }) => {
      const res = await client.api.workout.$post({
        json: {
          ...value,
          date: value.date.toISOString(),
        },
      });
      if (!res.ok) {
        return;
      }
      const newWorkout = await res.json();
      router.push(`/workouts/${newWorkout.id}`);
    },
  });

  const isSubmitting = useStore((state) => state.isSubmitting);
  const selectedLocationId = useStore((state) => state.values.locationId);

  const [locations, setLocations] = useState<InferResponseType<
    typeof client.api.location.$get,
    200
  > | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      const res = await client.api.location.$get();

      if (!res.ok) {
        return;
      }
      const data = await res.json();
      setLocations(data);

      data.forEach((location) => {
        if (location.isDefault) {
          setFieldValue("locationId", location.id);
        }
      });
    };

    fetchLocations();
  }, []);

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
          name="locationId"
          children={({ state, handleChange, handleBlur }) => (
            <Select
              value={state.value}
              onValueChange={handleChange}
              disabled={locations === null}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent onBlur={handleBlur}>
                {locations?.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                    {location.isDefault && (
                      <Badge variant="outline" className="ml-2">
                        Default
                      </Badge>
                    )}
                  </SelectItem>
                ))}
                <SelectSeparator />
                <SelectItem value="new">New location</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {selectedLocationId === "new" && (
          <ExtraSheet className="-mt-2">
            <Field
              name="newLocationName"
              children={({ state, handleChange, handleBlur }) => (
                <Input
                  placeholder="New location name"
                  value={state.value}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                />
              )}
            />
          </ExtraSheet>
        )}
        <Field
          name="date"
          children={({ state, handleChange }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button className="justify-start" variant="outline">
                  <IconCalendar className="mr-2" size={16} />
                  {state.value ? (
                    dayjs(state.value).format("MMM D, YYYY")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  {dayjs(state.value).date() === dayjs().date() && (
                    <Badge variant="outline" className="ml-auto">
                      Today
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={state.value}
                  onSelect={(date) => handleChange(date as Date)}
                />
              </PopoverContent>
            </Popover>
          )}
        />

        <div className="flex flex-row justify-between">
          <Button type="submit" className="ml-auto" isLoading={isSubmitting}>
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WorkoutForm;

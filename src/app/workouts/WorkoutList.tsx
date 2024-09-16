"use client";

import Workout from "./Workout";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import client from "@/lib/hono";
import { InferResponseType } from "hono";
import Icon from "@/components/Icon";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import WorkoutForm from "./WorkoutForm";
import { Skeleton } from "@/components/ui/skeleton";

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState<
    InferResponseType<typeof client.api.workout.$get, 200>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const res = await client.api.workout.$get();
      if (!res.ok) {
        return;
      }
      const workouts = await res.json();
      setWorkouts(workouts);
      setIsLoading(false);
    };

    fetchWorkouts();
  }, []);

  return (
    <div className={cn("flex flex-col items-center p-4")}>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full" variant="outline">
            <Icon name="Plus" className="mr-2" size={16} />
            New Workout
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Workout</DialogTitle>
          </DialogHeader>
          <WorkoutForm />
        </DialogContent>
      </Dialog>
      {isLoading && (
        <div className="mt-4 flex flex-col gap-2 w-full">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton className="h-24 w-full rounded-xl shrink-0" key={i} />
          ))}
        </div>
      )}
      {!isLoading && workouts.length === 0 ? (
        <div className="py-20 text-neutral-400">
          Let's add your first workout!
        </div>
      ) : null}
      {!isLoading && workouts.length > 0 ? (
        <div className="flex flex-col mt-4 w-full gap-2">
          {workouts.map((workout, i) => {
            return <Workout workout={workout} key={i} />;
          })}
        </div>
      ) : null}
    </div>
  );
};

export default WorkoutList;

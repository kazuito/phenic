"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import client from "@/lib/hono";
import { InferResponseType } from "hono";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Workout from "./Workout";
import WorkoutForm from "./WorkoutForm";

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
    <div className="flex flex-col items-center px-4">
      {isLoading && (
        <div className="flex w-full flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton className="h-24 w-full shrink-0 rounded-xl" key={i} />
          ))}
        </div>
      )}
      {!isLoading && workouts.length === 0 ? (
        <div className="py-20 text-neutral-400">
          Let's add your first workout!
        </div>
      ) : null}
      {!isLoading && workouts.length > 0 ? (
        <div className="flex w-full flex-col gap-2">
          {workouts.map((workout, i) => {
            return <Workout workout={workout} key={i} />;
          })}
        </div>
      ) : null}
      <div className="sticky bottom-16 mt-4 w-full md:bottom-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="w-full animate-fade-in-up rounded-full shadow-lg"
              size="lg"
            >
              <Plus className="mr-2" size={16} />
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
      </div>
    </div>
  );
};

export default WorkoutList;

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
import { cn } from "@/lib/utils/utils";

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState<
    InferResponseType<typeof client.api.workout.$get, 200>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWorkouts = async () => {
    const res = await client.api.workout.$get({
      query: {
        limit: "15",
        offset: "0",
      },
    });
    if (!res.ok) {
      return;
    }
    const data = await res.json();

    setIsLoading(false);

    if (data.length === 0) {
      return;
    }
    setWorkouts(data);
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  return (
    <div className="flex flex-col items-center md:px-4">
      {isLoading && (
        <div className="flex w-full flex-col gap-1 md:gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              className="h-[170px] w-full shrink-0 md:h-[120px] md:rounded-xl"
              key={i}
            />
          ))}
        </div>
      )}
      {!isLoading && workouts.length === 0 ? (
        <div className="py-20 text-neutral-400">
          Let's add your first workout!
        </div>
      ) : null}
      <div className="flex w-full flex-col -space-y-1 overflow-auto md:space-y-2">
        {workouts.map((workout, i) => {
          return <Workout workout={workout} isRecent={i === 0} key={i} />;
        })}
      </div>
      <div className="sticky bottom-16 mt-4 w-full px-4 md:bottom-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className={cn(
                "w-full rounded-full opacity-0 shadow-lg",
                !isLoading && "animate-fade-in-up",
              )}
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

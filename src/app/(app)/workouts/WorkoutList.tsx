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
import { useEffect, useRef, useState } from "react";
import Workout from "./Workout";
import WorkoutForm from "./WorkoutForm";
import { cn } from "@/lib/utils/utils";
import InfiniteScroll from "@/components/InfiniteScroll";
import { Spinner } from "@/components/myui/spinner";

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState<
    InferResponseType<typeof client.api.workout.$get, 200>
  >([]);
  const [isInitLoading, setIsInitLoading] = useState(true);
  const [noMore, setNoMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const fetched = useRef(false);

  const fetchWorkouts = async () => {
    const res = await client.api.workout.$get({
      query: {
        limit: "15",
        offset: offset.toString(),
      },
    });
    if (!res.ok) {
      return;
    }
    const data = await res.json();
    if (data.length === 0) {
      setNoMore(true);
      return;
    }
    setOffset((prev) => prev + data.length);
    setWorkouts((prev) => [...prev, ...data]);
    setIsInitLoading(false);
  };

  useEffect(() => {
    if (!fetched.current) {
      fetched.current = true;
      fetchWorkouts();
    }
  }, []);

  return (
    <div className="flex flex-col items-center px-4">
      {isInitLoading && (
        <div className="flex w-full flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton className="h-24 w-full shrink-0 rounded-xl" key={i} />
          ))}
        </div>
      )}
      {!isInitLoading && workouts.length === 0 ? (
        <div className="py-20 text-neutral-400">
          Let's add your first workout!
        </div>
      ) : null}
      <InfiniteScroll
        onMore={fetchWorkouts}
        noMore={noMore}
        className="flex w-full flex-col gap-2 overflow-auto"
        loadingContent={<Spinner className="mx-auto my-4" />}
      >
        {workouts.map((workout, i) => {
          return <Workout workout={workout} key={i} />;
        })}
      </InfiniteScroll>
      <div className="sticky bottom-16 mt-4 w-full md:bottom-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className={cn(
                "w-full rounded-full opacity-0 shadow-lg",
                !isInitLoading && "animate-fade-in-up",
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

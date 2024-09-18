"use client";

import { ListMenu, ListMenuGroup } from "@/components/myui/list-menu";
import PageHeader from "@/components/PageHeader";
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
import Exercise from "./Exercise";
import ExerciseForm from "./ExerciseForm";

const Page = () => {
  const [exercises, setExercises] = useState<
    InferResponseType<typeof client.api.exercise.$get, 200>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchExercises = async () => {
    const res = await client.api.exercise.$get();
    if (!res.ok) {
      return;
    }
    const data = await res.json();
    setExercises(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  return (
    <div className="pb-20">
      <PageHeader heading="Exercises" backHref="/contents" />
      <div className="px-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              <Plus className="mr-2" size={16} />
              New Exercise
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Exercise</DialogTitle>
            </DialogHeader>
            <ExerciseForm setExercises={setExercises} />
          </DialogContent>
        </Dialog>
        {isLoading ? (
          <Skeleton className="h-96 w-full mt-4 rounded-xl" />
        ) : (
          <ListMenu>
            <ListMenuGroup className="mt-4">
              {exercises.map((exercise, i) => {
                return (
                  <Exercise
                    setExercises={setExercises}
                    exercise={exercise}
                    key={i}
                  />
                );
              })}
            </ListMenuGroup>
          </ListMenu>
        )}
      </div>
    </div>
  );
};

export default Page;

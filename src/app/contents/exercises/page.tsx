"use client";

import { useEffect, useState } from "react";
import client from "@/lib/hono";
import { InferResponseType } from "hono";
import PageHeader from "@/components/PageHeader";
import Exercise from "./Exercise";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Icon from "@/components/Icon";
import ExerciseForm from "./ExerciseForm";
import { ListMenu, ListMenuGroup } from "@/components/myui/list-menu";
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="">
      <PageHeader title="Exercises" backHref="/contents" />
      <div className="px-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              <Icon name="Plus" className="mr-2" size={16} />
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

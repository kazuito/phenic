"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import client from "@/lib/hono";
import { catSeries } from "@/lib/utils/utils";
import { Prisma } from "@prisma/client";
import { InferResponseType } from "hono";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import WorkForm from "./SetForm";
import SetItem from "./SetItem";
import WorkHeader from "./SetItemHeader";
import { getExerciseIcon } from "@/lib/utils/getIcon";

type Props = {
  workout: Prisma.WorkoutGetPayload<{
    include: {
      sets: {
        include: {
          exercise: true;
        };
      };
    };
  }>;
};

const Sets = ({ workout }: Props) => {
  const [sets, setSets] = useState<
    Prisma.SetGetPayload<{
      include: {
        exercise: true;
      };
    }>[]
  >(workout.sets);

  const [exercises, setExercises] = useState<
    InferResponseType<typeof client.api.exercise.$get, 200>
  >([]);

  const fetchExercises = async () => {
    const res = await client.api.exercise.$get();
    if (!res.ok) {
      return;
    }
    const exercises = await res.json();
    setExercises(exercises);
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const workGroups = catSeries(sets, (set) => set.exercise.title);

  return (
    <div className="flex flex-col gap-4 px-4 sm:px-10">
      {workGroups.map((workGroup, i) => {
        return (
          <div key={i} className="flex gap-2">
            <div className="flex shrink-0 flex-col items-center gap-3">
              <div className="text-neutral-700">
                {getExerciseIcon(workGroup[0].exercise.iconName, {
                  size: 22,
                })}
              </div>
              <div className="w-2 shrink-0 grow rounded-full bg-gradient-to-b from-blue-600 via-cyan-200 to-transparent"></div>
            </div>
            <div className="grow">
              <WorkHeader exerciseName={workGroup[0].exercise.title} />
              <div className="mt-1 flex flex-col">
                {workGroup.map((set, j) => {
                  return (
                    <SetItem
                      key={j}
                      set={set}
                      indexOfSet={j}
                      setSets={setSets}
                      workoutId={workout.id}
                      exercises={exercises}
                    />
                  );
                })}
                {i === workGroups.length - 1 && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="mt-2 w-full"
                        variant="outline"
                        size="sm"
                      >
                        <Plus size={14} className="mr-2" />
                        Add {workGroup[0].exercise.title}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>New Set</DialogTitle>
                      </DialogHeader>
                      <WorkForm
                        setSets={setSets}
                        workoutId={workout.id}
                        defaultValues={workGroup[workGroup.length - 1]}
                        exercises={exercises}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="sticky bottom-16 mt-2 w-full rounded-full shadow-lg md:bottom-4"
            size="lg"
          >
            <Plus size={14} className="mr-2" />
            Add new set
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Set</DialogTitle>
          </DialogHeader>
          <WorkForm
            setSets={setSets}
            workoutId={workout.id}
            exercises={exercises}
            initialOpen
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sets;

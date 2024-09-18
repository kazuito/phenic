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
import WorkHeader from "./WorkHeader";

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
    <div className="px-4 flex flex-col gap-4 sm:px-10">
      {workGroups.map((workGroup, i) => {
        return (
          <div key={i} className="flex gap-4">
            <div className="w-2 bg-gradient-to-b shrink-0 from-blue-500 to-pink-00 rounded-full"></div>
            <div className="grow">
              <WorkHeader exerciseName={workGroup[0].exercise.title} />
              <div className="mt-2 flex flex-col">
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
                        className="w-full mt-2"
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
            className="w-full mt-2 rounded-full sticky bottom-[72px] shadow-lg"
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

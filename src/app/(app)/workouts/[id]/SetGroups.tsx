"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { catSeries } from "@/lib/utils/utils";
import { ExerciseType, Prisma } from "@prisma/client";
import { Ellipsis, Plus, X } from "lucide-react";
import { useState } from "react";
import WorkForm from "./SetForm";
import WorkHeader from "./WorkHeader";
import SetItem from "./SetItem";

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
          <WorkForm setSets={setSets} workoutId={workout.id} initialOpen />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sets;

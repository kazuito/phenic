"use client";

import Icon from "@/components/Icon";
import { Prisma } from "@prisma/client";
import WorkHeader from "./WorkHeader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import WorkForm from "./SetForm";
import { catSeries } from "@/lib/utils";
import { useState } from "react";

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
                    <Dialog key={j}>
                      <DialogTrigger asChild>
                        <div className="-ml-1.5 cursor-pointer flex items-center gap-1 py-0.5 rounded-md px-1.5">
                          <div className="tracking-tighter mr-1 size-5 text-sm font-bold bg-black text-white grid place-content-center rounded-md">
                            {j + 1}
                          </div>
                          <div className="font-bold text-xl">
                            {set.weight}kg
                          </div>
                          <Icon name="X" size={14} />
                          <div>{set.reps}</div>
                          <div className="truncate text-sm ml-2 text-neutral-400">
                            {set.memo}
                          </div>
                          <div className="ml-auto"></div>
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {set.exercise.title} - Set {j + 1}
                          </DialogTitle>
                        </DialogHeader>
                        <WorkForm
                          setSets={setSets}
                          workoutId={workout.id}
                          defaultValues={set}
                        />
                      </DialogContent>
                    </Dialog>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full mt-2" variant="outline" size="sm">
            <Icon name="Plus" size={14} />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Set</DialogTitle>
          </DialogHeader>
          <WorkForm setSets={setSets} workoutId={workout.id} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sets;

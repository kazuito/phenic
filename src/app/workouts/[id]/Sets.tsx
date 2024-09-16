"use client";

import { ExerciseType, Prisma } from "@prisma/client";
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
import { Ellipsis, Plus, X } from "lucide-react";

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
                          {set.exercise.type === ExerciseType.STRENGTH ? (
                            <>
                              <div className="font-bold text-xl">
                                {set.weight}kg
                              </div>
                              <X size={14} />
                              <div>{set.reps}</div>
                            </>
                          ) : (
                            <>
                              <div className="font-bold text-xl">
                                {set.distance}km
                              </div>
                              <Ellipsis size={14} />
                              <div className="flex items-center gap-0.5">
                                <div>{Math.floor((set.time ?? 0) / 60)}m</div>
                                <div>{(set.time ?? 0) % 60}s</div>
                              </div>
                            </>
                          )}
                          <div className="truncate text-sm ml-2 text-neutral-400">
                            {set.memo}
                          </div>
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
                          isEdit
                        />
                      </DialogContent>
                    </Dialog>
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
          <WorkForm setSets={setSets} workoutId={workout.id} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sets;

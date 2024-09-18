import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExerciseType, Prisma } from "@prisma/client";
import { EllipsisIcon, XIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import SetForm from "./SetForm";
import SetView from "./SetView";
import { InferResponseType } from "hono";
import client from "@/lib/hono";
import dayjs from "dayjs";

type Props = {
  indexOfSet: number;
  set: Prisma.SetGetPayload<{
    include: {
      exercise: true;
    };
  }>;
  setSets: Dispatch<
    SetStateAction<
      Prisma.SetGetPayload<{
        include: {
          exercise: true;
        };
      }>[]
    >
  >;
  exercises: InferResponseType<typeof client.api.exercise.$get, 200>;
  workoutId: string;
};

const SetItem = ({ indexOfSet, set, setSets, exercises, workoutId }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Dialog onOpenChange={(open) => setIsEditing(open && isEditing)}>
      <DialogTrigger asChild>
        <div className="-ml-1.5 flex w-full cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-0.5 has-[+button]:animate-fade-in-up">
          <div className="mr-1 grid size-5 shrink-0 place-content-center rounded-md bg-black text-sm font-bold tracking-tighter text-white">
            {indexOfSet + 1}
          </div>
          <div className="flex items-center gap-1">
            {set.exercise.type === ExerciseType.STRENGTH ? (
              <>
                <div className="text-xl font-bold">{set.weight}kg</div>
                <XIcon size={14} />
                <div>{set.reps}</div>
              </>
            ) : (
              <>
                <div className="text-xl font-bold">{set.distance}km</div>
                <EllipsisIcon size={14} />
                <div className="flex items-center gap-0.5">
                  <div>{Math.floor((set.time ?? 0) / 60)}m</div>
                  <div>{(set.time ?? 0) % 60}s</div>
                </div>
              </>
            )}
          </div>
          <div className="flex min-w-0 grow items-center justify-end gap-2 text-xs text-neutral-400">
            <div className="max-w-sm truncate">{set.memo}</div>
            <div className="">{dayjs(set.createdAt).format("HH:mm")}</div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent hideCloseButton>
        <DialogHeader>
          <DialogTitle>{set.exercise.title}</DialogTitle>
          <DialogDescription>Set {indexOfSet + 1}</DialogDescription>
        </DialogHeader>
        <Button
          onClick={() => setIsEditing((prev) => !prev)}
          variant="outline"
          className="absolute right-4 top-4 rounded-full"
          size="sm"
        >
          {isEditing ? "Cancel" : "Edit"}
        </Button>
        {isEditing ? (
          <SetForm
            setSets={setSets}
            workoutId={workoutId}
            defaultSet={set}
            exercises={exercises}
            isEdit
            onDelete={(deletedSetId) => {
              setSets((prev) => prev.filter((s) => s.id !== deletedSetId));
              setIsEditing(false);
            }}
          />
        ) : (
          <SetView set={set} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SetItem;

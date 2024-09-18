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
        <div className="-ml-1.5 cursor-pointer flex items-center gap-1 py-0.5 rounded-md px-1.5">
          <div className="tracking-tighter mr-1 size-5 text-sm font-bold bg-black text-white grid place-content-center rounded-md">
            {indexOfSet + 1}
          </div>
          {set.exercise.type === ExerciseType.STRENGTH ? (
            <>
              <div className="font-bold text-xl">{set.weight}kg</div>
              <XIcon size={14} />
              <div>{set.reps}</div>
            </>
          ) : (
            <>
              <div className="font-bold text-xl">{set.distance}km</div>
              <EllipsisIcon size={14} />
              <div className="flex items-center gap-0.5">
                <div>{Math.floor((set.time ?? 0) / 60)}m</div>
                <div>{(set.time ?? 0) % 60}s</div>
              </div>
            </>
          )}
          <div className="truncate text-sm ml-2 text-neutral-400">
            {set.memo}
          </div>
          <div className="text-xs text-neutral-400 ml-auto">
            {dayjs(set.createdAt).format("HH:mm")}
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
            defaultValues={set}
            exercises={exercises}
            isEdit
          />
        ) : (
          <SetView set={set} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SetItem;

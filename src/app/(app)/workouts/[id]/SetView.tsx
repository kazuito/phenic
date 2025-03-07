import { getExerciseIcon } from "@/lib/utils/getIcon";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { CalendarIcon, SlashIcon } from "lucide-react";

type Props = {
  set: Prisma.SetGetPayload<{
    include: {
      exercise: true;
    };
  }>;
};

const SetView = ({ set }: Props) => {
  return (
    <div className="flex flex-col items-center pt-2">
      <div className="">
        {getExerciseIcon(set.exercise.iconName, {
          size: 60,
        })}
      </div>
      <div className="mt-4 flex items-center gap-3">
        {set.exercise.type === "STRENGTH" ? (
          <>
            <div className="flex items-baseline gap-1.5">
              <div className="text-3xl font-bold">{set.weight}</div>
              <div>kg</div>
            </div>
            <SlashIcon size={18} className="text-neutral-400" />
            <div className="flex items-baseline gap-1.5">
              <div className="text-3xl font-bold">{set.reps}</div>
              <div>reps</div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-baseline gap-1.5">
              <div className="text-3xl font-bold">{set.distance}</div>
              <div>km</div>
            </div>
            <SlashIcon size={18} className="text-neutral-400" />
            <div className="flex gap-1.5">
              <div className="flex items-baseline gap-1.5">
                <div className="text-3xl font-bold">
                  {Math.floor((set.time ?? 0) / 60)}
                </div>
                <div>m</div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <div className="text-3xl font-bold">{(set.time ?? 0) % 60}</div>
                <div>s</div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="mt-6 flex w-full flex-col">
        {set.memo && (
          <div className="mx-auto w-fit rounded-xl bg-muted px-4 py-3 text-sm leading-tight">
            {set.memo}
          </div>
        )}
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center justify-between gap-1.5">
            <CalendarIcon size={14} />
            <span>{dayjs(set.createdAt).format("ddd MMM DD, YYYY")}</span>
          </div>
          <span>{dayjs(set.createdAt).format("HH:mm")}</span>
        </div>
      </div>
    </div>
  );
};

export default SetView;

import { Badge } from "@/components/ui/badge";
import client from "@/lib/hono";
import dayjs from "dayjs";
import { InferResponseType } from "hono";
import Link from "next/link";

type Props = {
  workout: InferResponseType<typeof client.api.workout.$get, 200>[0];
};

const Workout = ({ workout }: Props) => {
  const exerciseNames = Array.from(
    new Set(
      workout.sets.map((set) => {
        return set.exercise.title;
      }),
    ),
  );

  return (
    <Link
      href={`/workouts/${workout.id}`}
      className="w-full rounded-lg border p-4"
    >
      <div className="flex items-center gap-1">
        <div className="">{dayjs(workout.date).format("MMM DD")}</div>・
        <div>{workout.location?.name}</div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {exerciseNames.length === 0 && (
          <div className="text-neutral-400">No exercises</div>
        )}
        {exerciseNames.map((exerciseName, i) => {
          return <Badge key={i}>{exerciseName}</Badge>;
        })}
      </div>
    </Link>
  );
};

export default Workout;

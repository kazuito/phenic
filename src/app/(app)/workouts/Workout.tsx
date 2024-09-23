import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import client from "@/lib/hono";
import { cn } from "@/lib/utils/utils";
import dayjs from "dayjs";
import { InferResponseType } from "hono";
import {
  ActivityIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
} from "lucide-react";
import Link from "next/link";

type Props = {
  workout: InferResponseType<typeof client.api.workout.$get, 200>[0];
  isRecent?: boolean;
};

const Workout = ({ workout, isRecent }: Props) => {
  const exerciseNames = Array.from(
    new Set(
      workout.sets.map((set) => {
        return set.exercise.title;
      }),
    ),
  );

  return (
    <Link href={`/workouts/${workout.id}`}>
      <Card className="rounded-none shadow-none md:rounded-lg">
        <CardHeader>
          <CardTitle className={cn("flex items-center gap-4 font-bold")}>
            <div
              className={cn(
                isRecent &&
                  "bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent",
              )}
            >
              {dayjs(workout.date).format("MMM D")}
            </div>
            {isRecent && <Badge className="ml-auto">Recent</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
          <div className="flex items-center space-x-2 text-sm text-neutral-500">
            <ClockIcon className="size-4" />
            <div className="font-semibold">
              {dayjs(workout.date).format("h:mm A")}
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-neutral-500">
            <MapPinIcon className="size-4" />
            <div className="font-semibold">{workout.location?.name}</div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-neutral-500">
            <ActivityIcon className="size-4" />
            <div className="flex w-full items-center gap-1 overflow-auto">
              {exerciseNames.length === 0 && (
                <div className="text-neutral-400">No exercises</div>
              )}
              {exerciseNames.map((exerciseName, i) => {
                return (
                  <Badge variant="outline" key={i} className="shrink-0">
                    {exerciseName}
                  </Badge>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Workout;

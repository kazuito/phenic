import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { notFound } from "next/navigation";
import Works from "./SetGroups";
import InfoCard from "./InfoCard";
import CustomPageHeader from "./CustomPageHeader";

type Props = {
  params: {
    id: string;
  };
};

const Page = async (props: Props) => {
  const workout = await prisma.workout.findUnique({
    where: {
      id: props.params.id,
    },
    include: {
      location: true,
      sets: {
        include: {
          exercise: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!workout) {
    return notFound();
  }

  const dateText = dayjs(workout.date).format("ddd MMM DD");

  return (
    <div className="pb-4">
      <CustomPageHeader heading={dateText} workoutId={workout.id} />
      <div>
        <InfoCard location={workout.location.name} />
        <Works workout={workout} />
      </div>
    </div>
  );
};

export default Page;

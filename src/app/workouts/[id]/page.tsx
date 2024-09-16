import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { notFound } from "next/navigation";
import Works from "./Sets";
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
      },
    },
  });

  if (!workout) {
    return notFound();
  }

  const dateText = dayjs(workout.date).format("MMM DD");

  return (
    <div className="">
      <CustomPageHeader heading={dateText} workoutId={workout.id} />
      <div className="pb-20">
        <InfoCard location={workout.location.name} />
        <Works workout={workout} />
      </div>
    </div>
  );
};

export default Page;

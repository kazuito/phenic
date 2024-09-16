import { Skeleton } from "@/components/ui/skeleton";
import CustomPageHeader from "./CustomPageHeader";

type Props = {};

const Loading = ({}: Props) => {
  return (
    <div>
      <CustomPageHeader
        heading={<Skeleton className="h-5 w-20" />}
        workoutId="loading"
      />
      <div className="p-4">
        <Skeleton className="h-14 w-full rounded-xl" />
        <div className="flex flex-col gap-2 w-full mt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton className="h-40 w-full rounded-xl" key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;

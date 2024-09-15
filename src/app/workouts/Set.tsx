import Icon from "@/components/Icon";
import client from "@/lib/hono";
import { InferResponseType } from "hono";

type Props = {
  work: InferResponseType<typeof client.api.workout.$get, 200>[0]["sets"][0];
};

const Work = ({ work }: Props) => {
  return (
    <div className="">
      <div className="font-semibold">{work.exercise.title}</div>
      <div className="flex gap-1 items-center">
        <div>{work.weight}kg</div>
        <div>
          <Icon name="X" size={14} />
        </div>
        <div>{work.reps}</div>
      </div>
    </div>
  );
};

export default Work;

import { Dumbbell } from "lucide-react";

type Props = {
  location: string;
};

const InfoCard = (props: Props) => {
  return (
    <div className="m-4 mt-0 rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <Dumbbell size={14} />
        <div className="text-sm">{props.location}</div>
      </div>
    </div>
  );
};

export default InfoCard;

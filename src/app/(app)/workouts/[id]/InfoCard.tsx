import { Dumbbell } from "lucide-react";

type Props = {
  location: string;
};

const InfoCard = (props: Props) => {
  return (
    <div className="p-4 m-4 mt-0 rounded-lg border">
      <div className="flex items-center gap-2">
        <Dumbbell size={14} />
        <div className="text-sm">{props.location}</div>
      </div>
    </div>
  );
};

export default InfoCard;

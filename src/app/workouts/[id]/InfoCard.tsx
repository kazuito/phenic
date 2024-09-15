import Icon from "@/components/Icon";

type Props = {
  location: string;
};

const InfoCard = (props: Props) => {
  return (
    <div className="p-4 m-4 rounded-lg border">
      <div className="flex items-center gap-2">
        <Icon name="Dumbbell" size={14} />
        <div className="text-sm">{props.location}</div>
      </div>
    </div>
  );
};

export default InfoCard;

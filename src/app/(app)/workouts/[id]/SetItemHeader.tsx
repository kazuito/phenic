import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  exerciseName: string;
};

const SetHeader = (props: Props) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="font-BebasNeue leading-none text-neutral-700">
        {props.exerciseName}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button size="icon" className="size-6 rounded-full" variant="outline">
            ?
          </Button>
        </PopoverTrigger>
        <PopoverContent>daaa</PopoverContent>
      </Popover>
    </div>
  );
};

export default SetHeader;

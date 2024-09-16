import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  exerciseName: string;
};

const WorkHeader = (props: Props) => {
  return (
    <div className="flex items-center gap-3 justify-between">
      <div>{props.exerciseName}</div>
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

export default WorkHeader;

import { ListMenuItem } from "@/components/myui/list-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import client from "@/lib/hono";
import { InferResponseType } from "hono";
import { EllipsisIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import ExerciseForm from "./ExerciseForm";
import { getExerciseIcon } from "@/lib/utils/getIcon";

type Props = {
  exercise: InferResponseType<typeof client.api.exercise.$get, 200>[0];
  setExercises: Dispatch<
    SetStateAction<InferResponseType<typeof client.api.exercise.$get, 200>>
  >;
};

const Exercise = ({ setExercises, exercise }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const deleteExercise = async () => {
    const res = await client.api.exercise.delete[":id"].$get({
      param: {
        id: exercise.id,
      },
    });
    if (!res.ok) {
      toast.error("Failed to delete exercise");
      return;
    }
    const data = await res.json();
    setExercises((prev) => prev.filter((e) => e.id !== data.id));
    toast.success(`Deleted '${data.title}' successfully`);
  };

  return (
    <>
      <ListMenuItem
        heading={<div className="font-BebasNeue text-lg">{exercise.title}</div>}
        icon={getExerciseIcon(exercise.iconName, { size: 24 })}
        endContent={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <EllipsisIcon size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                icon={<PencilIcon />}
                onClick={() => setIsEditing(true)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                icon={<TrashIcon />}
                onClick={() => deleteExercise()}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit exercise</DialogTitle>
          </DialogHeader>
          <ExerciseForm
            setExercises={setExercises}
            defaultValue={exercise}
            isEdit
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Exercise;

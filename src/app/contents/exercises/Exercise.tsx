import Icon from "@/components/Icon";
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
import { Dispatch, SetStateAction, useState } from "react";
import ExerciseForm from "./ExerciseForm";
import { toast } from "sonner";
import { ListMenuItem } from "@/components/myui/list-menu";

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
        heading={exercise.title}
        endContent={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <Icon name="Ellipsis" size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                iconName="Pencil"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                iconName="Trash"
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
          <ExerciseForm setExercises={setExercises} defaultValue={exercise} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Exercise;

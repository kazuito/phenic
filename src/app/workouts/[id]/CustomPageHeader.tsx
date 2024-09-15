"use client";

import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import client from "@/lib/hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  title: string;
  workoutId: string;
};

const Header = ({ title, workoutId }: Props) => {
  const router = useRouter();
  const deleteWorkout = async () => {
    const res = await client.api.workout.delete[":id"].$get({
      param: {
        id: workoutId,
      },
    });

    if (!res.ok) {
      toast.error("Failed to delete workout");
    }

    toast.success("Workout deleted successfully");
    router.push("/workouts");
  };

  return (
    <PageHeader
      title={title}
      backText="Workouts"
      backHref="/workouts"
      content={
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <Icon name="Ellipsis" size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => deleteWorkout()} iconName="Trash">
              Delete workout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      }
    />
  );
};

export default Header;

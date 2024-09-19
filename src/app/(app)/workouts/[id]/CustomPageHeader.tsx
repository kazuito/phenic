"use client";

import PageHeader from "@/components/PageHeader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import client from "@/lib/hono";
import { showErrorToast } from "@/lib/utils/utils";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import { EllipsisIcon, Trash2Icon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  heading: React.ReactNode;
  workoutId: string;
};

const Header = ({ heading, workoutId }: Props) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();
  const deleteWorkout = async () => {
    const res = await client.api.workout[":id"].$delete({
      param: {
        id: workoutId,
      },
    });

    if (!res.ok) {
      showErrorToast(res);
    }

    toast.success("Workout deleted successfully");
    router.push("/workouts");
  };

  return (
    <>
      <PageHeader
        heading={heading}
        backHref="/workouts"
        content={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <EllipsisIcon size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                icon={<TrashIcon />}
              >
                Delete workout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />
      <AlertDialog open={showDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this workout?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteWorkout()}>
              <TrashIcon size={16} className="mr-2" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Header;

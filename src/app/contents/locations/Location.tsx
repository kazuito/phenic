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
import LocationForm from "./LocationForm";
import { ListMenuItem } from "@/components/myui/list-menu";

type Props = {
  location: InferResponseType<typeof client.api.location.$get, 200>[0];
  setLocations: Dispatch<
    SetStateAction<InferResponseType<typeof client.api.location.$get, 200>>
  >;
};

const Location = ({ setLocations, location }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const deleteLocation = async () => {
    const res = await client.api.location.delete[":id"].$get({
      param: {
        id: location.id,
      },
    });
    if (!res.ok) return;
    const data = await res.json();
    setLocations((prev) => prev.filter((e) => e.id !== data.id));
  };

  return (
    <>
      <ListMenuItem
        title={location.name}
        endContent={
          <div className="ml-auto">
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
                  onClick={() => deleteLocation()}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit location</DialogTitle>
          </DialogHeader>
          <LocationForm setLocations={setLocations} defaultValue={location} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Location;

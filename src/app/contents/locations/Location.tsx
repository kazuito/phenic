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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import client from "@/lib/hono";
import { InferResponseType } from "hono";
import { Dispatch, SetStateAction, useState } from "react";
import LocationForm from "./LocationForm";
import { ListMenuItem } from "@/components/myui/list-menu";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

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
    if (!res.ok) {
      toast.error("Failed to delete location");
      return;
    }
    toast.success(`Deleted '${location.name}' successfully`);
    const data = await res.json();
    setLocations((prev) => prev.filter((e) => e.id !== data.id));
  };

  const setDefaultLocation = async () => {
    const res = await client.api.location.default[":id"].$get({
      param: {
        id: location.id,
      },
    });
    if (!res.ok) {
      toast.error("Failed to set as default location");
      return;
    }
    const data = await res.json();
    setLocations((prev) =>
      prev.map((e) => ({
        ...e,
        isDefault: e.id === data.id,
      }))
    );
  };

  return (
    <>
      <ListMenuItem
        title={
          <>
            <div>{location.name}</div>
            {location.isDefault && <Badge>Default</Badge>}
          </>
        }
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
                {location.isDefault ? null : (
                  <DropdownMenuItem
                    iconName="CircleDashed"
                    onClick={() => setDefaultLocation()}
                  >
                    Set as default
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
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

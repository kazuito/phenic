"use client";

import { ListMenu, ListMenuGroup } from "@/components/myui/list-menu";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import client from "@/lib/hono";
import { InferResponseType } from "hono";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Location from "./Location";
import LocationForm from "./LocationForm";

const Page = () => {
  const [locations, setLocations] = useState<
    InferResponseType<typeof client.api.location.$get, 200>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLocations = async () => {
    const res = await client.api.location.$get();
    if (!res.ok) return;

    const data = await res.json();
    setLocations(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <div className="">
      <PageHeader heading="Locations" backHref="/contents" />
      <div className="px-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              <Plus className="mr-2" size={16} />
              New Location
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Location</DialogTitle>
            </DialogHeader>
            <LocationForm setLocations={setLocations} />
          </DialogContent>
        </Dialog>
        {isLoading ? (
          <Skeleton className="h-96 w-full mt-4 rounded-xl" />
        ) : (
          <ListMenu className="flex flex-col mt-4 gap-2">
            <ListMenuGroup>
              {locations.map((location, i) => {
                return (
                  <Location
                    setLocations={setLocations}
                    location={location}
                    key={i}
                  />
                );
              })}
            </ListMenuGroup>
          </ListMenu>
        )}
      </div>
    </div>
  );
};

export default Page;

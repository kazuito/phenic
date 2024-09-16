"use client";

import { useEffect, useState } from "react";
import client from "@/lib/hono";
import { InferResponseType } from "hono";
import PageHeader from "@/components/PageHeader";
import Location from "./Location";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Icon from "@/components/Icon";
import LocationForm from "./LocationForm";
import { ListMenu, ListMenuGroup } from "@/components/myui/list-menu";
import { Skeleton } from "@/components/ui/skeleton";

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
              <Icon name="Plus" className="mr-2" size={16} />
              New Location
            </Button>
          </DialogTrigger>
          <DialogContent>
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

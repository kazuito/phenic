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

const Page = () => {
  const [locations, setLocations] = useState<
    InferResponseType<typeof client.api.location.$get, 200>
  >([]);

  const fetchLocations = async () => {
    const res = await client.api.location.$get();
    if (!res.ok) return;

    const data = await res.json();
    setLocations(data);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <div className="">
      <PageHeader title="Locations" backHref="/contents" />
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
      </div>
    </div>
  );
};

export default Page;

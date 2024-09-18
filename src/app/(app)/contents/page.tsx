import { ListMenuGroup, ListMenuItem } from "@/components/myui/list-menu";
import PageHeader from "@/components/PageHeader";
import { DumbbellIcon, LandPlotIcon } from "lucide-react";

const Page = () => {
  return (
    <>
      <PageHeader heading="Contents" hideBack />
      <div className="px-4 pb-4">
        <ListMenuGroup>
          <ListMenuItem
            heading="Exercises"
            icon={<DumbbellIcon />}
            href="/contents/exercises"
          />
          <ListMenuItem
            heading="Locations"
            icon={<LandPlotIcon />}
            href="/contents/locations"
          />
        </ListMenuGroup>
      </div>
    </>
  );
};

export default Page;

import {
  ListMenu,
  ListMenuGroup,
  ListMenuItem,
} from "@/components/myui/list-menu";
import { DumbbellIcon, LandPlotIcon } from "lucide-react";

const Page = () => {
  return (
    <div className="p-4">
      <ListMenu>
        <ListMenuGroup title="Your contents">
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
      </ListMenu>
    </div>
  );
};

export default Page;

import {
  ListMenu,
  ListMenuGroup,
  ListMenuItem,
} from "@/components/myui/list-menu";

const Page = () => {
  return (
    <div className="p-4">
      <ListMenu>
        <ListMenuGroup title="Your contents">
          <ListMenuItem
            title="Exercises"
            iconName="Dumbbell"
            href="/contents/exercises"
          />
          <ListMenuItem
            title="Locations"
            iconName="LandPlot"
            href="/contents/locations"
          />
        </ListMenuGroup>
      </ListMenu>
    </div>
  );
};

export default Page;

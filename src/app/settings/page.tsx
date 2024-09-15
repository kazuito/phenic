import {
  ListMenu,
  ListMenuGroup,
  ListMenuItem,
} from "@/components/myui/list-menu";
import PageHeader from "@/components/PageHeader";

type Props = {};

const Page = ({}: Props) => {
  return (
    <div>
      <PageHeader title="Settings" hideBack />
      <ListMenu className="px-4">
        <ListMenuGroup>
          <ListMenuItem heading="Profile" iconName="User" href="/settings/profile" />
        </ListMenuGroup>
      </ListMenu>
    </div>
  );
};

export default Page;

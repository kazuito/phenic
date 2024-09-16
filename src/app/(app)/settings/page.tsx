import {
  ListMenu,
  ListMenuGroup,
  ListMenuItem,
} from "@/components/myui/list-menu";
import PageHeader from "@/components/PageHeader";
import { UserIcon } from "lucide-react";

type Props = {};

const Page = ({}: Props) => {
  return (
    <div>
      <PageHeader heading="Settings" hideBack />
      <ListMenu className="px-4">
        <ListMenuGroup>
          <ListMenuItem
            heading="Profile"
            icon={<UserIcon />}
            href="/settings/profile"
          />
        </ListMenuGroup>
      </ListMenu>
    </div>
  );
};

export default Page;

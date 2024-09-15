import Link from "next/link";
import Icon from "./Icon";

const NavBar = () => {
  return (
    <nav className="flex p-1 w-full bg-white gap-1 justify-around fixed bottom-0 border-t">
      <NavItem title="House" href="/contents" iconName="Dumbbell" />
      <NavItem title="House" href="/workouts" iconName="NotebookTabs" />
      <NavItem title="Account" href="/settings/account" iconName="Settings" />
    </nav>
  );
};

type NavItemProps = {
  title: string;
  href: string;
  iconName: string;
};

const NavItem = (props: NavItemProps) => {
  return (
    <Link
      href={props.href}
      className="rounded-full p-3 grow flex justify-center items-center"
    >
      <Icon size={24} name={props.iconName} />
    </Link>
  );
};

export default NavBar;

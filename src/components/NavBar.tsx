import { DumbbellIcon, NotebookTabsIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { cloneElement } from "react";

const NavBar = () => {
  return (
    <nav className="flex p-1 w-full bg-white gap-1 justify-around fixed bottom-0 border-t">
      <NavItem title="House" href="/contents" icon={<DumbbellIcon />} />
      <NavItem title="House" href="/workouts" icon={<NotebookTabsIcon />} />
      <NavItem title="Account" href="/settings" icon={<SettingsIcon />} />
    </nav>
  );
};

type NavItemProps = {
  title: string;
  href: string;
  icon: React.ReactElement;
};

const NavItem = ({ title, href, icon }: NavItemProps) => {
  return (
    <Link
      href={href}
      className="rounded-full p-3 grow flex justify-center items-center"
    >
      {cloneElement(icon, { size: 24 })}
    </Link>
  );
};

export default NavBar;

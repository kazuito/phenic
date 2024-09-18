"use client";

import { cn } from "@/lib/utils/utils";
import { DumbbellIcon, NotebookTabsIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cloneElement } from "react";

const NavBar = () => {
  return (
    <nav className="w-full mt-auto h-fit bg-white gap-1 justify-around sticky bottom-0 border-t md:border-none md:justify-start md:h-screen md:flex-col md:sticky md:top-0 md:items-start md:gap-0 md:p-4 md:col-start-1 md:row-start-1">
      <Link
        href="/workouts"
        className="font-black italic text-2xl px-4 py-2 hidden md:block"
      >
        Phenic
      </Link>
      <div className="p-1 flex w-full md:flex-col md:p-0 md:mt-2">
        <NavItem
          title="Workouts"
          href="/workouts"
          icon={<NotebookTabsIcon />}
        />
        <NavItem title="Contents" href="/contents" icon={<DumbbellIcon />} />
        <NavItem
          title="Settings"
          href="/settings"
          icon={<SettingsIcon />}
          className="mt-auto"
        />
      </div>
    </nav>
  );
};

type NavItemProps = {
  title: string;
  href: string;
  icon: React.ReactElement;
  className?: string;
};

const NavItem = ({ title, href, icon, className }: NavItemProps) => {
  const path = usePathname();

  return (
    <Link
      href={href}
      className={cn(
        "rounded-full gap-3 p-3 grow flex justify-center items-center md:px-5 md:hover:bg-neutral-100 md:w-full md:justify-start md:grow-0",
        path.startsWith(href) &&
          "bg-gradient-to-r from-blue-700 to-cyan-400 text-white",
        className
      )}
    >
      {cloneElement(icon, { className: "size-[24px] md:size-[20px]" })}
      <div className="font-semibold sr-only md:not-sr-only md:block">
        {title}
      </div>
    </Link>
  );
};

export default NavBar;

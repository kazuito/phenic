"use client";

import { cn } from "@/lib/utils/utils";
import { DumbbellIcon, NotebookTabsIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cloneElement } from "react";

const NavBar = () => {
  return (
    <nav className="sticky bottom-0 mt-auto h-fit w-full justify-around gap-1 border-t bg-white md:sticky md:top-0 md:col-start-1 md:row-start-1 md:h-screen md:flex-col md:items-start md:justify-start md:gap-0 md:border-none md:p-4">
      <Link
        href="/workouts"
        className="hidden px-4 py-2 text-2xl font-black italic md:block"
      >
        Phenic
      </Link>
      <div className="flex w-full p-1 md:mt-2 md:flex-col md:p-0">
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
        "flex grow items-center justify-center gap-3 rounded-full p-3 md:w-full md:grow-0 md:justify-start md:px-5 md:hover:bg-neutral-100",
        path.startsWith(href) &&
          "bg-gradient-to-r from-blue-700 to-cyan-400 text-white",
        className,
      )}
    >
      {cloneElement(icon, { className: "size-[24px] md:size-[20px]" })}
      <div className="sr-only font-semibold md:not-sr-only md:block">
        {title}
      </div>
    </Link>
  );
};

export default NavBar;

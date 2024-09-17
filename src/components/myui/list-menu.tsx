import Link from "next/link";
import { cn } from "@/lib/utils/utils";
import { ChevronRightIcon } from "lucide-react";
import { cloneElement } from "react";

type ListMenuProps = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export const ListMenu = ({ children, ...props }: ListMenuProps) => {
  return <div {...props}>{children}</div>;
};

type ListMenuGroupProps = {
  title?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export const ListMenuGroup = ({
  title,
  children,
  ...props
}: ListMenuGroupProps) => {
  return (
    <div {...props}>
      {title && <div className="p-2 font-semibold">{title}</div>}
      <div className="flex flex-col rounded-xl border empty:hidden">
        {children}
      </div>
    </div>
  );
};

type ListMenuItemProps = {
  heading: React.ReactNode;
  icon?: React.ReactElement;
  href?: string;
  endContent?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement | HTMLAnchorElement>;

export const ListMenuItem = ({
  heading,
  icon,
  href,
  endContent,
  className,
  ...props
}: ListMenuItemProps) => {
  const ItemContent = () => (
    <>
      {icon && cloneElement(icon, { size: 18, ...icon.props })}
      {heading}
      {endContent && <div className="ml-auto">{endContent}</div>}
    </>
  );

  const wrapperClassName = cn(
    "p-4 h-[57px] flex items-center gap-3 last:border-none last:h-[56px] border-b",
    className
  );

  if (!href) {
    return (
      <div className={wrapperClassName} {...props}>
        <ItemContent />
      </div>
    );
  }
  return (
    <Link href={href} className={wrapperClassName} {...props}>
      <ItemContent />
      <ChevronRightIcon className="ml-auto text-neutral-400" size={18} />
    </Link>
  );
};

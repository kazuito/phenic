import Link from "next/link";
import Icon from "../Icon";
import { cn } from "@/lib/utils";

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
  if (!children) return null;
  return (
    <div {...props}>
      {title && <div className="p-2 font-semibold">{title}</div>}
      <div className="flex flex-col rounded-xl border">{children}</div>
    </div>
  );
};

type ListMenuItemProps = {
  title: string;
  iconName?: string;
  href?: string;
  endContent?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement | HTMLAnchorElement>;

export const ListMenuItem = ({
  title,
  iconName,
  href,
  endContent,
  className,
  ...props
}: ListMenuItemProps) => {
  const ItemContent = () => (
    <>
      {iconName && <Icon name={iconName} size={18} />}
      {title}
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
      <Icon className="ml-auto text-neutral-400" name="ChevronRight" size={18} />
    </Link>
  );
};

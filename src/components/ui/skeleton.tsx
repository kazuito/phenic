import { cn } from "@/lib/utils/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-md bg-neutral-100 before:absolute before:h-full before:w-full before:animate-run-loop before:bg-gradient-to-r before:from-transparent before:via-neutral-300 before:to-transparent before:content-['']",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };

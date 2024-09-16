import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-md overflow-hidden shrink-0 bg-neutral-100 relative before:content-[''] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-neutral-300 before:to-transparent before:animate-run-loop before:absolute",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };

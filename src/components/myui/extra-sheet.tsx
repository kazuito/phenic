import { cn } from "@/lib/utils/utils";

type Props = React.HTMLAttributes<HTMLDivElement>;

const ExtraSheet = ({ className, children, ...props }: Props) => {
  return (
    <div
      className={cn(
        "flex flex-col space-y-2 rounded-b-lg border border-dashed bg-neutral-50 p-4 shadow-md",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default ExtraSheet;

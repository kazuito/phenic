import { cn } from "@/lib/utils/utils";

type Props = React.HTMLAttributes<HTMLDivElement>;

const ExtraSheet = ({ className, children, ...props }: Props) => {
  return (
    <div
      className={cn(
        "p-4 bg-neutral-50 rounded-b-lg flex space-y-2 flex-col shadow-md border border-dashed",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default ExtraSheet;

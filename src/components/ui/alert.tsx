import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/utils";
import {
  BanIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  TriangleAlertIcon,
} from "lucide-react";

const alertVariants = cva("flex", {
  variants: {
    type: {
      inline: "py-2 pl-2 pr-3 text-sm w-fit flex-row gap-1.5 rounded-full",
      default: "p-4 border w-full flex-col gap-2 rounded-lg",
    },
    color: {
      default: "bg-neutral-50 border-neutral-100 text-neutral-600",
      success: "bg-green-50 border-green-100 text-green-600",
      warning: "bg-yellow-50 border-yellow-100 text-yellow-600",
      info: "bg-blue-50 border-blue-100 text-blue-600",
      danger: "bg-red-50 border-red-100 text-red-600",
    },
    variant: {
      default: "border",
      outline: "bg-transparent border-2",
    },
  },
  defaultVariants: {
    variant: "default",
    color: "info",
    type: "default",
  },
});

const icons = {
  default: <CircleAlertIcon />,
  success: <CircleCheckIcon />,
  warning: <TriangleAlertIcon />,
  info: <CircleAlertIcon />,
  danger: <BanIcon />,
};

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof alertVariants> & {
      heading?: React.ReactNode;
      icon?: React.ReactElement;
      hideIcon?: boolean;
    }
>(
  (
    {
      className,
      variant,
      type,
      color,
      children,
      heading,
      icon,
      hideIcon,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ color, type, variant }), className)}
      {...props}
    >
      <div
        className={cn(
          "flex items-center",
          type === "inline" ? "gap-1.5" : "gap-2",
        )}
      >
        {!hideIcon &&
          React.cloneElement(icon ?? icons[color ?? "default"], {
            size: type === "inline" ? 14 : 16,
          })}
        <div className="font-semibold leading-none">{heading}</div>
      </div>
      {children && <div>{children}</div>}
    </div>
  ),
);
Alert.displayName = "Alert";

export { Alert };

import { cn } from "@/lib/utils/utils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const TempMessage = <T,>({
  trigger,
  setter,
  duration = 3000,
  children,
  className,
  ...props
}: {
  trigger: T | null;
  setter: Dispatch<SetStateAction<T | null>>;
  duration?: number;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!trigger) {
      return;
    }

    setShow(true);

    const timeoutReset = setTimeout(() => {
      setter(null);
    }, duration + 300);

    const timeoutShow = setTimeout(() => {
      setShow(false);
    }, duration);

    return () => {
      clearTimeout(timeoutReset);
      clearTimeout(timeoutShow);
    };
  }, [trigger]);

  return (
    <div
      className={cn(
        show ? "animate-fade-in-down" : "animate-fade-out-down",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default TempMessage;

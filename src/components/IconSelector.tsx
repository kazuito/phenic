import { exerciseIconNames, getExerciseIcon } from "@/lib/utils/getIcon";
import { cn } from "@/lib/utils/utils";
import { useEffect, useState } from "react";

type Props = {
  defaultValue: string;
  value: string;
  onSelected: (icon: string) => void;
};

const IconSelector = ({ defaultValue, value, onSelected }: Props) => {
  const [selectedIcon, setSelectedIcon] = useState(defaultValue);

  useEffect(() => {
    setSelectedIcon(value);
  }, [value]);

  useEffect(() => {
    onSelected(selectedIcon);
  }, [selectedIcon]);

  return (
    <div className="flex">
      {exerciseIconNames.map((iconName) => {
        return (
          <div
            tabIndex={0}
            className={cn(
              "cursor-pointer size-10 grid place-content-center rounded-sm hover:bg-neutral-100",
              iconName === selectedIcon ? "outline z-10" : ""
            )}
            onClick={() => {
              setSelectedIcon(iconName);
            }}
          >
            {getExerciseIcon(iconName)}
          </div>
        );
      })}
    </div>
  );
};

export default IconSelector;

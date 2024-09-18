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
  }, [selectedIcon, onSelected]);

  return (
    <div className="flex">
      {exerciseIconNames.map((iconName, i) => {
        return (
          <div
            key={i}
            tabIndex={0}
            className={cn(
              "grid size-10 cursor-pointer place-content-center rounded-sm hover:bg-neutral-100",
              iconName === selectedIcon ? "z-10 outline" : "",
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

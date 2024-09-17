import { IconBarbell, IconDumbbell, IconProps } from "@/components/Icon";

export const exerciseIconNames = ["dumbbell", "barbell"] as const;

export type ExerciseIconName = (typeof exerciseIconNames)[number];

export function getExerciseIcon(
  name: ExerciseIconName | string,
  props?: IconProps
) {
  switch (name) {
    case "dumbbell":
      return <IconDumbbell {...props} />;
    case "barbell":
      return <IconBarbell {...props} />;
    default:
      return <IconDumbbell {...props} />;
  }
}

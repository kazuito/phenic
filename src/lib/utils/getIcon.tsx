import {
  IconBarbell,
  IconDumbbell,
  IconProps,
  IconRun,
} from "../../components/Icon";

export const exerciseIconNames = ["dumbbell", "barbell", "run"] as const;

export type ExerciseIconName = (typeof exerciseIconNames)[number];

export function getExerciseIcon(
  name?: ExerciseIconName | string,
  props?: IconProps
) {
  switch (name) {
    case "dumbbell":
      return <IconDumbbell {...props} />;
    case "barbell":
      return <IconBarbell {...props} />;
    case "run":
      return <IconRun {...props} />;
    default:
      return <IconDumbbell {...props} />;
  }
}

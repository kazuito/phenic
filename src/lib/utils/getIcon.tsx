import {
  IconBarbell,
  IconDumbbell,
  IconMachinePlates,
  IconProps,
  IconRun,
} from "../../components/Icon";

export const exerciseIconNames = [
  "dumbbell",
  "barbell",
  "run",
  "machine-plates",
] as const;

export type ExerciseIconName = (typeof exerciseIconNames)[number];

export function getExerciseIcon(
  name?: ExerciseIconName | string,
  props?: IconProps,
) {
  switch (name as ExerciseIconName) {
    case "dumbbell":
      return <IconDumbbell {...props} />;
    case "barbell":
      return <IconBarbell {...props} />;
    case "run":
      return <IconRun {...props} />;
    case "machine-plates":
      return <IconMachinePlates {...props} />;
    default:
      return <IconDumbbell {...props} />;
  }
}

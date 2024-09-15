import { icons } from "lucide-react";

type Props = {
  name: string;
  color?: string;
  size?: number;
  className?: string;
};

const Icon = ({ name, ...props }: Props) => {
  const LucidIcon = icons[name as keyof typeof icons];

  if (!LucidIcon) {
    return null;
  }

  return <LucidIcon {...props} />;
};

export default Icon;

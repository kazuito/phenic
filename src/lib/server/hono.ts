import { getContext } from "hono/context-storage";

export type Env = {
  Variables: {
    userId: string;
  };
};

export const getUserId = () => {
  return getContext<Env>().var.userId;
};

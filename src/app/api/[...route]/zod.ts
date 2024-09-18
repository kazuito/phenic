import { Context, Env } from "hono";

export const zHandler = <
  T extends { success: boolean; error?: { issues?: { message: string }[] } }
>(
  result: T,
  c: Context<Env, string, {}>
) => {
  if (!result.success) {
    return c.json(
      {
        error: result?.error?.issues?.[0]?.message ?? "Something went wrong",
      },
      400
    );
  }
};

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth";
import { IconBrandGoogleFilled } from "@tabler/icons-react";

type Props = {};

const Page = ({}: Props) => {
  return (
    <div className="min-h-screen grid place-content-center">
      <form
        action={async () => {
          "use server";
          await signIn("google", {
            redirectTo: "/workouts",
          });
        }}
      >
        <Button type="submit">
          <IconBrandGoogleFilled size={16} className="mr-2" />
          Continue with Google
        </Button>
      </form>
    </div>
  );
};

export default Page;

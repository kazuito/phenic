import { Button } from "@/components/ui/button";
import { auth, signIn, signOut } from "@/lib/auth";

const Page = async () => {
  const session = await auth();

  if (!session || !session.user) {
    return signIn();
  }

  return (
    <main className="p-4">
      <div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <Button type="submit" variant="destructive">
            Sign out
          </Button>
        </form>
      </div>
    </main>
  );
};

export default Page;

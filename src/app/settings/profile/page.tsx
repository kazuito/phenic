"use server";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth, signIn, signOut } from "@/lib/auth";

const Page = async () => {
  const session = await auth();

  if (!session || !session.user) {
    return signIn();
  }

  return (
    <main className="">
      <PageHeader title="Profile" backHref="/settings" />
      <div className="p-4">
        <div className="flex flex-col items-center">
          <Avatar className="size-16">
            <AvatarImage src={session.user.image ?? ""} alt="" />
            <AvatarFallback>{session.user.name}</AvatarFallback>
          </Avatar>
          <div className="font-semibold mt-2">{session.user.name}</div>
          <div className="text-sm">{session.user.email}</div>
        </div>
        <form
          className="mt-4"
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/api/auth/signin" });
          }}
        >
          <Button type="submit" variant="outline" className="w-full">
            Sign out
          </Button>
        </form>
      </div>
    </main>
  );
};

export default Page;

import { Button } from "@/components/ui/button";
import { auth, signIn } from "@/lib/auth";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Page = async () => {
  const session = await auth();

  return (
    <div className="min-h-[100dvh] pt-64">
      <div className="mx-auto flex max-w-lg flex-col items-center">
        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-7xl font-black italic">Phenic</h1>
          <div className="leading-none text-zinc-400">
            Workout tracker for muscle training.
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center">
          {session?.user ? (
            <>
              <Link
                className="group flex w-fit items-center gap-3 rounded-full border py-1 pl-1 pr-4 text-sm font-semibold"
                href="/workouts"
              >
                <Image
                  src={session.user.image ?? ""}
                  width={32}
                  height={32}
                  className="rounded-full"
                  alt="Profile image"
                />
                <div className="flex items-center">
                  Workouts
                  <ArrowRightIcon
                    size={16}
                    className="ml-1 opacity-50 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </div>
              </Link>
              <div className="mt-1 flex items-center gap-1.5">
                <div className="size-2.5 rounded-full border-2 border-green-100 bg-green-400"></div>
                <div className="text-xs text-zinc-600">
                  Signed in as {session?.user?.name}
                </div>
              </div>
            </>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("google", {
                  redirectTo: "/workouts",
                });
              }}
            >
              <Button type="submit" className="rounded-full">
                <IconBrandGoogleFilled size={16} className="mr-2" />
                Sign in
              </Button>
            </form>
          )}
        </div>
      </div>
      <div className="fixed bottom-4 left-4 right-4">
        <div className="text-center text-sm text-zinc-400">
          Created by{" "}
          <Link
            className="transition-colors hover:text-zinc-600"
            href="https://kazumaito.com"
          >
            Kazuma Ito
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;

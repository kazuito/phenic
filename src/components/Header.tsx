import { auth, signIn } from "@/lib/auth";

const Header = async () => {
  const session = await auth();

  return (
    <div className="flex items-center p-4">
      <div>Phenic</div>
      <div className="ml-auto">
        {session ? (
          <div>{session?.user?.name}</div>
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <button type="submit">Sign in</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Header;

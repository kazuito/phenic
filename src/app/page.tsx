import Link from "next/link";

type Props = {};

const Page = ({}: Props) => {
  return (
    <div className="min-h-screen grid place-content-center">
      <Link href="/workouts">Phenic</Link>
    </div>
  );
};

export default Page;

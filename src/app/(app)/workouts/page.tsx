import { auth, signIn } from "@/lib/auth";
import Workouts from "./WorkoutList";

const Home = async () => {
  const session = await auth();

  if (!session || !session.user || !session.user.email) return signIn();

  return (
    <main>
      <Workouts />
    </main>
  );
};

export default Home;

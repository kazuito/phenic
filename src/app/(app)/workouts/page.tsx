"use client";

import PageHeader from "@/components/PageHeader";
import Workouts from "./WorkoutList";

const Home = () => {
  return (
    <>
      <PageHeader heading="Workouts" hideBack />
      <main className="pb-4">
        <Workouts />
      </main>
    </>
  );
};

export default Home;

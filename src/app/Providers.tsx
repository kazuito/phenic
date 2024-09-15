"use client";

import { Toaster } from "@/components/ui/sonner";

type Props = { children: React.ReactNode };

const Providers = ({ children }: Props) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
};

export default Providers;

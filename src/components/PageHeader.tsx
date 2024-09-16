"use client";

import Link from "next/link";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  heading: React.ReactNode;
  backText?: string;
  backHref?: string;
  hideBack?: boolean;
  content?: React.ReactNode;
  alwaysShowBorder?: boolean;
};

const PageHeader = ({
  heading,
  backText = "Back",
  backHref = "/",
  hideBack = false,
  content,
  alwaysShowBorder = false,
}: Props) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    setIsScrolled(value > 8);
  });

  return (
    <div
      className={cn(
        "sticky bg-white top-0 px-4 transition-all",
        (isScrolled || alwaysShowBorder) && "border-b"
      )}
    >
      <div className="flex h-14 items-center relative">
        {hideBack ? null : (
          <Link
            href={backHref}
            className="group flex items-center gap-1 absolute left-0 text-blue-500"
          >
            <div className="">←</div>
            <div>{backText}</div>
          </Link>
        )}
        <div className="mx-auto">{heading}</div>
        {content && <div className="absolute right-0">{content}</div>}
      </div>
    </div>
  );
};

export default PageHeader;

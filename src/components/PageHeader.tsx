"use client";

import { cn } from "@/lib/utils/utils";
import { useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

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
    setIsScrolled(value > 0);
  });

  return (
    <div
      className={cn(
        "sticky top-0 bg-white px-4 transition-all",
        (isScrolled || alwaysShowBorder) && "border-b",
      )}
    >
      <div className="relative flex h-14 items-center">
        {hideBack ? null : (
          <Link
            href={backHref}
            className="group absolute left-0 flex items-center gap-1 text-blue-500"
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

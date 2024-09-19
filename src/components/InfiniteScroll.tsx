"use client";

import { cn } from "@/lib/utils/utils";
import { useEffect, useState } from "react";

type Props = {
  onMore: () => Promise<void>;
  noMore?: boolean;
  children: React.ReactNode;
  threshold?: number;
  loadingContent?: React.ReactNode;
  debugLoadingContent?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const InfiniteScroll = ({
  onMore,
  noMore,
  threshold = 100,
  children,
  className,
  loadingContent,
  debugLoadingContent,
  ...props
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const more = async () => {
    if (isLoading) {
      return;
    }
    if (noMore) {
      return;
    }
    setIsLoading(true);
    if (debugLoadingContent) {
      return;
    }
    console.log("more");
    await onMore();
    setIsLoading(false);
  };

  const handleScroll = async () => {
    const { scrollHeight, scrollTop, clientHeight } =
      window.document.documentElement;

    const h = scrollHeight - (scrollTop + clientHeight);

    if (h < threshold) {
      await more();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [onMore, noMore, threshold, handleScroll]);

  return (
    <div className={cn("", className)} onScroll={handleScroll} {...props}>
      {children}
      {isLoading && loadingContent && loadingContent}
    </div>
  );
};

export default InfiniteScroll;

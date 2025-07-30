import clsx from "clsx";
import React from "react";
import Image from "next/image";

interface Props {
  className?: string;
  loading?: "lazy" | "eager";
  priority?: "auto" | "high" | "low";
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } =
    props;
  const loading = loadingFromProps || "lazy";
  const priority = priorityFromProps || "low";
  return (
    <Image
      alt="Logo"
      width={193}
      height={34}
      loading={loading}
      priority={priority === "high"}
      className={clsx("max-w-[2.5rem] w-full h-auto", className)}
      src="/icon-white.svg"
    />
  );
};

export const LogoCMS = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } =
    props;
  const loading = loadingFromProps || "lazy";
  const priority = priorityFromProps || "low";
  return (
    <Image
      alt="Logo"
      width={193}
      height={34}
      loading={loading}
      priority={priority === "high"}
      className={clsx("max-w-[2.5rem] w-full h-auto", className)}
      src="/favicon.svg"
    />
  );
};

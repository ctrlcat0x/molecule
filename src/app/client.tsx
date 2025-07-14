"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

const Client = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.create.queryOptions({ text: "hi" }));
  return <div className="">{JSON.stringify(data)}</div>;
};

export default Client;

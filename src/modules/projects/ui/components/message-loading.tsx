import Image from "next/image";
import { useState, useEffect } from "react";

const ShimmerMessages = () => {
  const messages = [
    "Thinking...",
    "Loading...",
    "Configuring your project...",
    "Generating code...",
    "Building your website...",
    "Generating code...",
    "Optimizing performance...",
    "Generating code...",
    "Reviewing everything...",
    "Building your website...",
    "Generating code...",
    "Optimizing performance...",
    "Generating code...",
    "Adding final touches...",
    "Deploying changes...",
    "Reviewing everything...",
    "Almost ready...",
    "Just a moment...",
    "Saving progress...",
    "Wrapping up...",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [messages.length]);
  return (
    <div className="flex items-center gap-2">
      <div className="text-base text-muted-foreground animate-pulse">
        {messages[currentMessageIndex]}
      </div>
    </div>
  );
};

export const MessageLoading = () => {
  return (
    <div className="flex flex-col group px-2 pb-4">
      <div className="flex items-center gap-2 pl-2 mb-2">
        <Image
          src="/logo.svg"
          alt="Molecule"
          width={18}
          height={18}
          className="shrink-0"
        />
        <span className="text-sm font-medium">Molecule</span>
      </div>
      <div className="pl-8.5 flerx flex-col gap-y-4">
        <ShimmerMessages />
      </div>
    </div>
  );
};

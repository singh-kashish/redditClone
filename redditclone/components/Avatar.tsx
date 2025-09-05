// components/Avatar.tsx
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

type Props = { seed?: string; large?: boolean };

export default function Avatar({ seed, large }: Props) {
  const { data: session } = useSession();
  const raw = seed ?? session?.user?.name ?? "placeholder";
  const clean = raw.toString().trim().replace(/^\/+/, "");
  const url = `https://api.dicebear.com/6.x/identicon/png?seed=${encodeURIComponent(clean)}&size=128`;

  return (
    <div className={`relative overflow-hidden rounded-full bg-white ${large ? "h-20 w-20" : "h-10 w-10"}`}>
      <Image alt="avatar" src={url} fill sizes={large ? "80px" : "40px"} unoptimized />
    </div>
  );
}

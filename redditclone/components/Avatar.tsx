import { useSession } from "next-auth/react";
import React from "react";
import Image from "next/image";

function Avatar() {
  const { data: session } = useSession();
  return (
    <div className="h-10 w-10 rounded-full border-gray-300 bg-white">
      <Image
        layout="fill"
        src={`https://avatars.dicebear.com/api/open-peeps/${
          session?.user?.name || "placeholder"
        }.svg`}
      />
    </div>
  );
}

export default Avatar;

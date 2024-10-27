"use client";
// functionality: only merchants could transfer amounts to others: same as users

import { useBalance } from "@repo/store/balance";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./lib/auth";

export default function () {
  const balance = useBalance();
  return (
    <div>
      Hi there Your Balance is: {balance}
      {/* again make fancy dashboard stuffs and db calls --production */}
      <button
        onClick={async () => {
          const session = await getServerSession(authOptions);
          if (session?.user) {
            redirect("/dashboard");
          } else {
            redirect("/api/auth/signin");
          }
        }}
      >
        Check Dashboard
      </button>
    </div>
  );
}

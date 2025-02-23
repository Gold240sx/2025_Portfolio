"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function SignInButton() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="text-white/60 transition-colors hover:text-white"
        >
          Dashboard
        </Link>
        <button
          onClick={() => void signOut()}
          className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-white hover:bg-white/20"
        >
          <span>Sign out</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => void signIn("discord")}
      className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-white hover:bg-white/20"
    >
      <span>Sign in</span>
    </button>
  );
}

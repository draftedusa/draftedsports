"use client";

import Link from "next/link";
import { useUser, SignInButton } from "@clerk/nextjs";

export default function FooterAccountLinks() {
  const { isSignedIn, user } = useUser();
  const username = (user?.publicMetadata as { username?: string } | undefined)?.username;

  if (!isSignedIn) {
    return (
      <ul className="space-y-1.5">
        <li>
          <SignInButton mode="modal">
            <button className="hover:text-brand transition-colors text-xs text-left">Sign In / Register</button>
          </SignInButton>
        </li>
        <li><Link href="/feed" className="hover:text-brand transition-colors text-xs">Fan Pulse Feed</Link></li>
      </ul>
    );
  }

  return (
    <ul className="space-y-1.5">
      {username && (
        <li><Link href={`/profile/${username}`} className="hover:text-brand transition-colors text-xs">My Profile</Link></li>
      )}
      {username && (
        <li><Link href={`/profile/${username}`} className="hover:text-brand transition-colors text-xs">Saved Articles</Link></li>
      )}
      <li><Link href="/profile/edit" className="hover:text-brand transition-colors text-xs">Notification Settings</Link></li>
      <li><Link href="/feed" className="hover:text-brand transition-colors text-xs">Fan Pulse Feed</Link></li>
    </ul>
  );
}

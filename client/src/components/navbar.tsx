"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { signOut, onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
    });
    return unsub;
  }, []);

  const isDashboard = pathname.startsWith("/dashboard");

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-md h-16 flex items-center justify-between px-6 md:px-12">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/brand/logo.png" alt="Tathya" width={28} height={28} className="rounded-md" />
          <span className="font-bold text-xl tracking-tight text-[#212121]">
            Tathya
          </span>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <Link
          href="/#features"
          className="text-sm font-medium text-zinc-600 hover:text-[#2f8d46] transition-colors"
        >
          Features
        </Link>
        <Link
          href="/#how-it-works"
          className="text-sm font-medium text-zinc-600 hover:text-[#2f8d46] transition-colors"
        >
          How it Works
        </Link>

        {ready && user && (
          <Button asChild className="bg-[#2f8d46] hover:bg-[#256d36]">
            <Link
              href="/dashboard"
              className="text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
          </Button>
        )}

        {ready && (
          <div className="flex items-center gap-3">
            {user ? (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-sm font-semibold border-zinc-200 text-zinc-700 hover:bg-zinc-50 h-9 px-5 rounded-md transition-colors"
              >
                Logout
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-sm font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-[#2f8d46] h-9 px-4 rounded-md"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="text-sm font-semibold bg-[#2f8d46] hover:bg-[#256d36] text-white h-9 px-5 rounded-md transition-colors shadow-sm">
                    Join Now
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

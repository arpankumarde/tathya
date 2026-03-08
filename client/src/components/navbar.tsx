"use client"

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { setCurrentUser } from "@/lib/auth-client";

export function Navbar() {
    const router = useRouter();
    const pathname = usePathname();

    // Define pages where we should NOT show standard auth buttons (Login/Join)
    const isDashboard = pathname.startsWith("/dashboard");

    const handleLogout = () => {
        setCurrentUser(null);
        router.push("/");
    };

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-md h-16 flex items-center justify-between px-6 md:px-12">
            <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2">
                    <div className="size-6 bg-[#2f8d46] rounded-md flex items-center justify-center">
                        <div className="size-2 bg-white rounded-full" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-[#212121]">Tathya</span>
                </Link>
            </div>
            <div className="hidden md:flex items-center gap-8">
                <Link href="/#features" className="text-sm font-medium text-zinc-600 hover:text-[#2f8d46] transition-colors">
                    Features
                </Link>
                <Link href="/#how-it-works" className="text-sm font-medium text-zinc-600 hover:text-[#2f8d46] transition-colors">
                    How it Works
                </Link>
                <Link href="/dashboard" className={`text-sm font-medium transition-colors ${isDashboard ? 'text-[#2f8d46]' : 'text-zinc-600 hover:text-[#2f8d46]'}`}>
                    Dashboard
                </Link>

                <div className="flex items-center gap-3">
                    {!isDashboard ? (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" className="text-sm font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-[#2f8d46] h-9 px-4 rounded-md">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button className="text-sm font-semibold bg-[#2f8d46] hover:bg-[#256d36] text-white h-9 px-5 rounded-md transition-colors shadow-sm">
                                    Join Now
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="text-sm font-semibold border-zinc-200 text-zinc-700 hover:bg-zinc-50 h-9 px-5 rounded-md transition-colors"
                        >
                            Logout
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
}

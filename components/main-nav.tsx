"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <span className="font-bold">DevShare</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/" ? "text-foreground" : "text-foreground/60",
          )}
        >
          Home
        </Link>
        <Link
          href="/explore"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/explore") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Explore
        </Link>
        <Link
          href="/messages"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/messages") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Messages
        </Link>
      </nav>
    </div>
  )
}


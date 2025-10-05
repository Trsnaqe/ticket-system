"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { PlusCircle, UserRound, ListChecks } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileBottomNav() {
	const pathname = usePathname()

	// Hide the bottom navigation on the login page
	if (pathname === "/login") {
		return null
	}

	const items = [
		{ href: "/requests", label: "Requests", icon: ListChecks },
		{ href: "/profile", label: "Profile", icon: UserRound },
	]

	return (
		<nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
			<ul className="grid grid-cols-2">
				{items.map(({ href, label, icon: Icon }) => {
					const active = pathname === href || pathname?.startsWith(href)
					return (
						<li key={href}>
							<Link
								href={href}
								className={cn(
									"flex h-14 flex-col items-center justify-center gap-1 text-xs",
									active ? "text-primary" : "text-muted-foreground hover:text-foreground",
								)}
								aria-label={label}
							>
								<Icon className={cn("h-5 w-5", active && "fill-primary/10")} />
								<span>{label}</span>
							</Link>
						</li>
					)
				})}
			</ul>

			{/* Center floating action button for New */}
			<Link
				href="/new-request"
				className={cn(
					"absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-16 rounded-full",
					"bg-primary text-primary-foreground shadow-lg border border-primary/20",
					"flex items-center justify-center",
				)}
				aria-label="New request"
			>
				<PlusCircle className="h-7 w-7" />
			</Link>
		</nav>
	)
}

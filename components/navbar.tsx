"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "@/components/language-selector"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { logout } from "@/lib/store/slices/auth-slice"
import { useTranslation } from "@/hooks/use-translation"
import { LogOut, Ticket } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const user = useAppSelector((state) => state.auth.user)

  const handleLogout = () => {
    dispatch(logout())
    router.push("/login")
  }

  const navItems = [
    { href: "/requests", label: t("requests") },
    { href: "/new-request", label: t("newRequest") },
    { href: "/profile", label: t("profile") },
  ]

  return (
    <nav className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/requests" className="flex items-center gap-2 font-semibold">
            <Ticket className="h-5 w-5" />
            <span>Ticket System</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant={pathname === item.href ? "secondary" : "ghost"} size="sm">
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs sm:text-sm text-muted-foreground truncate max-w-[40vw]">{user?.username}</span>
          <LanguageSelector />
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Menu, PenLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Home", icon: <BookOpen className="h-4 w-4 mr-2" /> },
  { href: "/blog", label: "Blog", icon: <BookOpen className="h-4 w-4 mr-2" /> },
  { href: "/blog/new", label: "Submit Article", icon: <PenLine className="h-4 w-4 mr-2" /> },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="font-bold text-xl flex items-center">
            <span className="bg-primary text-primary-foreground p-1 rounded mr-2 text-sm">E2</span>
            English 2 Blog
          </Link>
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary flex items-center",
                  pathname === item.href ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="font-bold text-xl flex items-center mb-8 mt-4">
                <span className="bg-primary text-primary-foreground p-1 rounded mr-2 text-sm">E2</span>
                English 2 Blog
              </div>
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary flex items-center p-2 rounded-md",
                      pathname === item.href ? "text-primary bg-primary/10" : "text-muted-foreground",
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

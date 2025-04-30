"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, Calendar, User, Settings, Menu, X, Leaf, Flower2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { PlantProvider } from "@/context/plant-context"
import { LeafIcon } from "@/components/leaf-icon"
import { Chatbot } from "@/components/chat-bot" // Import the Chatbot component

interface NavItemProps {
  href: string
  icon: React.ElementType
  label: string
  isActive: boolean
}

function NavItem({ href, icon: Icon, label, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-leaf-100 hover:text-leaf-800",
        isActive ? "bg-leaf-100 text-leaf-800 font-medium" : "text-muted-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Home" },
    { href: "/dashboard/guide", icon: BookOpen, label: "Guide" },
    { href: "/dashboard/schedule", icon: Calendar, label: "Schedule" },
    { href: "/dashboard/profile", icon: User, label: "Profile" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <PlantProvider>
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-leaf-50/50 to-white">
        {/* Top navigation for mobile */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 plant-header px-4 sm:px-6 md:hidden">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-leaf-800">
            <Leaf className="h-5 w-5 text-leaf-600" />
            <span>Botaniq</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto text-leaf-700 hover:text-leaf-900 hover:bg-leaf-100"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          >
            {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </header>

        <div className="flex flex-1">
          {/* Sidebar navigation for desktop */}
          <aside className="hidden border-r border-leaf-100 bg-white/80 backdrop-blur-sm md:block md:w-64 lg:w-72">
            <div className="sticky top-0 flex h-full flex-col gap-2">
              <div className="flex h-14 items-center plant-header px-4 lg:h-[60px] lg:px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-leaf-800">
                  <Leaf className="h-5 w-5 text-leaf-600" />
                  <span>Botaniq</span>
                </Link>
              </div>
              <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center lg:px-4">
                {navItems.map((item) => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    isActive={pathname === item.href}
                  />
                ))}
              </nav>

              {/* Decorative elements */}
              <div className="mt-auto p-4 text-center text-sm text-leaf-600 border-t border-leaf-100">
                <div className="flex justify-center mb-2">
                  <Flower2 className="h-5 w-5 text-leaf-400 animate-leaf-sway" />
                </div>
                <p>Growing green thumbs since 2023</p>
              </div>
            </div>
          </aside>

          {/* Mobile navigation overlay */}
          {isMobileNavOpen && (
            <div className="fixed inset-0 z-40 bg-leaf-900/20 backdrop-blur-sm md:hidden">
              <nav className="fixed left-0 top-16 z-40 w-3/4 h-[calc(100vh-4rem)] border-r border-leaf-100 bg-white p-6">
                <div className="grid gap-2">
                  {navItems.map((item) => (
                    <NavItem
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      label={item.label}
                      isActive={pathname === item.href}
                    />
                  ))}
                </div>

                {/* Decorative elements for mobile */}
                <div className="absolute bottom-6 left-0 right-0 text-center text-sm text-leaf-600">
                  <div className="flex justify-center mb-2">
                    <Flower2 className="h-5 w-5 text-leaf-400 animate-leaf-sway" />
                  </div>
                  <p>Growing green thumbs since 2023</p>
                </div>
              </nav>
              <div className="fixed inset-0 z-30" onClick={() => setIsMobileNavOpen(false)} aria-hidden="true" />
            </div>
          )}

          {/* Main content */}
          <main className="flex-1 relative overflow-hidden">
            {/* Decorative leaf elements */}
            <LeafIcon variant="large" position="top-right" className="fixed" />
            <LeafIcon variant="medium" position="bottom-left" className="fixed" />
            {children}
          </main>
        </div>

        {/* Add the Chatbot component */}
        <Chatbot />
      </div>
    </PlantProvider>
  )
}

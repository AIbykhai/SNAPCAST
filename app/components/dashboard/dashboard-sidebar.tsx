"use client"

import type React from "react"
import Link from "next/link"
import { BarChart, Calendar, LogOut, PenTool, Search } from "lucide-react"
import { logoutUser } from "@/lib/auth-utils"
import { useRouter } from "next/navigation"

export function DashboardSidebar() {
  const router = useRouter()

  const handleLogout = () => {
    logoutUser()
    router.push("/auth/login")
  }

  return (
    <div className="flex h-screen w-16 flex-col border-r bg-background md:w-64">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <span className="font-playfair text-xl font-bold md:inline-block">
            <span>AI</span> Social
          </span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        <NavItem href="/account-analyst" icon={<Search className="h-5 w-5" />} label="AI Account Analyst" />
        <NavItem href="/dashboard/creator" icon={<PenTool className="h-5 w-5" />} label="Creator" />
        <NavItem href="/dashboard/schedule" icon={<Calendar className="h-5 w-5" />} label="Schedule" />
        <NavItem href="/dashboard/analytics" icon={<BarChart className="h-5 w-5" />} label="Analytics" />
      </nav>
      <div className="border-t p-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary/10">
            <span className="flex h-full w-full items-center justify-center text-sm font-medium text-primary">A</span>
          </div>
          <Link href="/profile" className="ml-3 text-sm font-medium hover:underline">
            Alex Johnson
          </Link>
          <button
            onClick={handleLogout}
            className="ml-auto rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  active?: boolean
}

function NavItem({ href, icon, label, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center space-x-3 rounded-md px-3 py-2 ${
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      {icon}
      <span className="hidden md:inline-block">{label}</span>
    </Link>
  )
}

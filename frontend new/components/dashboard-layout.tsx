"use client"

import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen ml-64">
          <TopBar />
          <main className="flex-1 p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

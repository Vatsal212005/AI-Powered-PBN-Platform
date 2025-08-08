import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { PenTool, Edit3, Eye, Globe, Settings, User, LogOut, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const menuItems = [
  {
    title: "Generate Blogs",
    url: "/generate",
    icon: PenTool,
  },
  {
    title: "Edit Blogs",
    url: "/edit",
    icon: Edit3,
  },
  {
    title: "View Blogs",
    url: "/blogs",
    icon: Eye,
  },
  {
    title: "Create Domain",
    url: "/create-domain",
    icon: Globe,
  },
  {
    title: "View Domains",
    url: "/domains",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-sidebar-foreground">AI BlogGen</h2>
            <p className="text-sm text-sidebar-foreground/70">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <div className="mb-4">
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
            <PenTool className="mr-2 h-4 w-4" />
            New Blog Post
          </Button>
        </div>

        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild className="w-full justify-start">
                <Link href={item.url} className="flex items-center gap-3 px-3 py-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div className="flex items-center gap-3 px-3 py-2">
                <User className="h-4 w-4" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-sidebar-foreground/70">admin@bloggen.ai</p>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button className="flex w-full items-center gap-3 px-3 py-2 text-left">
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

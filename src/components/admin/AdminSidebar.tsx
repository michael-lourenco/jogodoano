"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Trophy, Gamepad2, ListTodo, Users, Settings, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export function AdminSidebar() {
  const pathname = usePathname()

  const menuItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: BarChart3,
    },
    {
      title: "Edições",
      href: "/admin/editions",
      icon: Trophy,
    },
    {
      title: "Jogos",
      href: "/admin/games",
      icon: Gamepad2,
    },
    {
      title: "Categorias",
      href: "/admin/categories",
      icon: ListTodo,
    },
    {
      title: "Usuários",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Configurações",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  return (
    <SidebarProvider className="min-w-[240px] max-w-[240px] border-r">
      <Sidebar className="min-w-[240px] max-w-[240px] border-r">
        <SidebarHeader className="border-b p-4">
          <Link href="/admin" className="flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            <span className="font-bold text-xl">Admin</span>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t p-4">
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => signOut()}>
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}

import {
  ArrowLeft,
  CalendarCheck,
  Library,
  MapIcon,
  Receipt,
  User,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import Link from "next/link";

const menuItems = [
  { href: "/admin", icon: <Library />, text: "Catalog" },
  { href: "/admin/categories", icon: <MapIcon />, text: "Categories" },
  { href: "/admin/activities", icon: <CalendarCheck />, text: "Activities" },
  { href: "/admin/users", icon: <User />, text: "Users" },
  { href: "/admin/fines", icon: <Receipt />, text: "Fines" },
  { href: "/", icon: <ArrowLeft />, text: "Home" },
];

function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-0 mb-4">
        <p className="text-lg font-medium p-4 border-b">Admin Dashboard</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.text} className="p-2">
              <SidebarMenuButton asChild>
                <Link href={item.href}>
                  {item.icon}
                  <span className="text-base">{item.text}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

export default AdminSidebar;

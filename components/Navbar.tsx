import Link from "next/link";
import {
  Library,
  Map,
  CalendarCheck,
  Computer,
  Lock,
  IdCard,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { addWeeks, format } from "date-fns";

function Navbar() {
  const from = format(new Date(), "yyyy-MM-dd");
  const to = format(addWeeks(new Date(), 2), "yyyy-MM-dd");

  const navItems = [
    { href: "/", icon: <Library size={20} />, text: "Cataloge" },
    { href: "/", icon: <Map size={20} />, text: "Locations" },
    {
      href: `/activities?from=${from}&to=${to}`,
      icon: <CalendarCheck size={20} />,
      text: "Activities",
    },
  ];

  const moreItems = [
    { href: "/", icon: <IdCard size={20} />, text: "Library Card" },
    { href: "/", icon: <Lock size={20} />, text: "Book Room" },
    { href: "/", icon: <Computer size={20} />, text: "Rent Equipment" },
  ];

  return (
    <nav className="container mx-auto flex justify-between items-center py-2">
      <div className="flex items-center space-x-6">
        {navItems.map((item) => (
          <Link
            key={item.text}
            href={item.href}
            className="text-sm flex items-center space-x-2 text-muted-foreground hover:text-primary hover:bg-card rounded-full py-2 px-4"
          >
            {item.icon}
            <span>{item.text}</span>
          </Link>
        ))}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-sm flex items-center space-x-2 text-muted-foreground hover:text-primary">
                More
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[180px]">
                  {moreItems.map((item) => (
                    <Link
                      key={item.text}
                      href={item.href}
                      className="text-sm flex items-center space-x-2 p-2 text-muted-foreground hover:text-primary"
                    >
                      {item.icon}
                      <span>{item.text}</span>
                    </Link>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}

export default Navbar;

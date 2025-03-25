import Link from "next/link";
import { Library, Map, CalendarCheck } from "lucide-react";
import { JSX } from "react";

interface NavItem {
  href: string;
  icon: JSX.Element;
  text: string;
}

function Navbar() {
  const navItems: NavItem[] = [
    { href: "/", icon: <Library size={20} />, text: "Cataloge" },
    { href: "/", icon: <Map size={20} />, text: "Locations" },
    { href: "/", icon: <CalendarCheck size={20} />, text: "Activities" },
  ];

  return (
    <nav className="container mx-auto flex justify-between items-center py-2">
      <div className="flex items-center space-x-10">
        {navItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="text-sm flex items-center space-x-2 text-muted-foreground hover:text-primary"
          >
            {item.icon}
            <span>{item.text}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;

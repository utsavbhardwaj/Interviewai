import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Mic className="text-primary text-2xl mr-2" />
              <span className="text-xl font-bold text-gray-900">AI Interview Master</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-8">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <a
                      className={`px-3 py-2 text-sm font-medium transition-colors ${
                        location === item.href
                          ? "text-gray-900"
                          : "text-gray-500 hover:text-primary"
                      }`}
                    >
                      {item.label}
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              Login
            </Button>
            <Button size="sm">
              Start Free Trial
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

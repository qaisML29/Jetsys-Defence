'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  PlusSquare,
  ListOrdered,
  FileText,
  BarChart2,
  Settings,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/add-stock', label: 'Add Stock', icon: PlusSquare },
  { href: '/manage-stock', label: 'Manage Stock', icon: ListOrdered },
  { href: '/usage', label: 'Usage Form', icon: FileText },
  { href: '/reports', label: 'Reports', icon: BarChart2 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <Shield className="w-8 h-8 text-sidebar-primary" data-ai-hint="military shield logo" />
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-sidebar-foreground font-headline">JETSYS™</h2>
            <p className="text-xs text-sidebar-foreground/80">DEFENCE</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Separator className="my-2 bg-sidebar-border" />
        <div className="text-xs text-center text-sidebar-foreground/60 p-4">
          © {new Date().getFullYear()} JETSYS™ Defence
        </div>
      </SidebarFooter>
    </>
  );
}

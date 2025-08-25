
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
  Shield,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { useAuth } from '@/context/auth-context';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/add-stock', label: 'Add Stock', icon: PlusSquare },
  { href: '/manage-stock', label: 'Manage Stock', icon: ListOrdered },
  { href: '/usage', label: 'Usage Form', icon: FileText },
  { href: '/reports', label: 'Reports', icon: BarChart2 },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

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
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Separator className="my-2 bg-sidebar-border" />
        <div className='p-2'>
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={logout}>
                <LogOut />
                <span>Logout</span>
            </Button>
        </div>
        <div className="text-xs text-center text-sidebar-foreground/60 p-4 pt-0">
          © {new Date().getFullYear()} JETSYS™ Defence
        </div>
      </SidebarFooter>
    </>
  );
}

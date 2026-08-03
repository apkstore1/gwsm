import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Building2,
  Globe,
  Users,
  CreditCard,
  Forward,
  Mail,
  ScrollText,
  Settings,
  Grid3x3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const groups = [
  {
    label: "Administration",
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard, color: "text-brand-blue" },
      { title: "Organizations", url: "/organizations", icon: Building2, color: "text-brand-green" },
      { title: "Domains", url: "/domains", icon: Globe, color: "text-brand-yellow" },
      { title: "Users", url: "/users", icon: Users, color: "text-brand-red" },
    ],
  },
  {
    label: "Mail operations",
    items: [
      { title: "Email Accounts", url: "/email-accounts", icon: Mail, color: "text-brand-blue" },
      { title: "Forwarder Provider", url: "/forwarders", icon: Forward, color: "text-brand-green" },
      { title: "Apps", url: "/apps", icon: Grid3x3, color: "text-brand-yellow" },
    ],
  },
  {
    label: "Governance",
    items: [
      { title: "Security", url: "/security", icon: ShieldCheck, color: "text-brand-red" },
      { title: "Audit Logs", url: "/audit-logs", icon: ScrollText, color: "text-brand-blue" },
      { title: "Billing", url: "/billing", icon: CreditCard, color: "text-brand-green" },
      { title: "AI Assistant", url: "/ai-assistant", icon: Sparkles, color: "text-brand-yellow" },
      { title: "Settings", url: "/settings", icon: Settings, color: "text-muted-foreground" },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="h-16 justify-center px-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md text-sm font-semibold text-white" style={{ backgroundColor: '#2f6de3' }}>
            W
          </div>
          {!collapsed && (
            <span className="truncate text-[15px] font-medium text-foreground">
              Workspace Manager
            </span>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            {!collapsed && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.title}
                      className="rounded-full data-[active=true]:bg-accent data-[active=true]:font-medium data-[active=true]:text-accent-foreground"
                    >
                      <Link to={item.url}>
                        <item.icon className={`size-4 ${item.color}`} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

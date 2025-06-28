import {
  LayoutDashboard,
  Logs,
  ChartLine,
  Forklift,
  Battery,
  ChartNoAxesColumn,
  ChevronRight,
} from "lucide-react";

import TelemetricsLogo from "../telemetrics-logo";

import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { NavUser } from "@/components/sidebar/nav-user";
import { title } from "process";

const data = {
  user: {
    name: "Arj Tabudlong",
    email: "arjgwapo@techadvise.ph",
    avatar: "/ID-portrait.jpeg",
  },
};

// Menu items.
const items = [
  {
    title: "Home",
    url: "/home",
    icon: LayoutDashboard,
  },
  {
    title: "List",
    icon: Logs,
    children: [
      {
        title: "Forklifts",
        url: "/forklifts",
        icon: Forklift,
      },
      {
        title: "Battery",
        url: "/battery",
        icon: Battery,
      },
    ],
  },
  {
    title: "Fault Analysis",
    url: "/fault-analysis",
    icon: ChartLine,
  },
  /* {
    title: "Sub-Accounts",
    url: "/sub-accounts",
    icon: Logs,
  }, */
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <TelemetricsLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                if (item.children) {
                  // Collapsible List (open by default, can be collapsed)
                  return (
                    <SidebarMenuItem key={item.title} className='rounded-md'>
                      <Collapsible defaultOpen>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className={`hover:bg-main-orange-accent hover:text-main-orange ${
                              item.children.some((sub) => pathname === sub.url)
                                ? "bg-main-orange-accent text-main-orange"
                                : ""
                            }`}
                            size='lg'
                          >
                            <span className='flex items-center gap-2 w-full justify-between'>
                              <span className='flex items-center gap-2'>
                                <item.icon className='w-4' />
                                <span className='text-sm md:text-base sm:text-sm'>
                                  {item.title}
                                </span>
                              </span>
                              {/* Responsive arrow icon rotates when open */}
                              <ChevronRight
                                className='chevron transition-transform duration-200 data-[state=open]:rotate-180'
                                // The parent CollapsibleTrigger will have data-state="open" when open
                              />
                            </span>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.children.map((sub) => (
                              <SidebarMenuSubItem key={sub.title}>
                                <a
                                  href={sub.url}
                                  className={`flex items-center px-4 py-2 rounded-md transition-colors duration-150
                                    hover:bg-main-orange-accent hover:text-main-orange
                                    ${pathname === sub.url ? "bg-main-orange-accent text-main-orange" : ""}
                                    w-full text-sm
                                  `}
                                >
                                  <span>{sub.title}</span>
                                </a>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    </SidebarMenuItem>
                  );
                }
                // Regular menu item
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem
                    key={item.title}
                    className={`rounded-md ${isActive ? "bg-main-orange-accent text-main-orange" : ""}`}
                  >
                    <SidebarMenuButton
                      asChild
                      className={`hover:bg-main-orange-accent hover:text-main-orange ${isActive ? "bg-main-orange-accent text-main-orange" : ""}`}
                      size='lg'
                    >
                      <a
                        href={item.url}
                        className='flex items-center gap-2 w-full text-base md:text-sm lg:text-base'
                      >
                        <item.icon />
                        <span>{item.title} </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}

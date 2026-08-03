import { Bell, Search, ChevronDown } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopBar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b bg-card px-3 sm:px-4">
      <SidebarTrigger className="text-muted-foreground" />
      <div className="relative hidden max-w-xl flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search organizations, domains, users"
          className="h-10 rounded-full border-transparent bg-muted pl-10 focus-visible:border-input focus-visible:bg-card"
        />
      </div>
      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon" className="relative rounded-full text-muted-foreground">
          <Bell className="size-5" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-muted">
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary text-xs text-primary-foreground">AR</AvatarFallback>
              </Avatar>
              <ChevronDown className="size-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="text-sm font-medium">Ana Reyes</div>
              <div className="text-xs font-normal text-muted-foreground">ana@resellerhq.com</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Account settings</DropdownMenuItem>
            <DropdownMenuItem>Reseller profile</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

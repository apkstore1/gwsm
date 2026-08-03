import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { ConfirmDelete } from "@/components/confirm-delete";
import { useStore } from "@/data/store";
import type { UserRow } from "@/data/mock";

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "Users — Workspace Manager" },
      { name: "description", content: "Directory of user accounts, licenses and storage usage." },
      { property: "og:title", content: "Users — Workspace Manager" },
      {
        property: "og:description",
        content: "Directory of user accounts, licenses and storage usage.",
      },
    ],
  }),
  component: UsersPage,
});

function UsersPage() {
  const { users, orgs, saveUser, removeUser, newId } = useStore();
  const [orgFilter, setOrgFilter] = useState("all");
  const [draft, setDraft] = useState<UserRow | null>(null);

  const filtered = users.filter((u) => orgFilter === "all" || u.org === orgFilter);

  const blank: UserRow = {
    id: newId(),
    name: "",
    email: "",
    org: orgs[0]?.name ?? "",
    license: "Starter",
    status: "Active",
    storage: "0 GB",
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Users"
        subtitle="Every mailbox owner across your client base."
        action={
          <Button className="rounded-full" onClick={() => setDraft(blank)}>
            <Plus className="size-4" /> Create user
          </Button>
        }
      />

      <Card className="shadow-sm">
        <CardHeader className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-base font-medium">Directory</CardTitle>
          <Select value={orgFilter} onValueChange={setOrgFilter}>
            <SelectTrigger className="w-56 rounded-full">
              <SelectValue placeholder="Filter by organization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All organizations</SelectItem>
              {orgs.map((o) => (
                <SelectItem key={o.id} value={o.name}>
                  {o.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>License</TableHead>
                <TableHead>Storage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-brand-blue/10 text-xs text-brand-blue">
                          {u.name
                            .split(" ")
                            .map((p) => p[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell className="text-muted-foreground">{u.org}</TableCell>
                  <TableCell>{u.license}</TableCell>
                  <TableCell>{u.storage}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`rounded-full font-normal ${
                        u.status === "Active"
                          ? "bg-brand-green/10 text-brand-green"
                          : "bg-brand-yellow/20 text-warning-foreground"
                      }`}
                    >
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${u.name}`}
                      className="size-8 rounded-full text-brand-blue hover:bg-brand-blue/10"
                      onClick={() => setDraft(u)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <ConfirmDelete label={u.email} onConfirm={() => removeUser(u.id)} />
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    No users for this organization yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!draft} onOpenChange={(open) => !open && setDraft(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {users.some((u) => u.id === draft?.id) ? "Edit profile" : "Create new user"}
            </DialogTitle>
          </DialogHeader>
          {draft && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="u-name">Full name</Label>
                <Input
                  id="u-name"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="u-email">Email address</Label>
                <Input
                  id="u-email"
                  value={draft.email}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Organization</Label>
                  <Select value={draft.org} onValueChange={(v) => setDraft({ ...draft, org: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {orgs.map((o) => (
                        <SelectItem key={o.id} value={o.name}>
                          {o.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>License</Label>
                  <Select
                    value={draft.license}
                    onValueChange={(v) => setDraft({ ...draft, license: v as UserRow["license"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Starter">Starter</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="text-sm font-medium text-foreground">Account active</div>
                  <p className="text-xs text-muted-foreground">Suspended users cannot sign in.</p>
                </div>
                <Switch
                  checked={draft.status === "Active"}
                  onCheckedChange={(c) =>
                    setDraft({ ...draft, status: c ? "Active" : "Suspended" })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button
              disabled={!draft?.name || !draft?.email}
              onClick={() => {
                if (draft) saveUser(draft);
                setDraft(null);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

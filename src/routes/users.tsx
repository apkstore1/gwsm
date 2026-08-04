import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useUsers } from "@/lib/hooks/useDatabase";
import { nanoid } from "nanoid";

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
  const { data: users, loading, create, update, remove } = useUsers();
  const [orgFilter, setOrgFilter] = useState("all");
  const [draft, setDraft] = useState<any | null>(null);

  const filtered = users; // No filtering by org since we're not tracking org in users table yet

  const blank = {
    id: nanoid(),
    name: "",
    email: "",
    status: "Active",
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
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Name</TableHead>
                <TableHead>Email</TableHead>
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
                          {(u.name || "U")
                            .split(" ")
                            .slice(0, 2)
                            .map((p: string) => p[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
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
                    <ConfirmDelete label={u.name} onConfirm={() => remove(u.id)} />
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                    {loading ? "Loading..." : "No users yet."}
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
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={draft.status}
                  onValueChange={(v) => setDraft({ ...draft, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button
              disabled={!draft?.name || !draft?.email}
              onClick={async () => {
                if (draft) {
                  if (users.some((u) => u.id === draft.id)) {
                    await update(draft.id, { name: draft.name, email: draft.email, status: draft.status });
                  } else {
                    await create({ name: draft.name, email: draft.email, status: draft.status });
                  }
                }
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

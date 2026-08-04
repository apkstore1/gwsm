import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useOrganizations } from "@/lib/hooks/useDatabase";
import { nanoid } from "nanoid";

export const Route = createFileRoute("/organizations")({
  head: () => ({
    meta: [
      { title: "Organizations — Workspace Manager" },
      { name: "description", content: "Manage client organizations, seats and assigned plans." },
      { property: "og:title", content: "Organizations — Workspace Manager" },
      {
        property: "og:description",
        content: "Manage client organizations, seats and assigned plans.",
      },
    ],
  }),
  component: Organizations,
});

function Organizations() {
  const { data: orgs, loading, create, update, remove } = useOrganizations();
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<any | null>(null);

  const filtered = orgs.filter((o) =>
    `${o.name} ${o.email}`.toLowerCase().includes(query.toLowerCase()),
  );

  const blank = { id: nanoid(), name: "", email: "", seats: 1 };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Organizations"
        subtitle="Client accounts under your reseller tenant."
        action={
          <Button className="rounded-full" onClick={() => setDraft(blank)}>
            <Plus className="size-4" /> Add organization
          </Button>
        }
      />

      <Card className="shadow-sm">
        <CardHeader className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-base font-medium">Client accounts</CardTitle>
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search organizations"
              className="h-9 rounded-full pl-9"
            />
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Organization</TableHead>
                <TableHead>Primary admin</TableHead>
                <TableHead>Domains</TableHead>
                <TableHead>Seats</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="pl-6 font-medium text-foreground">{o.name}</TableCell>
                  <TableCell className="text-muted-foreground">{o.email}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>{o.seats}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="rounded-full font-normal">
                      Custom
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${o.name}`}
                      className="size-8 rounded-full text-brand-blue hover:bg-brand-blue/10"
                      onClick={() => setDraft(o)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <ConfirmDelete label={o.name} onConfirm={() => remove(o.id)} />
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    {loading ? "Loading..." : "No organizations match your search."}
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
            <DialogTitle>{orgs.some((o) => o.id === draft?.id) ? "Edit" : "Add"} organization</DialogTitle>
          </DialogHeader>
          {draft && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="org-name">Company name</Label>
                <Input
                  id="org-name"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-email">Email</Label>
                <Input
                  id="org-email"
                  value={draft.email}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-seats">Seats</Label>
                <Input
                  id="org-seats"
                  type="number"
                  value={draft.seats}
                  onChange={(e) => setDraft({ ...draft, seats: Number(e.target.value) })}
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
              onClick={async () => {
                if (draft) {
                  if (orgs.some((o) => o.id === draft.id)) {
                    await update(draft.id, { name: draft.name, email: draft.email, seats: draft.seats });
                  } else {
                    await create({ name: draft.name, email: draft.email, seats: draft.seats });
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

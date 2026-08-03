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
import { useStore } from "@/data/store";
import type { Org } from "@/data/mock";

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

const planColor: Record<Org["plan"], string> = {
  Starter: "bg-brand-yellow/20 text-warning-foreground",
  Business: "bg-brand-blue/10 text-brand-blue",
  Enterprise: "bg-brand-green/10 text-brand-green",
};

function Organizations() {
  const { orgs, saveOrg, removeOrg, newId } = useStore();
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<Org | null>(null);

  const filtered = orgs.filter((o) =>
    `${o.name} ${o.admin}`.toLowerCase().includes(query.toLowerCase()),
  );

  const blank: Org = { id: newId(), name: "", admin: "", seats: 1, plan: "Starter", domains: 0 };

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
                  <TableCell className="text-muted-foreground">{o.admin}</TableCell>
                  <TableCell>{o.domains}</TableCell>
                  <TableCell>{o.seats}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`rounded-full font-normal ${planColor[o.plan]}`}
                    >
                      {o.plan}
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
                    <ConfirmDelete label={o.name} onConfirm={() => removeOrg(o.id)} />
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    No organizations match your search.
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
                <Label htmlFor="org-admin">Primary admin email</Label>
                <Input
                  id="org-admin"
                  value={draft.admin}
                  onChange={(e) => setDraft({ ...draft, admin: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="org-seats">Seats</Label>
                  <Input
                    id="org-seats"
                    type="number"
                    value={draft.seats}
                    onChange={(e) => setDraft({ ...draft, seats: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Billing tier</Label>
                  <Select
                    value={draft.plan}
                    onValueChange={(v) => setDraft({ ...draft, plan: v as Org["plan"] })}
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
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button
              disabled={!draft?.name || !draft?.admin}
              onClick={() => {
                if (draft) saveOrg(draft);
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

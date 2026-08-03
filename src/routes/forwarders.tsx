import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { ConfirmDelete } from "@/components/confirm-delete";
import { useStore } from "@/data/store";
import type { Forwarder } from "@/data/mock";

export const Route = createFileRoute("/forwarders")({
  head: () => ({
    meta: [
      { title: "Forwarder Provider — Workspace Manager" },
      { name: "description", content: "Create and manage email forwarding rules across client domains." },
      { property: "og:title", content: "Forwarder Provider — Workspace Manager" },
      { property: "og:description", content: "Create and manage email forwarding rules across client domains." },
    ],
  }),
  component: Forwarders,
});

function Forwarders() {
  const { forwarders, orgs, saveForwarder, removeForwarder, newId } = useStore();
  const [draft, setDraft] = useState<Forwarder | null>(null);

  const blank: Forwarder = {
    id: newId(),
    source: "",
    destination: "",
    org: orgs[0]?.name ?? "",
    keepCopy: true,
    active: true,
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Forwarder Provider"
        subtitle="Route incoming mail from aliases to real mailboxes."
        action={
          <Button className="rounded-full" onClick={() => setDraft(blank)}>
            <Plus className="size-4" /> New forwarder
          </Button>
        }
      />
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-medium">Forwarding rules</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Source</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Keep copy</TableHead>
                <TableHead>State</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forwarders.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="pl-6 font-medium text-foreground">{f.source}</TableCell>
                  <TableCell className="text-muted-foreground">{f.destination}</TableCell>
                  <TableCell className="text-muted-foreground">{f.org}</TableCell>
                  <TableCell>{f.keepCopy ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`rounded-full font-normal ${
                        f.active ? "bg-brand-green/10 text-brand-green" : "bg-brand-red/10 text-brand-red"
                      }`}
                    >
                      {f.active ? "Active" : "Paused"}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${f.source}`}
                      className="size-8 rounded-full text-brand-blue hover:bg-brand-blue/10"
                      onClick={() => setDraft(f)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <ConfirmDelete label={f.source} onConfirm={() => removeForwarder(f.id)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!draft} onOpenChange={(o) => !o && setDraft(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {forwarders.some((f) => f.id === draft?.id) ? "Edit forwarder" : "Create forwarder"}
            </DialogTitle>
          </DialogHeader>
          {draft && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="src">Source email</Label>
                <Input id="src" value={draft.source} onChange={(e) => setDraft({ ...draft, source: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dst">Destination email</Label>
                <Input id="dst" value={draft.destination} onChange={(e) => setDraft({ ...draft, destination: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Organization</Label>
                <Select value={draft.org} onValueChange={(v) => setDraft({ ...draft, org: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {orgs.map((o) => (
                      <SelectItem key={o.id} value={o.name}>{o.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm text-foreground">Keep a copy in source mailbox</span>
                <Switch checked={draft.keepCopy} onCheckedChange={(c) => setDraft({ ...draft, keepCopy: c })} />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm text-foreground">Rule active</span>
                <Switch checked={draft.active} onCheckedChange={(c) => setDraft({ ...draft, active: c })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDraft(null)}>Cancel</Button>
            <Button
              disabled={!draft?.source || !draft?.destination}
              onClick={() => {
                if (draft) saveForwarder(draft);
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

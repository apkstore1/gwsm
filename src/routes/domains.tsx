import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, AlertCircle, XCircle, Pencil, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useDomains, useOrganizations } from "@/lib/hooks/useDatabase";
import { nanoid } from "nanoid";

export const Route = createFileRoute("/domains")({
  head: () => ({
    meta: [
      { title: "Domains — Workspace Manager" },
      { name: "description", content: "Track custom domains and their DNS verification status." },
      { property: "og:title", content: "Domains — Workspace Manager" },
      {
        property: "og:description",
        content: "Track custom domains and their DNS verification status.",
      },
    ],
  }),
  component: Domains,
});

const statusStyles = {
  Verified: { icon: CheckCircle2, className: "text-brand-green" },
  "Pending MX": { icon: AlertCircle, className: "text-brand-yellow" },
  "Action needed": { icon: XCircle, className: "text-brand-red" },
} as const;

const mxRecords = [
  { host: "@", value: "mx1.mail-cluster.net", priority: 1 },
  { host: "@", value: "mx2.mail-cluster.net", priority: 5 },
  { host: "@", value: "mx3.mail-cluster.net", priority: 10 },
];

function Domains() {
  const { data: domains, loading, create, update, remove } = useDomains();
  const { data: orgs } = useOrganizations();
  const [draft, setDraft] = useState<any | null>(null);

  const blank = {
    id: nanoid(),
    name: "",
    org: orgs[0]?.name ?? "",
    status: "Pending MX",
    mailboxCount: 0,
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Domains"
        subtitle="DNS and MX health for every managed domain."
        action={
          <Button className="rounded-full" onClick={() => setDraft(blank)}>
            <Plus className="size-4" /> Add domain
          </Button>
        }
      />

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-medium">Managed domains</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Domain</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Mailboxes</TableHead>
                <TableHead>DNS status</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {domains.map((d) => {
                const s = statusStyles[d.status as keyof typeof statusStyles];
                return (
                  <TableRow key={d.id}>
                    <TableCell className="pl-6 font-medium text-foreground">{d.name}</TableCell>
                    <TableCell className="text-muted-foreground">-</TableCell>
                    <TableCell>{d.mailboxCount}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 text-sm ${s.className}`}>
                        <s.icon className="size-4" />
                        {d.status}
                      </span>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${d.name}`}
                        className="size-8 rounded-full text-brand-blue hover:bg-brand-blue/10"
                        onClick={() => setDraft(d)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <ConfirmDelete label={d.name} onConfirm={() => remove(d.id)} />
                    </TableCell>
                  </TableRow>
                );
              })}
              {domains.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    {loading ? "Loading..." : "No domains yet."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!draft} onOpenChange={(open) => !open && setDraft(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {domains.some((d) => d.id === draft?.id) ? "Edit DNS / MX settings" : "Add domain"}
            </DialogTitle>
            <DialogDescription>
              Point these MX records at your mail cluster to finish verification.
            </DialogDescription>
          </DialogHeader>
          {draft && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dom">Domain name</Label>
                <Input
                  id="dom"
                  placeholder="example.com"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>DNS status</Label>
                  <Select
                    value={draft.status}
                    onValueChange={(v) => setDraft({ ...draft, status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Verified">Verified</SelectItem>
                      <SelectItem value="Pending MX">Pending MX</SelectItem>
                      <SelectItem value="Action needed">Action needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mailbox">Mailbox Count</Label>
                  <Input
                    id="mailbox"
                    type="number"
                    placeholder="0"
                    value={draft.mailboxCount}
                    onChange={(e) => setDraft({ ...draft, mailboxCount: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="rounded-lg border bg-muted/40 p-3">
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Required MX records
                </div>
                <ol className="space-y-2 text-sm">
                  {mxRecords.map((r, i) => (
                    <li key={r.value} className="flex items-center gap-3">
                      <span className="flex size-5 items-center justify-center rounded-full bg-brand-blue/10 text-[11px] font-medium text-brand-blue">
                        {i + 1}
                      </span>
                      <span className="font-mono text-foreground">{r.value}</span>
                      <span className="ml-auto text-muted-foreground">priority {r.priority}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button
              disabled={!draft?.name}
              onClick={async () => {
                if (draft) {
                  if (domains.some((d) => d.id === draft.id)) {
                    await update(draft.id, { name: draft.name, status: draft.status, mailboxCount: draft.mailboxCount });
                  } else {
                    await create({ name: draft.name, status: draft.status, mailboxCount: draft.mailboxCount });
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

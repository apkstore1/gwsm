import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { ConfirmDelete } from "@/components/confirm-delete";
import { useEmailAccounts } from "@/lib/hooks/useDatabase";
import { nanoid } from "nanoid";

export const Route = createFileRoute("/email-accounts")({
  head: () => ({
    meta: [
      { title: "Email Accounts — Workspace Manager" },
      { name: "description", content: "Mailboxes, aliases and groups with quota usage per client." },
      { property: "og:title", content: "Email Accounts — Workspace Manager" },
      { property: "og:description", content: "Mailboxes, aliases and groups with quota usage per client." },
    ],
  }),
  component: EmailAccounts,
});

function EmailAccounts() {
  const { data: accounts, loading, create, update, remove } = useEmailAccounts();
  const [draft, setDraft] = useState<any | null>(null);

  const blank = {
    id: nanoid(),
    address: "",
    status: "Active",
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Email Accounts"
        subtitle="Mailboxes, aliases and groups across all domains."
        action={
          <Button className="rounded-full" onClick={() => setDraft(blank)}>
            <Plus className="size-4" /> New account
          </Button>
        }
      />
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-medium">All accounts</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Address</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Used / Quota</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="pl-6 font-medium text-foreground">{a.address}</TableCell>
                  <TableCell className="text-muted-foreground">-</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="rounded-full bg-brand-blue/10 font-normal text-brand-blue">
                      Mailbox
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">-</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`rounded-full font-normal ${
                        a.status === "Active" ? "bg-brand-green/10 text-brand-green" : "bg-brand-yellow/20 text-warning-foreground"
                      }`}
                    >
                      {a.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${a.address}`}
                      className="size-8 rounded-full text-brand-blue hover:bg-brand-blue/10"
                      onClick={() => setDraft(a)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <ConfirmDelete label={a.address} onConfirm={() => remove(a.id)} />
                  </TableCell>
                </TableRow>
              ))}
              {accounts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    {loading ? "Loading..." : "No accounts yet."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!draft} onOpenChange={(o) => !o && setDraft(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{accounts.some((a) => a.id === draft?.id) ? "Edit account" : "New email account"}</DialogTitle>
          </DialogHeader>
          {draft && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="addr">Email address</Label>
                <Input id="addr" value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={draft.status} onValueChange={(v) => setDraft({ ...draft, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDraft(null)}>Cancel</Button>
            <Button
              disabled={!draft?.address}
              onClick={async () => {
                if (draft) {
                  if (accounts.some((a) => a.id === draft.id)) {
                    await update(draft.id, { address: draft.address, status: draft.status });
                  } else {
                    await create({ address: draft.address, status: draft.status });
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

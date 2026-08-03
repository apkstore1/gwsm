import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { useStore } from "@/data/store";

export const Route = createFileRoute("/audit-logs")({
  head: () => ({
    meta: [
      { title: "Audit Logs — Workspace Manager" },
      { name: "description", content: "Chronological record of every admin action in the console." },
      { property: "og:title", content: "Audit Logs — Workspace Manager" },
      { property: "og:description", content: "Chronological record of every admin action in the console." },
    ],
  }),
  component: AuditLogs,
});

const tone = {
  Success: "bg-brand-green/10 text-brand-green",
  Warning: "bg-brand-yellow/20 text-warning-foreground",
  Failed: "bg-brand-red/10 text-brand-red",
} as const;

function AuditLogs() {
  const { logs } = useStore();
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader title="Audit Logs" subtitle="Every create, update and delete recorded live." />
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-medium">Activity stream</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="pl-6 font-medium text-foreground">{l.action}</TableCell>
                  <TableCell className="text-muted-foreground">{l.target}</TableCell>
                  <TableCell className="text-muted-foreground">{l.actor}</TableCell>
                  <TableCell className="text-muted-foreground">{l.time}</TableCell>
                  <TableCell className="pr-6">
                    <Badge variant="secondary" className={`rounded-full font-normal ${tone[l.status]}`}>
                      {l.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

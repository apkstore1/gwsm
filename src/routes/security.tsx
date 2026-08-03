import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { useStore } from "@/data/store";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Security — Workspace Manager" },
      { name: "description", content: "Review and resolve security alerts across client tenants." },
      { property: "og:title", content: "Security — Workspace Manager" },
      { property: "og:description", content: "Review and resolve security alerts across client tenants." },
    ],
  }),
  component: Security,
});

const sev = {
  Critical: "bg-brand-red/10 text-brand-red",
  Medium: "bg-brand-yellow/20 text-warning-foreground",
  Low: "bg-brand-blue/10 text-brand-blue",
} as const;

function Security() {
  const { alerts, resolveAlert } = useStore();
  const open = alerts.filter((a) => !a.resolved).length;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader title="Security" subtitle={`${open} open alerts need attention.`} />
      <div className="grid gap-4 md:grid-cols-2">
        {alerts.map((a) => (
          <Card key={a.id} className="shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                {a.resolved ? (
                  <ShieldCheck className="mt-0.5 size-5 text-brand-green" />
                ) : (
                  <ShieldAlert className="mt-0.5 size-5 text-brand-red" />
                )}
                <div>
                  <CardTitle className="text-base font-medium">{a.title}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">{a.detail}</p>
                </div>
              </div>
              <Badge variant="secondary" className={`rounded-full font-normal ${sev[a.severity]}`}>
                {a.severity}
              </Badge>
            </CardHeader>
            <CardContent>
              <Button
                variant={a.resolved ? "outline" : "default"}
                size="sm"
                className="rounded-full"
                disabled={a.resolved}
                onClick={() => resolveAlert(a.id)}
              >
                {a.resolved ? "Resolved" : "Mark as resolved"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

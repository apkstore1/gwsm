import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { useStore } from "@/data/store";

export const Route = createFileRoute("/apps")({
  head: () => ({
    meta: [
      { title: "Apps — Workspace Manager" },
      { name: "description", content: "Enable or disable workspace services for your client tenants." },
      { property: "og:title", content: "Apps — Workspace Manager" },
      { property: "og:description", content: "Enable or disable workspace services for your client tenants." },
    ],
  }),
  component: Apps,
});

const accents = ["bg-brand-blue", "bg-brand-red", "bg-brand-yellow", "bg-brand-green"];

function Apps() {
  const { apps, toggleApp } = useStore();
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader title="Apps" subtitle="Services provisioned across your reseller tenant." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {apps.map((a, i) => (
          <Card key={a.id} className="overflow-hidden shadow-sm">
            <div className={`h-1 ${accents[i % accents.length]}`} />
            <CardHeader className="flex flex-row items-start justify-between gap-2">
              <div>
                <CardTitle className="text-base font-medium">{a.name}</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">{a.category}</p>
              </div>
              <Switch checked={a.enabled} onCheckedChange={() => toggleApp(a.id)} />
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{a.seats} seats</span>
              <Badge
                variant="secondary"
                className={`rounded-full font-normal ${
                  a.enabled ? "bg-brand-green/10 text-brand-green" : "bg-muted text-muted-foreground"
                }`}
              >
                {a.enabled ? "Enabled" : "Disabled"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/page-header";
import { useStore } from "@/data/store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Workspace Manager" },
      { name: "description", content: "Reseller profile, billing currency and provisioning preferences." },
      { property: "og:title", content: "Settings — Workspace Manager" },
      { property: "og:description", content: "Reseller profile, billing currency and provisioning preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { settings, updateSettings } = useStore();
  const [form, setForm] = useState(settings);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader title="Settings" subtitle="Reseller profile and platform preferences." />
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-medium">Reseller profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cn">Company name</Label>
            <Input id="cn" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="se">Support email</Label>
            <Input id="se" value={form.supportEmail} onChange={(e) => setForm({ ...form, supportEmail: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cur">Billing currency</Label>
            <Input id="cur" value={form.billingCurrency} onChange={(e) => setForm({ ...form, billingCurrency: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-medium">Dashboard Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tc">Total clients</Label>
            <Input id="tc" type="number" value={form.totalClients} onChange={(e) => setForm({ ...form, totalClients: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ad">Active domains</Label>
            <Input id="ad" type="number" value={form.activeDomains} onChange={(e) => setForm({ ...form, activeDomains: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tu">Total users</Label>
            <Input id="tu" type="number" value={form.totalUsers} onChange={(e) => setForm({ ...form, totalUsers: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mr">Monthly revenue</Label>
            <Input id="mr" type="number" value={form.monthlyRevenue} onChange={(e) => setForm({ ...form, monthlyRevenue: parseInt(e.target.value) || 0 })} />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-medium">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { key: "autoProvision" as const, label: "Auto-provision licenses on user creation", color: "bg-brand-green" },
            { key: "twoFactor" as const, label: "Require 2-step verification for admins", color: "bg-brand-blue" },
            { key: "weeklyDigest" as const, label: "Send weekly usage digest", color: "bg-brand-yellow" },
          ].map((row) => (
            <div key={row.key} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <span className={`size-2 rounded-full ${row.color}`} />
                <span className="text-sm text-foreground">{row.label}</span>
              </div>
              <Switch checked={form[row.key]} onCheckedChange={(c) => setForm({ ...form, [row.key]: c })} />
            </div>
          ))}
          <div className="pt-2">
            <Button className="rounded-full" onClick={() => updateSettings(form)}>
              Save changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

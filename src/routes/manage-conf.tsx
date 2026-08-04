import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/data/store";

export const Route = createFileRoute("/manage-conf")({
  head: () => ({
    meta: [
      { title: "Manage Configuration — Workspace Manager" },
      { name: "description", content: "Configure dashboard metrics and billing settings." },
      { property: "og:title", content: "Manage Configuration — Workspace Manager" },
      { property: "og:description", content: "Configure dashboard metrics and billing settings." },
    ],
  }),
  component: ManageConf,
});

function ManageConf() {
  const { settings, updateSettings } = useStore();
  const [form, setForm] = useState(settings);

  const handleSave = () => {
    updateSettings(form);
  };

  const handleInputChange = (field: keyof typeof form, value: string | number) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <h1 className="text-2xl font-normal text-foreground">Manage Configuration</h1>

      {/* Dashboard Metrics Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-medium">Dashboard Metrics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="totalClients">Total Clients</Label>
            <Input
              id="totalClients"
              type="number"
              value={form.totalClients}
              onChange={(e) => handleInputChange("totalClients", parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="activeDomains">Active Domains</Label>
            <Input
              id="activeDomains"
              type="number"
              value={form.activeDomains}
              onChange={(e) => handleInputChange("activeDomains", parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalUsers">Total Users</Label>
            <Input
              id="totalUsers"
              type="number"
              value={form.totalUsers}
              onChange={(e) => handleInputChange("totalUsers", parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthlyRevenue">Monthly Revenue ($)</Label>
            <Input
              id="monthlyRevenue"
              type="number"
              value={form.monthlyRevenue}
              onChange={(e) => handleInputChange("monthlyRevenue", parseInt(e.target.value) || 0)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Billing Configuration Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-medium">Billing Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Account Balance */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="accountBalance">Account Balance ($)</Label>
              <Input
                id="accountBalance"
                type="number"
                value={form.accountBalance}
                onChange={(e) => handleInputChange("accountBalance", parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="autoRechargeAmount">Auto-Recharge Amount ($)</Label>
              <Input
                id="autoRechargeAmount"
                type="number"
                value={form.autoRechargeAmount}
                onChange={(e) => handleInputChange("autoRechargeAmount", parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Starter Plan */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-medium text-foreground">Starter Plan</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="starterSeatPrice">Price per Seat ($)</Label>
                <Input
                  id="starterSeatPrice"
                  type="number"
                  step="0.01"
                  value={form.starterSeatPrice}
                  onChange={(e) => handleInputChange("starterSeatPrice", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="starterStorage">Storage</Label>
                <Input
                  id="starterStorage"
                  type="text"
                  value={form.starterStorage}
                  onChange={(e) => handleInputChange("starterStorage", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="starterSupport">Support Level</Label>
                <Input
                  id="starterSupport"
                  type="text"
                  value={form.starterSupport}
                  onChange={(e) => handleInputChange("starterSupport", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Business Plan */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-medium text-foreground">Business Plan</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="businessSeatPrice">Price per Seat ($)</Label>
                <Input
                  id="businessSeatPrice"
                  type="number"
                  step="0.01"
                  value={form.businessSeatPrice}
                  onChange={(e) => handleInputChange("businessSeatPrice", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessStorage">Storage</Label>
                <Input
                  id="businessStorage"
                  type="text"
                  value={form.businessStorage}
                  onChange={(e) => handleInputChange("businessStorage", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessSupport">Support Level</Label>
                <Input
                  id="businessSupport"
                  type="text"
                  value={form.businessSupport}
                  onChange={(e) => handleInputChange("businessSupport", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-medium text-foreground">Enterprise Plan</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="enterpriseSeatPrice">Price per Seat ($)</Label>
                <Input
                  id="enterpriseSeatPrice"
                  type="number"
                  step="0.01"
                  value={form.enterpriseSeatPrice}
                  onChange={(e) => handleInputChange("enterpriseSeatPrice", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="enterpriseStorage">Storage</Label>
                <Input
                  id="enterpriseStorage"
                  type="text"
                  value={form.enterpriseStorage}
                  onChange={(e) => handleInputChange("enterpriseStorage", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="enterpriseSupport">Support Level</Label>
                <Input
                  id="enterpriseSupport"
                  type="text"
                  value={form.enterpriseSupport}
                  onChange={(e) => handleInputChange("enterpriseSupport", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="border-t pt-4">
            <Button className="rounded-full" onClick={handleSave}>
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

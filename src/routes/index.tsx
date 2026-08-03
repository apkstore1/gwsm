import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Building2, Globe, Users, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { organizations, users, domains, revenueData, activity } from "@/data/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Workspace Manager" },
      {
        name: "description",
        content: "Overview of clients, domains, users and monthly revenue across your workspace.",
      },
      { property: "og:title", content: "Dashboard — Workspace Manager" },
      {
        property: "og:description",
        content: "Overview of clients, domains, users and monthly revenue across your workspace.",
      },
    ],
  }),
  component: Dashboard,
});

const metrics = [
  { label: "Total clients", value: organizations.length.toString(), icon: Building2, delta: "+1 this month" },
  { label: "Active domains", value: domains.length.toString(), icon: Globe, delta: "3 verified" },
  {
    label: "Total users",
    value: organizations.reduce((n, o) => n + o.seats, 0).toString(),
    icon: Users,
    delta: "+14 seats",
  },
  { label: "Monthly revenue", value: "$18,630", icon: DollarSign, delta: "+8.1% MoM" },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-normal text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Account overview for Reseller HQ · updated a few seconds ago
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.label} className="shadow-sm">
            <CardContent className="flex items-start gap-4 p-5">
              <div className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <m.icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{m.label}</p>
                <p className="mt-1 text-2xl font-medium text-foreground">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.delta}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent className="h-72 pl-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ left: 8, right: 16, top: 8 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={56} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid var(--color-border)",
                    fontSize: 12,
                  }}
                  formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  fill="url(#rev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-medium">Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activity.map((a) => (
              <div key={a.text} className="flex gap-3">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                <div>
                  <p className="text-sm text-foreground">{a.text}</p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-medium">Active licenses per month</CardTitle>
        </CardHeader>
        <CardContent className="h-64 pl-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{ left: 8, right: 16, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} width={40} />
              <Tooltip
                cursor={{ fill: "var(--color-muted)" }}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid var(--color-border)",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="licenses" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} maxBarSize={44} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        {users.length} directory users shown in the Users section.
      </p>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { organizations } from "@/data/mock";
import { useStore } from "@/data/store";

export const Route = createFileRoute("/billing")({
  head: () => ({
    meta: [
      { title: "Billing — Workspace Manager" },
      { name: "description", content: "Plan rates, account balance and client invoices." },
      { property: "og:title", content: "Billing — Workspace Manager" },
      { property: "og:description", content: "Plan rates, account balance and client invoices." },
    ],
  }),
  component: Billing,
});

function Billing() {
  const { settings } = useStore();

  const plans = [
    { name: "Starter", seat: `$${settings.starterSeatPrice.toFixed(2)}`, storage: settings.starterStorage, support: settings.starterSupport },
    { name: "Business", seat: `$${settings.businessSeatPrice.toFixed(2)}`, storage: settings.businessStorage, support: settings.businessSupport },
    { name: "Enterprise", seat: `$${settings.enterpriseSeatPrice.toFixed(2)}`, storage: settings.enterpriseStorage, support: settings.enterpriseSupport },
  ];
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <h1 className="text-2xl font-normal text-foreground">Billing</h1>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-medium">Account balance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl font-medium text-foreground">${settings.accountBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-sm text-muted-foreground">Auto-recharge at ${settings.autoRechargeAmount.toLocaleString()}</p>
            <Button className="rounded-full">Add funds</Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-medium">Plan rates</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Plan</TableHead>
                  <TableHead>Per seat / month</TableHead>
                  <TableHead>Storage</TableHead>
                  <TableHead className="pr-6">Support</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((p) => (
                  <TableRow key={p.name}>
                    <TableCell className="pl-6 font-medium text-foreground">{p.name}</TableCell>
                    <TableCell>{p.seat}</TableCell>
                    <TableCell>{p.storage}</TableCell>
                    <TableCell className="pr-6 text-muted-foreground">{p.support}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-medium">Client invoices</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Organization</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Seats</TableHead>
                <TableHead className="pr-6">Monthly total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.map((o) => {
                const rate = plans.find((p) => p.name === o.plan)?.seat ?? "$0.00";
                const total = (Number(rate.replace("$", "")) * o.seats).toFixed(2);
                return (
                  <TableRow key={o.id}>
                    <TableCell className="pl-6 font-medium text-foreground">{o.name}</TableCell>
                    <TableCell>{o.plan}</TableCell>
                    <TableCell>{o.seats}</TableCell>
                    <TableCell className="pr-6">${total}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

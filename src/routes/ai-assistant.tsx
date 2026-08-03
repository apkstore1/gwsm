import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import { useStore } from "@/data/store";

export const Route = createFileRoute("/ai-assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant — Workspace Manager" },
      { name: "description", content: "Ask about tenant health, licenses and domain status in plain language." },
      { property: "og:title", content: "AI Assistant — Workspace Manager" },
      { property: "og:description", content: "Ask about tenant health, licenses and domain status in plain language." },
    ],
  }),
  component: Assistant,
});

type Msg = { role: "user" | "bot"; text: string };

function Assistant() {
  const { orgs, users, domains, alerts, accounts } = useStore();
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", text: "Hi Ana — ask me about clients, domains, mailboxes or open security alerts." },
  ]);

  const answer = (q: string) => {
    const t = q.toLowerCase();
    if (t.includes("domain"))
      return `You manage ${domains.length} domains; ${domains.filter((d) => d.status === "Verified").length} are fully verified.`;
    if (t.includes("user") || t.includes("seat"))
      return `There are ${users.length} users, ${users.filter((u) => u.status === "Active").length} active across ${orgs.length} organizations.`;
    if (t.includes("mailbox") || t.includes("account"))
      return `${accounts.length} email accounts exist, including ${accounts.filter((a) => a.type === "Alias").length} aliases.`;
    if (t.includes("security") || t.includes("alert"))
      return `${alerts.filter((a) => !a.resolved).length} security alerts are still open. The highest severity is ${alerts.find((a) => !a.resolved)?.severity ?? "none"}.`;
    if (t.includes("client") || t.includes("org"))
      return `Your top client by seats is ${[...orgs].sort((a, b) => b.seats - a.seats)[0]?.name ?? "n/a"}.`;
    return "I can summarize organizations, domains, users, mailboxes and security alerts. Try asking about one of those.";
  };

  const send = () => {
    const q = input.trim();
    if (!q) return;
    setMsgs((m) => [...m, { role: "user", text: q }, { role: "bot", text: answer(q) }]);
    setInput("");
  };

  const suggestions = ["How many domains are verified?", "Any open security alerts?", "Which client has most seats?"];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="AI Assistant" subtitle="Instant answers from your live console data." />
      <Card className="shadow-sm">
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-3">
            {msgs.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
                {m.role === "bot" && (
                  <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-blue/10">
                    <Sparkles className="size-4 text-brand-yellow" />
                  </span>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setInput(s)}
                className="rounded-full border border-brand-green/40 px-3 py-1 text-xs text-brand-green transition-colors hover:bg-brand-green/10"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={input}
              placeholder="Ask about your tenants…"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              className="rounded-full"
            />
            <Button className="rounded-full" onClick={send} aria-label="Send">
              <Send className="size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

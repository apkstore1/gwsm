import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  organizations as seedOrgs,
  users as seedUsers,
  domains as seedDomains,
  forwarders as seedForwarders,
  emailAccounts as seedAccounts,
  apps as seedApps,
  auditLogs as seedLogs,
  securityAlerts as seedAlerts,
  type Org,
  type UserRow,
  type DomainRow,
  type Forwarder,
  type EmailAccount,
  type AppRow,
  type AuditLog,
  type SecurityAlert,
} from "./mock";

const uid = () => Math.random().toString(36).slice(2, 10);

const now = () =>
  new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

type Settings = {
  companyName: string;
  supportEmail: string;
  billingCurrency: string;
  autoProvision: boolean;
  twoFactor: boolean;
  weeklyDigest: boolean;
};

type Ctx = {
  orgs: Org[];
  users: UserRow[];
  domains: DomainRow[];
  forwarders: Forwarder[];
  accounts: EmailAccount[];
  apps: AppRow[];
  logs: AuditLog[];
  alerts: SecurityAlert[];
  settings: Settings;
  saveOrg: (o: Org) => void;
  removeOrg: (id: string) => void;
  saveUser: (u: UserRow) => void;
  removeUser: (id: string) => void;
  saveDomain: (d: DomainRow) => void;
  removeDomain: (id: string) => void;
  saveForwarder: (f: Forwarder) => void;
  removeForwarder: (id: string) => void;
  saveAccount: (a: EmailAccount) => void;
  removeAccount: (id: string) => void;
  toggleApp: (id: string) => void;
  resolveAlert: (id: string) => void;
  updateSettings: (s: Partial<Settings>) => void;
  newId: () => string;
};

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [orgs, setOrgs] = useState<Org[]>(seedOrgs);
  const [users, setUsers] = useState<UserRow[]>(seedUsers);
  const [domains, setDomains] = useState<DomainRow[]>(seedDomains);
  const [forwarders, setForwarders] = useState<Forwarder[]>(seedForwarders);
  const [accounts, setAccounts] = useState<EmailAccount[]>(seedAccounts);
  const [apps, setApps] = useState<AppRow[]>(seedApps);
  const [logs, setLogs] = useState<AuditLog[]>(seedLogs);
  const [alerts, setAlerts] = useState<SecurityAlert[]>(seedAlerts);
  const [settings, setSettings] = useState<Settings>({
    companyName: "Workspace Manager",
    supportEmail: "support@resellerhq.com",
    billingCurrency: "USD",
    autoProvision: true,
    twoFactor: true,
    weeklyDigest: false,
  });

  const log = useCallback(
    (action: string, target: string, status: AuditLog["status"] = "Success") => {
      setLogs((prev) => [
        { id: uid(), action, target, actor: "Ana Reyes", time: now(), status },
        ...prev,
      ]);
    },
    [],
  );

  const value = useMemo<Ctx>(() => {
    const make =
      <T extends { id: string }>(
        setter: React.Dispatch<React.SetStateAction<T[]>>,
        label: string,
        nameOf: (t: T) => string,
      ) =>
      (item: T) => {
        let created = false;
        setter((prev) => {
          created = !prev.some((p) => p.id === item.id);
          return created ? [item, ...prev] : prev.map((p) => (p.id === item.id ? item : p));
        });
        setTimeout(() => {
          toast.success(created ? `${label} created` : `${label} updated`, {
            description: nameOf(item),
          });
          log(created ? `${label} created` : `${label} updated`, nameOf(item));
        }, 0);
      };

    const del =
      <T extends { id: string }>(
        setter: React.Dispatch<React.SetStateAction<T[]>>,
        label: string,
        nameOf: (t: T) => string,
      ) =>
      (id: string) => {
        let name = id;
        setter((prev) => {
          const found = prev.find((p) => p.id === id);
          if (found) name = nameOf(found);
          return prev.filter((p) => p.id !== id);
        });
        setTimeout(() => {
          toast.error(`${label} deleted`, { description: name });
          log(`${label} deleted`, name);
        }, 0);
      };

    return {
      orgs,
      users,
      domains,
      forwarders,
      accounts,
      apps,
      logs,
      alerts,
      settings,
      saveOrg: make(setOrgs, "Organization", (o) => o.name),
      removeOrg: del(setOrgs, "Organization", (o) => o.name),
      saveUser: make(setUsers, "User", (u) => u.email),
      removeUser: del(setUsers, "User", (u) => u.email),
      saveDomain: make(setDomains, "Domain", (d) => d.domain),
      removeDomain: del(setDomains, "Domain", (d) => d.domain),
      saveForwarder: make(setForwarders, "Forwarder", (f) => f.source),
      removeForwarder: del(setForwarders, "Forwarder", (f) => f.source),
      saveAccount: make(setAccounts, "Email account", (a) => a.address),
      removeAccount: del(setAccounts, "Email account", (a) => a.address),
      toggleApp: (id: string) => {
        setApps((prev) =>
          prev.map((a) => {
            if (a.id !== id) return a;
            const enabled = !a.enabled;
            setTimeout(() => {
              toast.success(`${a.name} ${enabled ? "enabled" : "disabled"}`);
              log(`App ${enabled ? "enabled" : "disabled"}`, a.name);
            }, 0);
            return { ...a, enabled };
          }),
        );
      },
      resolveAlert: (id: string) => {
        setAlerts((prev) =>
          prev.map((a) => {
            if (a.id !== id) return a;
            setTimeout(() => {
              toast.success("Alert resolved", { description: a.title });
              log("Security alert resolved", a.title);
            }, 0);
            return { ...a, resolved: true };
          }),
        );
      },
      updateSettings: (s: Partial<Settings>) => {
        setSettings((prev) => ({ ...prev, ...s }));
        setTimeout(() => {
          toast.success("Settings saved");
          log("Settings updated", Object.keys(s).join(", "));
        }, 0);
      },
      newId: uid,
    };
  }, [orgs, users, domains, forwarders, accounts, apps, logs, alerts, settings, log]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

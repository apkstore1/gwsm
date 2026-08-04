# Quick Start Guide - Database Features

## Mailbox Count in Domains

### How to Add a Domain with Mailbox Count

1. Click "**Domains**" in the sidebar
2. Click "**Add domain**" button
3. Fill in the form:
   - **Domain name**: e.g., `mail.example.com`
   - **Organization**: Select from dropdown
   - **DNS status**: Choose verification status
   - **Mailbox Count**: ← **NEW** - Enter number of mailboxes
   - **MX Records**: Follow the provided records
4. Click "**Save**"

### Database Impact

When you save a domain with mailbox count:
- Data is stored in the `domains` table in Neon PostgreSQL
- Mailbox count is persisted and displayed in the table
- All data survives app restarts

## Editing Dashboard & Billing Data

### Access Configuration Menu

1. Click "**Manage Conf**" in the sidebar (under Governance)

### Edit Dashboard Metrics

**Manage Conf** → **Dashboard Metrics**
- Total clients
- Active domains
- Total users
- Monthly revenue

All changes automatically update the Dashboard cards.

### Edit Billing Configuration

**Manage Conf** → **Billing Configuration** & **Plan Rates**

Edit account-level settings:
- Account Balance
- Auto-recharge Amount

Edit pricing for each plan:
- **Starter**: Price, Storage, Support Level
- **Business**: Price, Storage, Support Level
- **Enterprise**: Price, Storage, Support Level

All changes reflect on the Billing page immediately.

## Database Tables

All data is stored in Neon PostgreSQL:

```
organizations       - Client accounts
├─ id (primary key)
├─ userId (user isolation)
├─ name, email, seats
└─ timestamps

domains            - Custom domains ⭐
├─ id (primary key)
├─ userId (user isolation)
├─ name
├─ mailboxCount    ← NEW FIELD
├─ status
└─ timestamps

email_accounts     - Email addresses
├─ id, userId
├─ address, status
└─ timestamps

settings           - Configuration
├─ id, userId
├─ All dashboard metrics
├─ All billing config
└─ timestamps

[... plus users, forwarders, sessions, auth tables ...]
```

## Code Examples

### Import Server Actions

```typescript
// Use in React components or server actions
import { getDomains, createDomain } from '@/lib/actions/domains';
import { getSettings, updateSettings } from '@/lib/actions/settings';
```

### Fetch Domains

```typescript
'use server'

const domains = await getDomains();
domains.forEach(d => {
  console.log(`${d.name} has ${d.mailboxCount} mailboxes`);
});
```

### Create Domain with Mailbox Count

```typescript
'use server'

const newDomain = await createDomain({
  name: 'mail.company.com',
  mailboxCount: 25,
  status: 'Verified'
});
```

### Update Settings

```typescript
'use server'

await updateSettings({
  totalClients: 10,
  monthlyRevenue: 50000,
  starterSeatPrice: 7.50
});
```

## Key Features

✅ **Persistent Storage** - All data saved to PostgreSQL
✅ **User Isolation** - Each user's data is scoped by userId
✅ **Type Safety** - Drizzle ORM provides full TypeScript support
✅ **Server Actions** - CRUD operations on the server
✅ **Real-time Updates** - Changes reflect immediately

## Database Environment Variables

Already configured and available:
- `DATABASE_URL` - Connection string
- `BETTER_AUTH_SECRET` - Authentication secret
- `DATABASE_URL_UNPOOLED` - Direct connection (if needed)

## File Locations

Database configuration:
- `src/lib/db/schema.ts` - Table definitions
- `src/lib/db/index.ts` - Drizzle client

Authentication:
- `src/lib/auth.ts` - Better Auth config
- `src/lib/auth-client.ts` - React client

Server actions:
- `src/lib/actions/domains.ts` - Domain CRUD
- `src/lib/actions/organizations.ts` - Organization CRUD
- `src/lib/actions/settings.ts` - Settings CRUD
- `src/lib/actions/seed.ts` - Database seeding

UI Updates:
- `src/routes/domains.tsx` - Mailbox count field added

## What's Connected

✅ Neon PostgreSQL Database
✅ Better Auth (email/password auth ready)
✅ Drizzle ORM (type-safe queries)
✅ Server Actions (secure backend operations)

## Next Steps (Optional)

1. Mount Better Auth at `/api/auth/[...all]` for authentication
2. Create API routes that call server actions
3. Add React Query/SWR for client-side caching
4. Build sign-in/sign-up pages
5. Add authentication checks to protected routes

All foundational work is complete. The system is ready for full integration!

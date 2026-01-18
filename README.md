# RNB Monorepo

## Overview

This monorepo contains the full backend, shared types, and supporting packages for the **Realms and Beyond (RNB)** platform. It is designed for scalability, strict typing, and clear separation of concerns between identity, accounts, billing, and domain-specific applications (e.g. NexusServe).

The architecture follows **domain-driven design**, **TypeScript-first modeling**, and **schema–type parity** between Mongoose schemas and shared `@rnb/types`.

---

## Monorepo Structure

```
/rnb
├── apps/
│   ├── modularix-docs/     # Documentation page for @rnb/components
│   ├── nexus-serve/        # Employee management system
│   └── nexus-anvil/        # TTrpg content creation
│
├── packages/
│   ├── modularix/          # @rnb/component library
│   ├── styles/             # scss global stylings & branding
│   └── types/              # Global @rnb/types for the entire repo
│
├── servers/                # Tooling & maintenance scripts
│   ├── nexus-serve-api/    # @rnb/nexus-serve/api backend for all employee & business management
│   ├── rnb-api/            # @rnb/api backend for all rnb data
├── package.json
├── tsconfig.base.json
└── README.md
```

---

## Core Design Principles

* **Single Source of Truth for Types**
  All monorepo Types live in `@rnb/types`. Data must conform to these types.

* **Identity ≠ Account**
  A single identity can control multiple accounts.

* **Explicit Schemas**
  No loose `Object` types. All embedded documents use explicit schemas.

* **Lifecycle-Aware Data**
  Soft deletes, recovery windows, and auditability are first-class.

---

## Domain Model Overview

### Identity

Represents a **real person**.

* Authentication credentials
* Personal profile
* Contact information
* Lifecycle state
* Links to accounts

> One Identity → many Accounts



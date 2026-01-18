"use client";

import { useState } from "react";
import { NavBar } from "@rnb/modularix";
import type { I_NavBarItem, I_NavLink, I_BreadcrumbItem } from "@rnb/types";

const makeLink = (id: string, label: string, href: string): I_NavLink => ({
  id,
  label,
  href,
});

// ---------- Example 1: Basic navbar (links only) ----------

const basicNavItems: I_NavBarItem[] = [
  {
    id: "home",
    label: "Home",
    link: makeLink("home", "Home", "/"),
  },
  {
    id: "docs",
    label: "Docs",
    link: makeLink("docs", "Docs", "/docs"),
  },
  {
    id: "components",
    label: "Components",
    link: makeLink("components", "Components", "/components"),
  },
];

// ---------- Example 2: Navbar with dropdown items ----------

const dropdownNavItems: I_NavBarItem[] = [
  {
    id: "nav-home",
    label: "Home",
    link: makeLink("home", "Home", "/"),
  },
  {
    id: "nav-components",
    label: "Components",
    children: [
      makeLink("dropdown", "Dropdown", "/components/dropdown"),
      makeLink("sidebar", "Sidebar", "/components/sidebar"),
      makeLink("navbar", "NavBar", "/components/navbar"),
    ],
  },
  {
    id: "nav-guides",
    label: "Guides",
    children: [
      makeLink("getting-started", "Getting Started", "/guides/getting-started"),
      makeLink("advanced-usage", "Advanced Usage", "/guides/advanced"),
    ],
  },
];

// ---------- Example 3: Navbar with breadcrumbs ----------

const breadcrumbNavItems: I_NavBarItem[] = [
  {
    id: "nav-root",
    label: "Modularix",
    link: makeLink("root", "Modularix", "/"),
  },
  {
    id: "nav-components-breadcrumb",
    label: "Components",
    children: [
      makeLink("dropdown", "Dropdown", "/components/dropdown"),
      makeLink("sidebar", "Sidebar", "/components/sidebar"),
      makeLink("navbar", "NavBar", "/components/navbar"),
    ],
  },
];

const exampleBreadcrumbs: I_BreadcrumbItem[] = [
  { label: "Home", href: "/" },
  { label: "Components", href: "/components" },
  { label: "NavBar" },
];

// ---------- Example 4: Navbar with custom renderers ----------

const customNavItems: I_NavBarItem[] = [
  {
    id: "custom-home",
    label: "Home",
    link: makeLink("home", "Home", "/"),
  },
  {
    id: "custom-components",
    label: "Components",
    children: [
      makeLink("dropdown", "Dropdown", "/components/dropdown"),
      makeLink("sidebar", "Sidebar", "/components/sidebar"),
      makeLink("navbar", "NavBar", "/components/navbar"),
    ],
  },
  {
    id: "custom-disabled",
    label: "Disabled Item",
    disabled: true,
  },
];

export default function NavBarDocsPage() {
  const [lastAction, setLastAction] = useState<string>("None");

  return (
    <main>
      <h1>NavBar Component</h1>
      <p>
        This page demonstrates how to use the shared <code>NavBar</code>{" "}
        component from <code>@rnb/modularix</code> with the navigation types
        defined in <code>@rnb/types</code>.
      </p>

      {/* Example 1 */}
      <section>
        <h2>1. Basic Navigation Bar</h2>
        <p>
          A simple navigation bar that only contains top-level links. Use this
          when you don&apos;t need dropdowns or nested navigation.
        </p>

        <NavBar
          items={basicNavItems}
          onNavigate={(link) => {
            setLastAction(`Basic Nav: clicked link "${link.label}"`);
          }}
        />
      </section>

      {/* Example 2 */}
      <section>
        <h2>2. Navigation Bar with Dropdowns</h2>
        <p>
          Here the navigation bar uses <code>children</code> on{" "}
          <code>I_NavBarItem</code> to define dropdown menus. Clicking a parent
          item toggles visibility of its dropdown entries.
        </p>

        <NavBar
          items={dropdownNavItems}
          onNavigate={(link) => {
            setLastAction(
              `Dropdown Nav: clicked top-level link "${link.label}"`
            );
          }}
          onDropdownNavigate={(link) => {
            setLastAction(
              `Dropdown Nav: clicked dropdown item "${link.label}"`
            );
          }}
        />
      </section>

      {/* Example 3 */}
      <section>
        <h2>3. Navigation Bar with Breadcrumbs</h2>
        <p>
          The <code>NavBar</code> can optionally render a breadcrumb trail
          underneath the main navigation. This is useful to show the user where
          they are within the documentation hierarchy.
        </p>

        <NavBar
          items={breadcrumbNavItems}
          breadcrumbs={exampleBreadcrumbs}
          onNavigate={(link) => {
            setLastAction(`Breadcrumb Nav: clicked link "${link.label}"`);
          }}
          onDropdownNavigate={(link) => {
            setLastAction(
              `Breadcrumb Nav: clicked dropdown item "${link.label}"`
            );
          }}
        />
      </section>

      {/* Example 4 */}
      <section>
        <h2>4. Custom Rendering & Disabled Items</h2>
        <p>
          The <code>NavBar</code> accepts custom render functions for top-level
          items, dropdown items, and breadcrumbs. This allows you to inject
          icons, badges, active states, or any custom markup while keeping the
          underlying data shape consistent and typed.
        </p>

        <NavBar
          items={customNavItems}
          breadcrumbs={exampleBreadcrumbs}
          onNavigate={(link) => {
            setLastAction(`Custom Nav: clicked link "${link.label}"`);
          }}
          onDropdownNavigate={(link) => {
            setLastAction(`Custom Nav: clicked dropdown item "${link.label}"`);
          }}
          renderNavItem={(item, isOpen) => (
            <span>
              {item.label}
              {item.disabled ? " (disabled)" : ""}
              {isOpen ? " ▲" : hasChildren(item) ? " ▼" : ""}
            </span>
          )}
          renderDropdownItem={(link) => (
            <span>
              {link.label} [route: {link.href}]
            </span>
          )}
          renderBreadcrumb={(crumb) => (
            <span>{crumb.href ? `${crumb.label} / ` : crumb.label}</span>
          )}
        />
      </section>

      {/* Global last-action display */}
      <section>
        <h2>Last Action</h2>
        <p>{lastAction}</p>
      </section>
    </main>
  );
}

// Local helper to reuse in this file
function hasChildren(item: I_NavBarItem): boolean {
  return Array.isArray(item.children) && item.children.length > 0;
}

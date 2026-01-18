"use client";

import { useState } from "react";
import { Sidebar } from "@rnb/modularix";
import type { I_SidebarData, I_NavLink, I_DropdownOption } from "@rnb/types";

// ============================================================================
// Utilities
// ============================================================================

const makeNavLink = (id: string, label: string, href: string): I_NavLink => ({
  id,
  label,
  href,
});

// ============================================================================
// Example Data Definitions
// ============================================================================

// Example 1: Basic link-only sidebar
const basicSidebar: I_SidebarData = {
  header: {
    header: "Modularix Docs",
  },
  content: [
    {
      sectionName: "General",
      sectionContents: [
        {
          id: "home",
          kind: "link",
          link: makeNavLink("home", "Home", "/"),
        },
        {
          id: "getting-started",
          kind: "link",
          link: makeNavLink(
            "getting-started",
            "Getting Started",
            "/getting-started"
          ),
        },
      ],
    },
  ],
};

// Example 2: Sidebar with a simple dropdown
const componentsDropdown: I_DropdownOption = {
  id: "components-root",
  label: "Components",
  children: [
    {
      id: "comp-dropdown",
      label: "Dropdown",
      value: "dropdown",
    },
    {
      id: "comp-sidebar",
      label: "Sidebar",
      value: "sidebar",
    },
  ],
};

const sidebarWithDropdown: I_SidebarData = {
  header: {
    header: "Modularix Docs",
  },
  content: [
    {
      sectionName: "Navigation",
      sectionContents: [
        {
          id: "overview",
          kind: "link",
          link: makeNavLink("overview", "Overview", "/overview"),
        },
        {
          id: "components",
          kind: "dropdown",
          dropdown: componentsDropdown,
        },
      ],
    },
  ],
};

// Example 3: Sidebar with nested dropdown options
const nestedComponentsDropdown: I_DropdownOption = {
  id: "components-nested-root",
  label: "Components",
  children: [
    {
      id: "group-core",
      label: "Core",
      children: [
        {
          id: "core-button",
          label: "Button",
          value: "button",
        },
        {
          id: "core-input",
          label: "Input",
          value: "input",
        },
      ],
    },
    {
      id: "group-complex",
      label: "Complex",
      children: [
        {
          id: "complex-dropdown",
          label: "Dropdown",
          value: "dropdown",
        },
        {
          id: "complex-sidebar",
          label: "Sidebar",
          value: "sidebar",
        },
        {
          id: "complex-layouts",
          label: "Layouts",
          children: [
            {
              id: "layout-admin",
              label: "Admin Layout",
              value: "admin-layout",
            },
            {
              id: "layout-docs",
              label: "Docs Layout",
              value: "docs-layout",
            },
          ],
        },
      ],
    },
  ],
};

const nestedSidebar: I_SidebarData = {
  header: {
    header: "Modularix Docs",
  },
  content: [
    {
      sectionName: "Documentation",
      sectionContents: [
        {
          id: "docs-home",
          kind: "link",
          link: makeNavLink("docs-home", "Docs Home", "/docs"),
        },
        {
          id: "docs-components",
          kind: "dropdown",
          dropdown: nestedComponentsDropdown,
        },
      ],
    },
  ],
};

// Example 4: Sidebar with custom renderers
const customSidebarData: I_SidebarData = {
  header: {
    header: "Modularix Docs",
  },
  content: [
    {
      sectionName: "Examples",
      sectionContents: [
        {
          id: "example-link",
          kind: "link",
          link: makeNavLink("example-link", "Example Link", "/examples/link"),
        },
        {
          id: "example-dropdown",
          kind: "dropdown",
          dropdown: {
            id: "example-dropdown-root",
            label: "Example Dropdown",
            children: [
              {
                id: "example-item-1",
                label: "Item 1",
                value: "item-1",
              },
              {
                id: "example-item-2",
                label: "Item 2 (disabled)",
                value: "item-2",
                disabled: true,
              },
            ],
          },
        },
      ],
    },
  ],
};

// ============================================================================
// Example Components
// ============================================================================

interface ExampleSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const ExampleSection: React.FC<ExampleSectionProps> = ({
  title,
  description,
  children,
}) => (
  <section>
    <h2>{title}</h2>
    <p>{description}</p>
    {children}
  </section>
);

// ============================================================================
// Main Page Component
// ============================================================================

export default function SidebarDocsPage() {
  const [lastAction, setLastAction] = useState<string>("None");

  const handleLinkClick = (context: string) => (link: I_NavLink) => {
    setLastAction(`${context}: clicked link "${link.label}"`);
  };

  const handleDropdownOptionClick =
    (context: string) => (option: I_DropdownOption) => {
      setLastAction(`${context}: clicked dropdown option "${option.label}"`);
    };

  return (
    <main>
      <h1>Sidebar Component</h1>
      <p>
        This page demonstrates how to use the shared <code>Sidebar</code>{" "}
        component from <code>@rnb/modularix</code> with the sidebar types
        defined in <code>@rnb/types</code>.
      </p>

      <ExampleSection
        title="1. Basic Sidebar (Links Only)"
        description="A simple sidebar that only contains clickable links. This is useful for basic navigation structures where you don't need nested menus or dropdowns."
      >
        <Sidebar
          sidebarData={basicSidebar}
          isMobile={false}
          onLinkClick={handleLinkClick("Basic sidebar")}
        />
      </ExampleSection>

      <ExampleSection
        title="2. Sidebar with Components Dropdown"
        description='This example adds a single dropdown item under the "Navigation" section. Clicking the dropdown label toggles its open state, and selecting an option fires a dropdown click callback.'
      >
        <Sidebar
          sidebarData={sidebarWithDropdown}
          isMobile={false}
          onLinkClick={handleLinkClick("Dropdown sidebar")}
          onDropdownOptionClick={handleDropdownOptionClick("Dropdown sidebar")}
        />
      </ExampleSection>

      <ExampleSection
        title="3. Nested Dropdown Sidebar"
        description="Here the sidebar uses a deeply nested dropdown tree. You can use this pattern to group related pages or component categories into structured hierarchies."
      >
        <Sidebar
          sidebarData={nestedSidebar}
          isMobile={false}
          onLinkClick={handleLinkClick("Nested sidebar")}
          onDropdownOptionClick={handleDropdownOptionClick("Nested sidebar")}
        />
      </ExampleSection>

      <ExampleSection
        title="4. Custom Rendering & Handlers"
        description="The Sidebar component accepts custom render functions for link items and dropdown roots/options. This lets you inject icons, badges, or any other layout logic while keeping the data model typed and shared across the monorepo."
      >
        <Sidebar
          sidebarData={customSidebarData}
          isMobile={false}
          onLinkClick={handleLinkClick("Custom sidebar")}
          onDropdownOptionClick={handleDropdownOptionClick("Custom sidebar")}
          renderLink={(item) => (
            <span style={{ fontWeight: "bold" }}>[LINK] {item.link.label}</span>
          )}
          renderDropdownRoot={(item, isOpen) => (
            <span>
              {item.dropdown.label} {isOpen ? "▼" : "▶"}
            </span>
          )}
          renderDropdownOption={(option, depth) => (
            <span style={{ paddingLeft: `${depth * 12}px` }}>
              {option.label}
              {option.disabled && <em> (disabled)</em>}
            </span>
          )}
        />
      </ExampleSection>

      <ExampleSection title="Last Action" description="">
        <p>
          <strong>Action:</strong> {lastAction}
        </p>
      </ExampleSection>
    </main>
  );
}

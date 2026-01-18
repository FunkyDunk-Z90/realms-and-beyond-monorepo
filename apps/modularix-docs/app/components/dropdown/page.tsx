"use client";

import { useState } from "react";
import { Dropdown } from "@rnb/modularix";
import type { I_DropdownOption } from "@rnb/types";

const basicOptions: I_DropdownOption[] = [
  { id: "opt-1", label: "Option One", value: "one" },
  { id: "opt-2", label: "Option Two", value: "two" },
  { id: "opt-3", label: "Option Three", value: "three" },
];

const nestedOptions: I_DropdownOption[] = [
  {
    id: "root",
    label: "Root Menu",
    children: [
      {
        id: "sub-a",
        label: "Group A",
        children: [
          { id: "a-1", label: "Item A1", value: "a1" },
          { id: "a-2", label: "Item A2", value: "a2" },
        ],
      },
      {
        id: "sub-b",
        label: "Group B",
        children: [
          { id: "b-1", label: "Item B1", value: "b1" },
          { id: "b-2", label: "Item B2", value: "b2" },
        ],
      },
    ],
  },
];

const searchableOptions: I_DropdownOption[] = [
  { id: "s-1", label: "Apple", value: "apple" },
  { id: "s-2", label: "Banana", value: "banana" },
  { id: "s-3", label: "Cherry", value: "cherry" },
  { id: "s-4", label: "Dragonfruit", value: "dragonfruit" },
  { id: "s-5", label: "Grapes", value: "grapes" },
  { id: "s-6", label: "Mango", value: "mango" },
];

const hoverMenuOptions: I_DropdownOption[] = [
  {
    id: "menu-file",
    label: "File",
    children: [
      { id: "file-new", label: "New", value: "file-new" },
      { id: "file-open", label: "Open", value: "file-open" },
      { id: "file-save", label: "Save", value: "file-save" },
    ],
  },
  {
    id: "menu-edit",
    label: "Edit",
    children: [
      { id: "edit-undo", label: "Undo", value: "edit-undo" },
      { id: "edit-redo", label: "Redo", value: "edit-redo" },
    ],
  },
];

const customRenderOptions: I_DropdownOption[] = [
  {
    id: "env-dev",
    label: "Development",
    value: "dev",
    description: "Local / experimental",
  },
  {
    id: "env-staging",
    label: "Staging",
    value: "staging",
    description: "Pre-production testing",
  },
  {
    id: "env-prod",
    label: "Production",
    value: "prod",
    description: "Live environment",
  },
];

const disabledOptions: I_DropdownOption[] = [
  { id: "d-1", label: "Enabled Option", value: "enabled" },
  { id: "d-2", label: "Disabled Option", disabled: true, value: "disabled" },
  {
    id: "d-3",
    label: "Parent With Disabled Child",
    children: [
      { id: "d-3-1", label: "Child Enabled", value: "child-enabled" },
      {
        id: "d-3-2",
        label: "Child Disabled",
        value: "child-disabled",
        disabled: true,
      },
    ],
  },
];

export default function DropdownDocsPage() {
  const [selectedBasic, setSelectedBasic] = useState<string | undefined>();
  const [selectedNested, setSelectedNested] = useState<string | undefined>();
  const [selectedSearchable, setSelectedSearchable] = useState<
    string | undefined
  >();
  const [selectedHoverMenu, setSelectedHoverMenu] = useState<
    string | undefined
  >();
  const [selectedCustom, setSelectedCustom] = useState<string | undefined>();
  const [selectedDisabled, setSelectedDisabled] = useState<
    string | undefined
  >();

  return (
    <main>
      <h1>Dropdown Component</h1>
      <p>
        This page showcases different ways to use the shared{" "}
        <code>Dropdown</code> component provided by <code>@rnb/modularix</code>.
      </p>

      {/* Basic example */}
      <section>
        <h2>1. Basic Dropdown</h2>
        <p>
          A simple dropdown with a flat list of options. Use this when you just
          need a basic selection without nesting, searching, or custom
          rendering.
        </p>

        <Dropdown
          options={basicOptions}
          selectedValue={selectedBasic}
          onChange={(value) => setSelectedBasic(value)}
          placeholder="Select an option"
        />

        <p>Selected value: {selectedBasic ?? "none"}</p>
      </section>

      {/* Nested options */}
      <section>
        <h2>2. Nested Dropdown (Submenus)</h2>
        <p>
          The dropdown supports nested options via the <code>children</code>{" "}
          field on <code>I_DropdownOption</code>. This allows you to build
          multi-level menus for more complex navigation or grouping.
        </p>

        <Dropdown
          options={nestedOptions}
          selectedValue={selectedNested}
          onChange={(value) => setSelectedNested(value)}
          placeholder="Select nested item"
        />

        <p>Selected nested value: {selectedNested ?? "none"}</p>
      </section>

      {/* Searchable dropdown */}
      <section>
        <h2>3. Searchable Dropdown</h2>
        <p>
          Enable the <code>searchable</code> prop to add a search input that
          filters visible options by their label. Useful for long lists or
          anything with more than a handful of items.
        </p>

        <Dropdown
          options={searchableOptions}
          selectedValue={selectedSearchable}
          onChange={(value) => setSelectedSearchable(value)}
          placeholder="Search fruits"
          searchable
        />

        <p>Selected value: {selectedSearchable ?? "none"}</p>
      </section>

      {/* Open-on-hover menu */}
      <section>
        <h2>4. Open-on-Hover Menu</h2>
        <p>
          With <code>openOnHover</code>, nested dropdowns behave more like a
          traditional menu bar. Hovering over an item with children will open
          its submenu automatically.
        </p>

        <Dropdown
          options={hoverMenuOptions}
          selectedValue={selectedHoverMenu}
          onChange={(value) => setSelectedHoverMenu(value)}
          placeholder="Menu"
          openOnHover
        />

        <p>Selected menu action: {selectedHoverMenu ?? "none"}</p>
      </section>

      {/* Custom renderOption */}
      <section>
        <h2>5. Custom Option Rendering</h2>
        <p>
          Use <code>renderOption</code> to fully control how each option is
          rendered. This is ideal for displaying extra metadata, icons, badges,
          or status indicators alongside the main label.
        </p>

        <Dropdown
          options={customRenderOptions}
          selectedValue={selectedCustom}
          onChange={(value) => setSelectedCustom(value)}
          placeholder="Select environment"
          renderOption={(option, isSelected) => (
            <div>
              <div>
                {option.label} {isSelected ? "(selected)" : ""}
              </div>
              {option.description && <div>{option.description}</div>}
            </div>
          )}
        />

        <p>Selected environment: {selectedCustom ?? "none"}</p>
      </section>

      {/* Disabled options */}
      <section>
        <h2>6. Disabled Options</h2>
        <p>
          Any option can be disabled with the <code>disabled</code> flag. These
          options are rendered but cannot be selected. This works for both
          top-level and nested items.
        </p>

        <Dropdown
          options={disabledOptions}
          selectedValue={selectedDisabled}
          onChange={(value) => setSelectedDisabled(value)}
          placeholder="Select enabled option"
        />

        <p>Selected value: {selectedDisabled ?? "none"}</p>
      </section>
    </main>
  );
}

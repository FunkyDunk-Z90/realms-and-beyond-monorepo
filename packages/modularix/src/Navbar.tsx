"use client";

import React, { useState, useCallback } from "react";
import type { I_NavBarProps, I_NavBarItem } from "@rnb/types";
import type { I_NavLink, I_BreadcrumbItem } from "@rnb/types";

const hasChildren = (item: I_NavBarItem): boolean =>
  Array.isArray(item.children) && item.children.length > 0;

export const NavBar: React.FC<I_NavBarProps> = ({
  items,
  breadcrumbs,
  onNavigate,
  onDropdownNavigate,
  renderNavItem,
  renderDropdownItem,
  renderBreadcrumb,
}) => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const toggleDropdown = useCallback((id: string) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  }, []);

  const handleNavigate = (link: I_NavLink) => {
    onNavigate?.(link);
  };

  const handleDropdownNavigate = (link: I_NavLink) => {
    onDropdownNavigate?.(link);
  };

  const renderNavItemInternal = (item: I_NavBarItem): React.ReactNode => {
    const isOpen = openDropdownId === item.id;
    const hasKids = hasChildren(item);

    // Custom renderer for the *whole* nav item (button + any label or icon)
    if (renderNavItem) {
      return (
        <div>
          <button
            type="button"
            disabled={item.disabled}
            onClick={() => {
              if (item.link) {
                handleNavigate(item.link);
              }
              if (hasKids) {
                toggleDropdown(item.id);
              }
            }}
          >
            {renderNavItem(item, isOpen)}
          </button>

          {hasKids && isOpen && (
            <ul>
              {item.children!.map((child) => (
                <li key={child.id}>
                  <button
                    type="button"
                    onClick={() => handleDropdownNavigate(child)}
                  >
                    {renderDropdownItem
                      ? renderDropdownItem(child)
                      : child.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    // Default behavior: simple text label + optional dropdown
    return (
      <div>
        <button
          type="button"
          disabled={item.disabled}
          onClick={() => {
            if (item.link) {
              handleNavigate(item.link);
            }
            if (hasKids) {
              toggleDropdown(item.id);
            }
          }}
        >
          {item.label}
        </button>

        {hasKids && isOpen && (
          <ul>
            {item.children!.map((child) => (
              <li key={child.id}>
                <button
                  type="button"
                  onClick={() => handleDropdownNavigate(child)}
                >
                  {child.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const renderBreadcrumbs = (items: I_BreadcrumbItem[]): React.ReactNode => (
    <nav aria-label="breadcrumbs">
      <ul>
        {items.map((bc, index) => (
          <li key={index}>
            {renderBreadcrumb ? renderBreadcrumb(bc) : <span>{bc.label}</span>}
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <header>
      <nav aria-label="main-navigation">
        <ul>
          {items.map((item) => (
            <li key={item.id}>{renderNavItemInternal(item)}</li>
          ))}
        </ul>
      </nav>

      {breadcrumbs && breadcrumbs.length > 0 && (
        <div>{renderBreadcrumbs(breadcrumbs)}</div>
      )}
    </header>
  );
};

export interface I_NavLink {
  id: string;
  label: string;
  href: string;
  iconName?: string;
  external?: boolean;
}

export interface I_BreadcrumbItem {
  label: string;
  href?: string;
}

export type T_RouteParamsRaw = Record<string, string | string[]>;

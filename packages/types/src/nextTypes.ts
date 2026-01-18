import type { ReactNode } from "react";
import type { Metadata } from "next";
import type { StaticImageData } from "next/image";

export interface I_LayoutProps {
  children: ReactNode;
}

export interface I_PageProps<TParams = {}, TSearch = {}> {
  params: TParams;
  searchParams?: TSearch;
}

export interface I_PageMeta extends Metadata {
  title: string;
  description?: string;
}

export type T_ImageSource = string | StaticImageData;

export type T_ServerComponent<P = {}> = (
  props: P
) => React.ReactNode | Promise<React.ReactNode>;

export type T_ClientComponent<P = {}> = React.FC<P>;

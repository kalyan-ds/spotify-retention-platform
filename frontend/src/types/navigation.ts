import { ComponentType } from 'react';

export interface NavItem {
  id: string;
  title: string;
  path: string;
  icon: ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeVariant?: 'default' | 'danger' | 'warning' | 'success';
  tooltip?: string;
  roles?: string[];
  children?: NavItem[];
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  isCurrent?: boolean;
}

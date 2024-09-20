import { LucideIcon } from 'lucide-react';

export interface MenuItem {
  title: string;
  icon: LucideIcon;
  subItems: string[];
}

export interface Application {
  id: number;
  name: string;
  uri: string;
  lastUpdate: string;
  owner: string;
  creator: string;
  lastUpdater: string;
  lastCommitId: string;
  lastCommitLog: string;
  podCount: number;
  cpuCount: string;
  memoryAmount: string;
  secretCount: number;
}

export interface WorkflowTemplate {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

export interface ResourceQuota {
  cpu: string;
  memory: string;
  storage: string;
}

export interface Node {
  id: number;
  name: string;
  ip: string;
  status: 'Ready' | 'NotReady';
  cpu: string;
  memory: string;
}

export interface VirtualService {
  id: number;
  name: string;
  hosts: string[];
  gateways: string[];
  createdAt: string;
}

export interface ArgoResourceProps {
  activeSubMenu: string;
}

export interface ResourcePoolProps {
  activeSubMenu: string;
}

export interface NetworkProps {
  activeSubMenu: string;
}

export interface SidebarProps {
  activeMenu: string;
  activeSubMenu: string;
  setActiveMenu: (menu: string) => void;
  setActiveSubMenu: (subMenu: string) => void;
}

export interface Workflow {
  id: number;
  name: string;
  status: string;
  startedAt: string | null;
  finishedAt: string | null;
  duration: string;
  progress: string;
  message: string;
}

export interface Secret {
  id: number;
  name: string;
  type: string;
  createdAt: string;
  lastUpdated: string;
}
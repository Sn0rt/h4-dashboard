import { ArgoResource } from './ArgoResource';

export function Argo({ activeSubMenu }: { activeSubMenu: string }) {
  return <ArgoResource activeSubMenu={activeSubMenu} />;
}
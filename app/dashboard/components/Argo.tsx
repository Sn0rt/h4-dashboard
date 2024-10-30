import { ArgoResource } from './ArgoResource';
import { KustomizationResource } from './KustomizationResource';

export function Argo({ activeSubMenu }: { activeSubMenu: string }) {
  switch (activeSubMenu) {
    case 'ArgoApplication':
      return <ArgoResource activeSubMenu={activeSubMenu} />;
    case 'Kustomization':
      return <KustomizationResource />;
    default:
      return null;
  }
}
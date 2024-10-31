import { ArgoResource } from './ArgoResource';
import { KustomizationResource } from './KustomizationResource';

interface ArgoProps {
  activeSubMenu: string;
  onSelectApp: (appName: string) => void;
}

export function Argo({ activeSubMenu, onSelectApp }: ArgoProps) {
  switch (activeSubMenu) {
    case 'ArgoApplication':
      return <ArgoResource activeSubMenu={activeSubMenu} onSelectApp={onSelectApp} />;
    case 'Kustomization':
      return <KustomizationResource />;
    default:
      return null;
  }
}
export interface Kustomization {
  id: number;
  name: string;
  path: string;
  validated: boolean;
  owner: string;
  environments: string[];
  lastApplied: string;
  source: {
    type: 'git' | 'helm';
    url: string;
    branch?: string;
    tag?: string;
  };
  resources: {
    deployments: number;
    services: number;
    configmaps: number;
    secrets: number;
  };
  events: {
    time: string;
    type: 'Normal' | 'Warning';
    reason: string;
    message: string;
  }[];
}

export const kustomizations: Kustomization[] = [
  {
    id: 1,
    name: 'argocd',
    path: './overlays/production',
    validated: true,
    owner: 'DevOps Team',
    environments: ['SIT', 'UAT', 'PRD'],
    lastApplied: '2024-03-15T10:30:00Z',
    source: {
      type: 'git',
      url: 'https://github.com/org/argocd',
      branch: 'main'
    },
    resources: {
      deployments: 3,
      services: 2,
      configmaps: 4,
      secrets: 2
    },
    events: [
      {
        time: '2024-03-15T10:30:00Z',
        type: 'Normal',
        reason: 'Applied',
        message: 'Successfully updated argocd configuration'
      }
    ]
  },
  {
    id: 2,
    name: 'argo-workflows',
    path: './overlays/staging',
    validated: true,
    owner: 'Platform Team',
    environments: ['SIT', 'UAT'],
    lastApplied: '2024-03-15T09:45:00Z',
    source: {
      type: 'git',
      url: 'https://github.com/org/argo-workflows',
      branch: 'develop'
    },
    resources: {
      deployments: 2,
      services: 1,
      configmaps: 3,
      secrets: 1
    },
    events: [
      {
        time: '2024-03-15T09:45:00Z',
        type: 'Normal',
        reason: 'Validation',
        message: 'Added workflow overlay successfully'
      }
    ]
  },
  {
    id: 3,
    name: 'fluent-operator',
    path: './base',
    validated: true,
    owner: 'Logging Team',
    environments: ['SIT1', 'UAT'],
    lastApplied: '2024-03-15T08:15:00Z',
    source: {
      type: 'git',
      url: 'https://github.com/org/fluent-operator',
      branch: 'main'
    },
    resources: {
      deployments: 1,
      services: 1,
      configmaps: 2,
      secrets: 1
    },
    events: [
      {
        time: '2024-03-15T08:15:00Z',
        type: 'Normal',
        reason: 'Updated',
        message: 'Updated output configuration'
      }
    ]
  },
  {
    id: 4,
    name: 'vault',
    path: './overlays/vault',
    validated: true,
    owner: 'Security Team',
    environments: ['SIT', 'SIT1', 'UAT', 'PRD'],
    lastApplied: '2024-03-15T07:30:00Z',
    source: {
      type: 'git',
      url: 'https://github.com/org/vault-config',
      branch: 'main'
    },
    resources: {
      deployments: 3,
      services: 2,
      configmaps: 5,
      secrets: 4
    },
    events: [
      {
        time: '2024-03-15T07:30:00Z',
        type: 'Normal',
        reason: 'Validation',
        message: 'Security configuration validated'
      }
    ]
  },
  {
    id: 5,
    name: 'loki',
    path: './overlays/monitoring',
    validated: true,
    owner: 'Monitoring Team',
    environments: ['SIT', 'UAT', 'PRD'],
    lastApplied: '2024-03-14T15:30:00Z',
    source: {
      type: 'git',
      url: 'https://github.com/org/loki-config',
      branch: 'main'
    },
    resources: {
      deployments: 2,
      services: 2,
      configmaps: 3,
      secrets: 1
    },
    events: [
      {
        time: '2024-03-14T15:30:00Z',
        type: 'Normal',
        reason: 'Added',
        message: 'Added Loki configuration'
      }
    ]
  },
  {
    id: 6,
    name: 'eck-operator',
    path: './overlays/elastic',
    validated: false,
    owner: 'Platform Team',
    environments: ['SIT', 'UAT'],
    lastApplied: '2024-03-14T14:20:00Z',
    source: {
      type: 'git',
      url: 'https://github.com/org/eck-operator',
      branch: 'main'
    },
    resources: {
      deployments: 1,
      services: 1,
      configmaps: 2,
      secrets: 2
    },
    events: [
      {
        time: '2024-03-14T14:20:00Z',
        type: 'Warning',
        reason: 'Updating',
        message: 'Removing ES and Kibana components'
      }
    ]
  }
];

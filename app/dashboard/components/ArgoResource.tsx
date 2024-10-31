import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronUp, Check, AlertCircle, Clock, CheckCircle, XCircle, ChevronLeft, FileText, BarChart, History, ExternalLink, Pause } from "lucide-react"
import { Application, WorkflowTemplate, Workflow } from '../interfaces';
import { Trash2, RefreshCw, Plus } from "lucide-react"
import { DeployForm } from '@/app/components/deploy';
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronRight } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

// 如果 ../interfaces 文件中没有定义 status，可在这里扩展接口
interface ExtendedApplication extends Application {
  status: 'Synced' | 'OutOfSync' | 'Unknown' | 'Progressing' | 'Degraded';
  resources: {
    [cluster: string]: {
      cpu: string;
      memory: string;
      storage: string;
      pods: number;
    };
  };
  worklog: {
    date: string;
    action: string;
    user: string;
  }[];
  remoteRepo: {
    url: string;
    branch: string;
    baseCommitUrl: string;
    latestCommit: {
      id: string;
      message: string;
      author: string;
      timestamp: string;
    };
  };
  deployedEnvironments: string[];
  health: {
    status: 'Healthy' | 'Degraded' | 'Progressing' | 'Suspended' | 'Missing';
    message?: string;
  };
  argocdUrl: string;
}

// 添加发布历史的接口
interface ReleaseHistory {
  commitLog: string;
  commitHash: string;
  commitAuthor: string;
  operator: string;
  releaseDate: string;
  isCurrent: boolean;
  status: 'success' | 'failed' | 'in-progress';
  deploymentDetails?: {
    duration: string;
    podReplicas: string;
    configChanges: string[];
  };
}

// 修改 releaseHistories 的 mock 数据，让同一个 commit 在多个环境中都是 current
const releaseHistories: Record<string, ReleaseHistory[]> = {
  SIT: [
    {
      commitLog: "feat(auth): add OIDC authentication support",
      commitHash: "a1b2c3d4e5f6g7h8i9j0",
      commitAuthor: "Alice Smith",
      operator: "John Doe",
      releaseDate: "2024-03-20 14:30:00",
      isCurrent: true,
      status: 'success',
      deploymentDetails: {
        duration: "2m 30s",
        podReplicas: "3/3",
        configChanges: []
      }
    },
    {
      commitLog: "fix(api): resolve memory leak in connection pool",
      commitHash: "b2c3d4e5f6g7h8i9j0k",
      commitAuthor: "Bob Johnson",
      operator: "Jane Smith",
      releaseDate: "2024-03-19 11:20:00",
      isCurrent: false,
      status: 'success',
      deploymentDetails: {
        duration: "1m 45s",
        podReplicas: "3/3",
        configChanges: [
          "fix: implement connection pool cleanup",
          "test: add memory leak test cases"
        ]
      }
    },
    {
      commitLog: "feat(metrics): implement custom prometheus metrics",
      commitHash: "c3d4e5f6g7h8i9j0k1l",
      commitAuthor: "Charlie Wilson",
      operator: "Charlie Wilson",
      releaseDate: "2024-03-18 09:15:00",
      isCurrent: false,
      status: 'success',
      deploymentDetails: {
        duration: "2m 15s",
        podReplicas: "3/3",
        configChanges: [
          "feat: add custom metrics endpoints",
          "docs: update metrics documentation"
        ]
      }
    },
    {
      commitLog: "refactor(core): optimize database queries",
      commitHash: "d4e5f6g7h8i9j0k1l2m",
      commitAuthor: "David Lee",
      operator: "Alice Smith",
      releaseDate: "2024-03-17 16:45:00",
      isCurrent: false,
      status: 'success',
      deploymentDetails: {
        duration: "1m 30s",
        podReplicas: "3/3",
        configChanges: [
          "perf: implement query caching",
          "refactor: optimize SQL joins"
        ]
      }
    },
    {
      commitLog: "fix(security): update vulnerable dependencies",
      commitHash: "e5f6g7h8i9j0k1l2m3n",
      commitAuthor: "Eve Brown",
      operator: "John Doe",
      releaseDate: "2024-03-16 13:20:00",
      isCurrent: false,
      status: 'success',
      deploymentDetails: {
        duration: "1m 15s",
        podReplicas: "3/3",
        configChanges: [
          "fix: upgrade dependencies versions",
          "test: add security test cases"
        ]
      }
    },
    {
      commitLog: "feat(ui): implement new dashboard components",
      commitHash: "f6g7h8i9j0k1l2m3n4o",
      commitAuthor: "Frank White",
      operator: "Frank White",
      releaseDate: "2024-03-15 10:30:00",
      isCurrent: false,
      status: 'success',
      deploymentDetails: {
        duration: "2m 00s",
        podReplicas: "3/3",
        configChanges: [
          "feat: add new chart components",
          "style: update theme colors"
        ]
      }
    },
    {
      commitLog: "chore(deps): upgrade kubernetes client version",
      commitHash: "g7h8i9j0k1l2m3n4o5p",
      commitAuthor: "Grace Taylor",
      operator: "Bob Johnson",
      releaseDate: "2024-03-14 15:45:00",
      isCurrent: false,
      status: 'success',
      deploymentDetails: {
        duration: "1m 45s",
        podReplicas: "3/3",
        configChanges: [
          "chore: update k8s client to v1.28",
          "test: update integration tests"
        ]
      }
    }
  ],
  UAT: [
    {
      commitLog: "feat(auth): add OIDC authentication support",
      commitHash: "a1b2c3d4e5f6g7h8i9j0",
      commitAuthor: "Alice Smith",
      operator: "John Doe",
      releaseDate: "2024-03-20 14:30:00",
      isCurrent: true,
      status: 'success',
      deploymentDetails: {
        duration: "2m 30s",
        podReplicas: "3/3",
        configChanges: []
      }
    }
  ],
  PRD: [
    {
      commitLog: "feat(auth): add OIDC authentication support",
      commitHash: "a1b2c3d4e5f6g7h8i9j0",
      commitAuthor: "Alice Smith",
      operator: "John Doe",
      releaseDate: "2024-03-20 14:30:00",
      isCurrent: true,
      status: 'success',
      deploymentDetails: {
        duration: "2m 30s",
        podReplicas: "3/3",
        configChanges: []
      }
    }
  ]
};

// 将 applications 数组的类型更新为 ExtendedApplication[]
const applications: ExtendedApplication[] = [
  {
    id: 1, name: 'external secret', uri: '/apps/external secret', lastUpdate: '2023-04-01', owner: 'John Doe',
    creator: 'Alice Smith', lastUpdater: 'Bob Johnson', lastCommitId: 'abc123', lastCommitLog: 'Updated dependencies',
    podCount: 3, cpuCount: '2 cores', memoryAmount: '4Gi', secretCount: 2, status: 'Synced',
    resources: {
      SIT: {
        cpu: '200m',
        memory: '256Mi',
        storage: '1Gi',
        pods: 2
      },
      UAT: {
        cpu: '300m',
        memory: '512Mi',
        storage: '2Gi',
        pods: 3
      },
      PRD: {
        cpu: '500m',
        memory: '1Gi',
        storage: '5Gi',
        pods: 5
      }
    },
    worklog: [
      { date: '2023-06-10', action: 'Deployment updated', user: 'John Doe' },
      { date: '2023-06-09', action: 'Config map changed', user: 'Jane Smith' },
    ],
    remoteRepo: {
      url: 'https://github.com/org/external-secret',
      branch: 'main',
      baseCommitUrl: 'https://github.com/org/external-secret/commit',
      latestCommit: {
        id: 'abc123def',
        message: 'Update secret rotation policy',
        author: 'John Doe',
        timestamp: '2024-03-20T10:30:00Z'
      }
    },
    deployedEnvironments: ['SIT', 'UAT', 'PRD'],
    health: {
      status: 'Healthy',
      message: 'All components are running'
    },
    argocdUrl: 'https://argocd.example.com/applications/external-secret',
  },
  { id: 2, name: 'argo-rollout', uri: '/apps/argo-rollout', lastUpdate: '2023-04-02', owner: 'Jane Smith',
    creator: 'Charlie Wilson', lastUpdater: 'Alice Brown', lastCommitId: 'def456', lastCommitLog: 'Added new feature',
    podCount: 5, cpuCount: '4 cores', memoryAmount: '8Gi', secretCount: 3, status: 'OutOfSync',
    resources: {
      SIT: {
        cpu: '400m',
        memory: '512Mi',
        storage: '2Gi',
        pods: 3
      },
      UAT: {
        cpu: '500m',
        memory: '640Mi',
        storage: '2.5Gi',
        pods: 4
      },
      PRD: {
        cpu: '600m',
        memory: '768Mi',
        storage: '3Gi',
        pods: 5
      }
    },
    worklog: [
      { date: '2023-06-08', action: 'Rollout updated', user: 'Charlie Wilson' },
      { date: '2023-06-07', action: 'Service changed', user: 'Alice Brown' },
    ],
    remoteRepo: {
      url: 'https://github.com/org/argo-rollout',
      branch: 'main',
      baseCommitUrl: 'https://github.com/org/argo-rollout/commit',
      latestCommit: {
        id: 'def456ghi',
        message: 'Add new feature',
        author: 'Charlie Wilson',
        timestamp: '2024-03-19T10:30:00Z'
      }
    },
    deployedEnvironments: ['SIT', 'UAT'],
    health: {
      status: 'Healthy',
      message: 'All components are running'
    },
    argocdUrl: 'https://argocd.example.com/applications/argo-rollout',
  },
  { id: 3, name: 'kube-dashboard', uri: '/apps/kube-dashboard', lastUpdate: '2023-04-03', owner: 'Bob Johnson',
    creator: 'John Doe', lastUpdater: 'Charlie Wilson', lastCommitId: 'ghi789', lastCommitLog: 'Fixed bug',
    podCount: 2, cpuCount: '1 core', memoryAmount: '2Gi', secretCount: 1, status: 'Progressing',
    resources: {
      SIT: {
        cpu: '100m',
        memory: '128Mi',
        storage: '512Mi',
        pods: 1
      },
      UAT: {
        cpu: '150m',
        memory: '192Mi',
        storage: '640Mi',
        pods: 2
      },
      PRD: {
        cpu: '200m',
        memory: '256Mi',
        storage: '768Mi',
        pods: 3
      }
    },
    worklog: [
      { date: '2023-06-06', action: 'Dashboard updated', user: 'Bob Johnson' },
      { date: '2023-06-05', action: 'Config changed', user: 'John Doe' },
    ],
    remoteRepo: {
      url: 'https://github.com/org/kube-dashboard',
      branch: 'main',
      baseCommitUrl: 'https://github.com/org/kube-dashboard/commit',
      latestCommit: {
        id: 'ghi789jkl',
        message: 'Fixed bug',
        author: 'Bob Johnson',
        timestamp: '2024-03-15T10:30:00Z'
      }
    },
    deployedEnvironments: ['SIT', 'UAT'],
    health: {
      status: 'Healthy',
      message: 'All components are running'
    },
    argocdUrl: 'https://argocd.example.com/applications/kube-dashboard',
  },
  { id: 4, name: 'ray', uri: '/apps/ray', lastUpdate: '2023-04-04', owner: 'Alice Brown',
    creator: 'Jane Smith', lastUpdater: 'Bob Johnson', lastCommitId: 'jkl012', lastCommitLog: 'Refactored code',
    podCount: 4, cpuCount: '2 cores', memoryAmount: '4Gi', secretCount: 2, status: 'Unknown',
    resources: {
      SIT: {
        cpu: '300m',
        memory: '384Mi',
        storage: '1Gi',
        pods: 2
      },
      UAT: {
        cpu: '400m',
        memory: '480Mi',
        storage: '1.2Gi',
        pods: 3
      },
      PRD: {
        cpu: '500m',
        memory: '576Mi',
        storage: '1.5Gi',
        pods: 4
      }
    },
    worklog: [
      { date: '2023-06-04', action: 'Ray updated', user: 'Alice Brown' },
      { date: '2023-06-03', action: 'Config changed', user: 'Jane Smith' },
    ],
    remoteRepo: {
      url: 'https://github.com/org/ray',
      branch: 'main',
      baseCommitUrl: 'https://github.com/org/ray/commit',
      latestCommit: {
        id: 'jkl012mno',
        message: 'Refactored code',
        author: 'Alice Brown',
        timestamp: '2024-03-14T10:30:00Z'
      }
    },
    deployedEnvironments: ['SIT', 'UAT'],
    health: {
      status: 'Healthy',
      message: 'All components are running'
    },
    argocdUrl: 'https://argocd.example.com/applications/ray',
  },
  { id: 5, name: 'tidb', uri: '/apps/tidb', lastUpdate: '2023-04-05', owner: 'Charlie Wilson',
    creator: 'Alice Smith', lastUpdater: 'John Doe', lastCommitId: 'mno345', lastCommitLog: 'Improved performance',
    podCount: 6, cpuCount: '3 cores', memoryAmount: '6Gi', secretCount: 4, status: 'Degraded',
    resources: {
      SIT: {
        cpu: '600m',
        memory: '768Mi',
        storage: '2Gi',
        pods: 4
      },
      UAT: {
        cpu: '700m',
        memory: '896Mi',
        storage: '2.5Gi',
        pods: 5
      },
      PRD: {
        cpu: '800m',
        memory: '1024Mi',
        storage: '3Gi',
        pods: 6
      }
    },
    worklog: [
      { date: '2023-06-02', action: 'TiDB updated', user: 'Charlie Wilson' },
      { date: '2023-06-01', action: 'Config changed', user: 'Alice Smith' },
    ],
    remoteRepo: {
      url: 'https://github.com/org/tidb',
      branch: 'main',
      baseCommitUrl: 'https://github.com/org/tidb/commit',
      latestCommit: {
        id: 'mno345pqr',
        message: 'Improved performance',
        author: 'Charlie Wilson',
        timestamp: '2024-03-13T10:30:00Z'
      }
    },
    deployedEnvironments: ['SIT', 'UAT'],
    health: {
      status: 'Healthy',
      message: 'All components are running'
    },
    argocdUrl: 'https://argocd.example.com/applications/tidb',
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Synced':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'OutOfSync':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case 'Progressing':
      return <Clock className="h-4 w-4 text-blue-500" />;
    case 'Degraded':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />;
  }
};

const getHealthIcon = (health: ExtendedApplication['health']) => {
  switch (health.status) {
    case 'Healthy':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'Degraded':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'Progressing':
      return <Clock className="h-4 w-4 text-blue-500" />;
    case 'Suspended':
      return <Pause className="h-4 w-4 text-yellow-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />;
  }
};

interface ArgoResourceProps {
  activeSubMenu: string;
  onSelectApp: (appName: string) => void;
}

export function ArgoResource({ activeSubMenu, onSelectApp }: ArgoResourceProps) {
  const [selectedApps, setSelectedApps] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedApp, setExpandedApp] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedAppDetails, setSelectedAppDetails] = useState<ExtendedApplication | null>(null);
  const [activeTab, setActiveTab] = useState('SIT');

  // 修改 currentCommits 的初始化，添加可选链和默认值
  const [currentCommits, setCurrentCommits] = useState<Record<string, string>>({
    SIT: releaseHistories.SIT?.[0]?.commitHash || '',
    UAT: releaseHistories.UAT?.[0]?.commitHash || '',
    PRD: releaseHistories.PRD?.[0]?.commitHash || ''
  });

  // 添加 rollback 处理函数
  const handleRollback = (env: string, commitHash: string) => {
    // 更新当前 commit
    setCurrentCommits(prev => ({
      ...prev,
      [env]: commitHash
    }));

    // 更新 release histories 中的 isCurrent 标记
    const updatedHistories = { ...releaseHistories };
    updatedHistories[env] = releaseHistories[env].map(release => ({
      ...release,
      isCurrent: release.commitHash === commitHash
    }));

    console.log(`Rolling back to ${commitHash} in ${env}`);
  };

  const renderApplicationDetail = (app: ExtendedApplication) => {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header Section - 简化标题，只保留应用名称 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            {app.name}
          </h1>
          <Button variant="outline" onClick={() => setSelectedAppDetails(null)}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ArgoCD Deployment Status Card - 新增 */}
          <Card className="col-span-3 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <span>ArgoCD Deployment Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sync Status */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Sync Status</p>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(app.status)}
                    <span className="font-medium">{app.status}</span>
                  </div>
                </div>

                {/* Health Status */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Health Status</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center space-x-2">
                          {getHealthIcon(app.health)}
                          <span className="font-medium">{app.health.status}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{app.health.message}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Deployed Environments */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Deployed Environments</p>
                  <div className="flex flex-wrap gap-2">
                    {app.deployedEnvironments.map((env) => (
                      <span
                        key={env}
                        className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      >
                        {env}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ArgoCD Link */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">ArgoCD Console</p>
                  <a
                    href={app.argocdUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>View in ArgoCD</span>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* General Information Card - 保持原有的仓库信息 */}
          <Card className="col-span-2 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <span>General Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Owner</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {app.owner.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{app.owner}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Update</p>
                    <p className="mt-1">{new Date(app.lastUpdate).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Remote Repository Section */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Remote Repository</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Repository URL</span>
                    <a
                      href={app.remoteRepo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:text-blue-600 font-mono"
                    >
                      {app.remoteRepo.url}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Branch</span>
                    <span className="text-sm font-medium">{app.remoteRepo.branch}</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Latest Commit</span>
                      <code className="px-2 py-1 bg-gray-100 dark:bg-gray-900 rounded text-xs">
                        {app.remoteRepo.latestCommit.id}
                      </code>
                    </div>
                    <p className="text-sm">{app.remoteRepo.latestCommit.message}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{app.remoteRepo.latestCommit.author}</span>
                      <time>{new Date(app.remoteRepo.latestCommit.timestamp).toLocaleString()}</time>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resource Metrics Card */}
          <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart className="h-5 w-5 text-purple-500" />
                <span>Resource Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={app.deployedEnvironments[0]}>
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  {app.deployedEnvironments.map((env) => (
                    <TabsTrigger key={env} value={env}>
                      {env}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {app.deployedEnvironments.map((env) => (
                  <TabsContent key={env} value={env} className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400">CPU Usage</span>
                        <span className="font-medium">{app.resources[env].cpu}</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '60%' }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Memory Usage</span>
                        <span className="font-medium">{app.resources[env].memory}</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Storage Usage</span>
                        <span className="font-medium">{app.resources[env].storage}</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '30%' }} />
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <p className="text-2xl font-bold text-blue-500">{app.resources[env].pods}</p>
                          <p className="text-sm text-gray-500">Active Pods</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <p className="text-2xl font-bold text-green-500">{app.secretCount}</p>
                          <p className="text-sm text-gray-500">Secrets</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Release History Card */}
          <Card className="col-span-3 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <History className="h-5 w-5 text-green-500" />
                <span>Release History and Rollback</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800">
                    <TableHead>Commit Log</TableHead>
                    <TableHead>Commit Hash</TableHead>
                    <TableHead>Commit Author</TableHead>
                    <TableHead>Operator</TableHead>
                    <TableHead>Release Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {releaseHistories.SIT.map((release, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <TableCell>
                        <div className="space-y-2">
                          <div className="font-medium">{release.commitLog}</div>
                          <div className="flex gap-2">
                            {/* SIT 环境状态 */}
                            {releaseHistories.SIT.find(r => r.commitHash === release.commitHash)?.isCurrent && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-600 dark:bg-blue-900/20">
                                Current SIT
                              </Badge>
                            )}
                            {/* UAT 环境状态 */}
                            {releaseHistories.UAT.find(r => r.commitHash === release.commitHash)?.isCurrent && (
                              <Badge variant="outline" className="bg-purple-50 text-purple-600 dark:bg-purple-900/20">
                                Current UAT
                              </Badge>
                            )}
                            {/* PRD 环境状态 */}
                            {releaseHistories.PRD.find(r => r.commitHash === release.commitHash)?.isCurrent && (
                              <Badge variant="outline" className="bg-green-50 text-green-600 dark:bg-green-900/20">
                                Current PRD
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <a
                          href={`${app.remoteRepo.baseCommitUrl}/${release.commitHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center space-x-1 text-sm"
                        >
                          <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-blue-600 hover:text-blue-700 transition-colors">
                            {release.commitHash.substring(0, 7)}
                          </code>
                          <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all" />
                        </a>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                              {release.commitAuthor.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span>{release.commitAuthor}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                              {release.operator.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span>{release.operator}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <time className="text-gray-500">
                          {new Date(release.releaseDate).toLocaleString()}
                        </time>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {release.status === 'success' ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : release.status === 'failed' ? (
                            <XCircle className="h-4 w-4 text-red-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-blue-500" />
                          )}
                          <span className={
                            release.status === 'success' ? 'text-green-600' :
                            release.status === 'failed' ? 'text-red-600' : 'text-blue-600'
                          }>
                            {release.status.charAt(0).toUpperCase() + release.status.slice(1)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-8 h-8 p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {/* Redeploy 选项 */}
                            <DropdownMenuItem
                              onClick={() => {
                                console.log(`Redeploying in SIT`);
                              }}
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Redeploy
                            </DropdownMenuItem>

                            {/* Promote 选项 - 根据当前环境显示不同的选项 */}
                            {releaseHistories.SIT.includes(release) && (
                              <DropdownMenuItem
                                onClick={() => {
                                  console.log('Promoting to UAT');
                                }}
                              >
                                <ChevronRight className="h-4 w-4 mr-2" />
                                Promote to UAT
                              </DropdownMenuItem>
                            )}

                            {releaseHistories.UAT.includes(release) && (
                              <DropdownMenuItem
                                onClick={() => {
                                  console.log('Promoting to PRD');
                                }}
                              >
                                <ChevronRight className="h-4 w-4 mr-2" />
                                Promote to PRD
                              </DropdownMenuItem>
                            )}

                            {/* Rollback 选项 */}
                            {!release.isCurrent && (
                              <DropdownMenuItem
                                onClick={() => {
                                  if (release.commitHash !== currentCommits['SIT']) {
                                    handleRollback('SIT', release.commitHash);
                                  }
                                }}
                              >
                                <History className="h-4 w-4 mr-2" />
                                Rollback to this version
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const handleAppSelect = (appId: number) => {
    setSelectedApps(prev =>
      prev.includes(appId)
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  const toggleAppExpansion = (appId: number) => {
    setExpandedApp(expandedApp === appId ? null : appId);
  };

  const filteredApps = applications.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAppClick = (app: ExtendedApplication) => {
    setSelectedAppDetails(app);
    onSelectApp(app.name);
  };

  if (isCreating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="w-full max-w-4xl p-6 space-y-4">
          <DeployForm onCancel={() => setIsCreating(false)} />
        </div>
      </div>
    );
  }

  if (selectedAppDetails) {
    return renderApplicationDetail(selectedAppDetails);
  }

  // 主列表视图
  const mainListView = (
    <div className="space-y-6">
      {/* 顶部操作栏 */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4 flex-1">
          <Input
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button variant="outline" size="icon" onClick={() => console.log('Refresh')}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          {/* Add these new buttons */}
          {selectedApps.length > 0 && (
            <>
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                onClick={() => {
                  console.log('Deleting apps:', selectedApps);
                  // Add your delete logic here
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
              <Button
                variant="outline"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                onClick={() => {
                  console.log('Syncing apps:', selectedApps);
                  // Add your sync logic here
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Selected
              </Button>
            </>
          )}
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Application
          </Button>
        </div>
      </div>

      {/* 应用列表 */}
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedApps.length === filteredApps.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedApps(filteredApps.map(app => app.id));
                      } else {
                        setSelectedApps([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Health</TableHead>
                <TableHead>Repository</TableHead>
                <TableHead>Environments</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApps.map((app) => (
                <TableRow key={app.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Checkbox
                      checked={selectedApps.includes(app.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedApps([...selectedApps, app.id]);
                        } else {
                          setSelectedApps(selectedApps.filter(id => id !== app.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      className="p-0 h-auto font-medium"
                      onClick={() => handleAppClick(app)}
                    >
                      {app.name}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {app.status === 'Synced' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : app.status === 'OutOfSync' ? (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-blue-500" />
                      )}
                      <span className={
                        app.status === 'Synced' ? 'text-green-600' :
                        app.status === 'OutOfSync' ? 'text-yellow-600' :
                        'text-blue-600'
                      }>
                        {app.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant={
                            app.health.status === 'Healthy' ? 'default' :
                            app.health.status === 'Degraded' ? 'destructive' :
                            app.health.status === 'Progressing' ? 'secondary' :
                            'outline'
                          }>
                            <div className="flex items-center space-x-2">
                              {getHealthIcon(app.health)}
                              <span>{app.health.status}</span>
                            </div>
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{app.health.message}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <code className="px-2 py-1 bg-muted rounded text-xs">
                        {app.remoteRepo.branch}
                      </code>
                      <a
                        href={app.remoteRepo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary"
                      >
                        {app.remoteRepo.url.split('/').slice(-2).join('/')}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {app.deployedEnvironments.map((env) => (
                        <Badge
                          key={env}
                          variant="outline"
                          className="text-xs"
                        >
                          {env}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <time className="text-sm text-muted-foreground">
                      {new Date(app.lastUpdate).toLocaleDateString()}
                    </time>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(app.argocdUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedAppDetails(app)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  return mainListView;
}


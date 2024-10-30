import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronUp, Check, AlertCircle, Clock, CheckCircle, XCircle } from "lucide-react"
import { Application, WorkflowTemplate, Workflow } from '../interfaces';
import { Trash2, RefreshCw, Plus } from "lucide-react"
import { DeployForm } from '@/app/components/deploy';

// 如果 ../interfaces 文件中没有定义 status，可以在这里扩展接口
interface ExtendedApplication extends Application {
  status: 'Synced' | 'OutOfSync' | 'Unknown' | 'Progressing' | 'Degraded';
  resources: {
    cpu: string;
    memory: string;
    storage: string;
    pods: number;
  };
  worklog: {
    date: string;
    action: string;
    user: string;
  }[];
}

// 将 applications 数组的类型更新为 ExtendedApplication[]
const applications: ExtendedApplication[] = [
  {
    id: 1, name: 'external secret', uri: '/apps/external secret', lastUpdate: '2023-04-01', owner: 'John Doe',
    creator: 'Alice Smith', lastUpdater: 'Bob Johnson', lastCommitId: 'abc123', lastCommitLog: 'Updated dependencies',
    podCount: 3, cpuCount: '2 cores', memoryAmount: '4Gi', secretCount: 2, status: 'Synced',
    resources: {
      cpu: '200m',
      memory: '256Mi',
      storage: '1Gi',
      pods: 2
    },
    worklog: [
      { date: '2023-06-10', action: 'Deployment updated', user: 'John Doe' },
      { date: '2023-06-09', action: 'Config map changed', user: 'Jane Smith' },
    ]
  },
  { id: 2, name: 'argo-rollout', uri: '/apps/argo-rollout', lastUpdate: '2023-04-02', owner: 'Jane Smith',
    creator: 'Charlie Wilson', lastUpdater: 'Alice Brown', lastCommitId: 'def456', lastCommitLog: 'Added new feature',
    podCount: 5, cpuCount: '4 cores', memoryAmount: '8Gi', secretCount: 3, status: 'OutOfSync',
    resources: {
      cpu: '400m',
      memory: '512Mi',
      storage: '2Gi',
      pods: 3
    },
    worklog: [
      { date: '2023-06-08', action: 'Rollout updated', user: 'Charlie Wilson' },
      { date: '2023-06-07', action: 'Service changed', user: 'Alice Brown' },
    ]
  },
  { id: 3, name: 'kube-dashboard', uri: '/apps/kube-dashboard', lastUpdate: '2023-04-03', owner: 'Bob Johnson',
    creator: 'John Doe', lastUpdater: 'Charlie Wilson', lastCommitId: 'ghi789', lastCommitLog: 'Fixed bug',
    podCount: 2, cpuCount: '1 core', memoryAmount: '2Gi', secretCount: 1, status: 'Progressing',
    resources: {
      cpu: '100m',
      memory: '128Mi',
      storage: '512Mi',
      pods: 1
    },
    worklog: [
      { date: '2023-06-06', action: 'Dashboard updated', user: 'Bob Johnson' },
      { date: '2023-06-05', action: 'Config changed', user: 'John Doe' },
    ]
  },
  { id: 4, name: 'ray', uri: '/apps/ray', lastUpdate: '2023-04-04', owner: 'Alice Brown',
    creator: 'Jane Smith', lastUpdater: 'Bob Johnson', lastCommitId: 'jkl012', lastCommitLog: 'Refactored code',
    podCount: 4, cpuCount: '2 cores', memoryAmount: '4Gi', secretCount: 2, status: 'Unknown',
    resources: {
      cpu: '300m',
      memory: '384Mi',
      storage: '1Gi',
      pods: 2
    },
    worklog: [
      { date: '2023-06-04', action: 'Ray updated', user: 'Alice Brown' },
      { date: '2023-06-03', action: 'Config changed', user: 'Jane Smith' },
    ]
  },
  { id: 5, name: 'tidb', uri: '/apps/tidb', lastUpdate: '2023-04-05', owner: 'Charlie Wilson',
    creator: 'Alice Smith', lastUpdater: 'John Doe', lastCommitId: 'mno345', lastCommitLog: 'Improved performance',
    podCount: 6, cpuCount: '3 cores', memoryAmount: '6Gi', secretCount: 4, status: 'Degraded',
    resources: {
      cpu: '600m',
      memory: '768Mi',
      storage: '2Gi',
      pods: 4
    },
    worklog: [
      { date: '2023-06-02', action: 'TiDB updated', user: 'Charlie Wilson' },
      { date: '2023-06-01', action: 'Config changed', user: 'Alice Smith' },
    ]
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

export function ArgoResource({ activeSubMenu }: { activeSubMenu: string }) {
  const [selectedApps, setSelectedApps] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedApp, setExpandedApp] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedAppDetails, setSelectedAppDetails] = useState<ExtendedApplication | null>(null)

  const handleAppSelect = (appId: number) => {
    setSelectedApps(prev =>
      prev.includes(appId)
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    )
  }

  const toggleAppExpansion = (appId: number) => {
    setExpandedApp(expandedApp === appId ? null : appId);
  };

  const filteredApps = applications.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.owner.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAppClick = (app: ExtendedApplication) => {
    setSelectedAppDetails(app);
  };

  const renderApplicationDetail = (app: ExtendedApplication) => {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            Application Detail: {app.name}
          </h1>
          <Button variant="outline" onClick={() => setSelectedAppDetails(null)}>
            Back to List
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last Update</p>
                <p className="font-medium">{app.lastUpdate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Owner</p>
                <p className="font-medium">{app.owner}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <div className="flex items-center">
                  {getStatusIcon(app.status)}
                  <span className="ml-2 font-medium">{app.status}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">ArgoCD URL</p>
                <a href={app.uri} className="text-blue-500 hover:underline font-medium">{app.uri}</a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resource Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">CPU</p>
                <p className="font-medium">{app.resources.cpu}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Memory</p>
                <p className="font-medium">{app.resources.memory}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Storage</p>
                <p className="font-medium">{app.resources.storage}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pods</p>
                <p className="font-medium">{app.resources.pods}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Creator</p>
                <p className="font-medium">{app.creator}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last Updater</p>
                <p className="font-medium">{app.lastUpdater}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last Commit ID</p>
                <p className="font-medium">{app.lastCommitId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last Commit Log</p>
                <p className="font-medium">{app.lastCommitLog}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Work Log</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {app.worklog.map((log, index) => (
                    <TableRow key={index}>
                      <TableCell>{log.date}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.user}</TableCell>
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Argo Resources</h1>
        <div className="flex space-x-2">
          <Button size="sm" onClick={() => setIsCreating(true)}>
            <Plus className="mr-2 h-4 w-4"/>
            Create
          </Button>
          <Button size="sm" variant="outline" className="hover:bg-blue-50 dark:hover:bg-blue-900">
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync
          </Button>
          <Button size="sm" variant="destructive" disabled={selectedApps.length === 0} className="hover:bg-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>{activeSubMenu}</CardTitle>
          {activeSubMenu === 'ArgoApplication' && (
            <Input
              placeholder="Search by name, label, or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-2 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
            />
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 dark:bg-gray-700">
                {activeSubMenu === 'ArgoApplication' && (
                  <>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Last Update</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>ArgoCD URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeSubMenu === 'ArgoApplication' && filteredApps.map((app) => (
                <>
                  <TableRow key={app.id}>
                    <TableCell>
                      <div
                        className="w-5 h-5 border border-gray-300 flex items-center justify-center cursor-pointer"
                        onClick={() => handleAppSelect(app.id)}
                      >
                        {selectedApps.includes(app.id) && <Check className="h-4 w-4 text-primary" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="link" onClick={() => handleAppClick(app)}>
                        {app.name}
                      </Button>
                    </TableCell>
                    <TableCell>{app.lastUpdate}</TableCell>
                    <TableCell>{app.owner}</TableCell>
                    <TableCell>
                      <a href={app.uri} className="hover:underline">
                        {app.uri}
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(app.status)}
                        <span>{app.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => toggleAppExpansion(app.id)}>
                        {expandedApp === app.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedApp === app.id && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <div className="p-4 bg-gray-50 rounded-md">
                          <h4 className="font-semibold mb-2">Additional Information</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p><strong>Creator:</strong> {app.creator}</p>
                              <p><strong>Last Updater:</strong> {app.lastUpdater}</p>
                              <p><strong>Last Commit ID:</strong> {app.lastCommitId}</p>
                              <p><strong>Last Commit Log:</strong> {app.lastCommitLog}</p>
                            </div>
                            <div>
                              <p><strong>Pod Count:</strong> {app.podCount}</p>
                              <p><strong>CPU:</strong> {app.cpuCount}</p>
                              <p><strong>Memory:</strong> {app.memoryAmount}</p>
                              <p><strong>Secret Count:</strong> {app.secretCount}</p>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


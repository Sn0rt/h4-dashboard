import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronUp, Check } from "lucide-react"
import { Application, WorkflowTemplate, Workflow } from '../interfaces';
import { DeployApp } from "@/app/components/deploy"

// Mock data
const applications: Application[] = [
  {
    id: 1, name: 'external secret', uri: '/apps/external secret', lastUpdate: '2023-04-01', owner: 'John Doe',
    creator: 'Alice Smith', lastUpdater: 'Bob Johnson', lastCommitId: 'abc123', lastCommitLog: 'Updated dependencies',
    podCount: 3, cpuCount: '2 cores', memoryAmount: '4Gi', secretCount: 2
  },
  { id: 2, name: 'argo-rollout', uri: '/apps/argo-rollout', lastUpdate: '2023-04-02', owner: 'Jane Smith',
    creator: 'Charlie Wilson', lastUpdater: 'Alice Brown', lastCommitId: 'def456', lastCommitLog: 'Added new feature',
    podCount: 5, cpuCount: '4 cores', memoryAmount: '8Gi', secretCount: 3
  },
  { id: 3, name: 'kube-dashboard', uri: '/apps/kube-dashboard', lastUpdate: '2023-04-03', owner: 'Bob Johnson',
    creator: 'John Doe', lastUpdater: 'Charlie Wilson', lastCommitId: 'ghi789', lastCommitLog: 'Fixed bug',
    podCount: 2, cpuCount: '1 core', memoryAmount: '2Gi', secretCount: 1
  },
  { id: 4, name: 'ray', uri: '/apps/ray', lastUpdate: '2023-04-04', owner: 'Alice Brown',
    creator: 'Jane Smith', lastUpdater: 'Bob Johnson', lastCommitId: 'jkl012', lastCommitLog: 'Refactored code',
    podCount: 4, cpuCount: '2 cores', memoryAmount: '4Gi', secretCount: 2
  },
  { id: 5, name: 'tidb', uri: '/apps/tidb', lastUpdate: '2023-04-05', owner: 'Charlie Wilson',
    creator: 'Alice Smith', lastUpdater: 'John Doe', lastCommitId: 'mno345', lastCommitLog: 'Improved performance',
    podCount: 6, cpuCount: '3 cores', memoryAmount: '6Gi', secretCount: 4
  },
];

const workflowTemplates: WorkflowTemplate[] = [
  { id: 1, name: 'Data Processing', description: 'Template for data processing workflows', createdAt: '2023-05-01' },
  { id: 2, name: 'ML Training', description: 'Machine learning model training template', createdAt: '2023-05-02' },
  { id: 3, name: 'ETL Pipeline', description: 'Extract, Transform, Load pipeline template', createdAt: '2023-05-03' },
];

// Mock data for Workflows
const workflows: Workflow[] = [
  {
    id: 1,
    name: 'data-processing',
    status: 'Succeeded',
    startedAt: '2023-06-01T10:00:00Z',
    finishedAt: '2023-06-01T10:15:00Z',
    duration: '15m',
    progress: '100%',
    message: 'Data processing completed successfully'
  },
  {
    id: 2,
    name: 'ml-training',
    status: 'Running',
    startedAt: '2023-06-02T09:30:00Z',
    finishedAt: null,
    duration: '1h 30m',
    progress: '60%',
    message: 'Training model on batch 3 of 5'
  },
  {
    id: 3,
    name: 'etl-pipeline',
    status: 'Failed',
    startedAt: '2023-06-03T08:00:00Z',
    finishedAt: '2023-06-03T08:05:00Z',
    duration: '5m',
    progress: '20%',
    message: 'Error in data extraction step'
  },
  {
    id: 4,
    name: 'data-backup',
    status: 'Pending',
    startedAt: null,
    finishedAt: null,
    duration: '-',
    progress: '0%',
    message: 'Waiting for resources'
  },
  {
    id: 5,
    name: 'report-generation',
    status: 'Running',
    startedAt: '2023-06-04T11:00:00Z',
    finishedAt: null,
    duration: '45m',
    progress: '80%',
    message: 'Generating final report'
  }
];

export function ArgoResource({ activeSubMenu }: { activeSubMenu: string }) {
  const [selectedApps, setSelectedApps] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedApp, setExpandedApp] = useState<number | null>(null)

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

  const renderApplications = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
          <Input
            placeholder="Search by name, label, or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-2"
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>ArgoCD URL</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApps.map((app) => (
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
                    <TableCell>{app.name}</TableCell>
                    <TableCell>{app.lastUpdate}</TableCell>
                    <TableCell>{app.owner}</TableCell>
                    <TableCell>
                      <a href={app.uri} className="hover:underline">
                        {app.uri}
                      </a>
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
    );
  };

  const renderWorkflowTemplates = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workflow Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflowTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>{template.name}</TableCell>
                  <TableCell>{template.description}</TableCell>
                  <TableCell>{template.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  const renderWorkflows = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workflows</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Started At</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflows.map((workflow) => (
                <TableRow key={workflow.id}>
                  <TableCell>{workflow.name}</TableCell>
                  <TableCell>{workflow.status}</TableCell>
                  <TableCell>{workflow.startedAt || '-'}</TableCell>
                  <TableCell>{workflow.duration}</TableCell>
                  <TableCell>{workflow.progress}</TableCell>
                  <TableCell>{workflow.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{activeSubMenu}</h1>
        {activeSubMenu === 'Application' && (
          <div className="space-x-2">
            <DeployApp />
            <Button size="sm" variant="destructive" disabled={selectedApps.length === 0}>
              Delete
            </Button>
          </div>
        )}
      </div>
      {activeSubMenu === 'Application' && renderApplications()}
      {activeSubMenu === 'WorkflowTemplate' && renderWorkflowTemplates()}
      {activeSubMenu === 'Workflow' && renderWorkflows()}
    </>
  );
}


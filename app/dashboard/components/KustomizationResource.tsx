import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { CheckCircle, AlertCircle, Clock, XCircle, Plus, RefreshCw, Trash2, ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { kustomizations, type Kustomization } from './kustomizationMock';

export function KustomizationResource() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKustomization, setSelectedKustomization] = useState<Kustomization | null>(null);

  const filteredKustomizations = kustomizations.filter(k =>
    k.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderKustomizationDetail = (kustomization: Kustomization) => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{kustomization.name}</h2>
          <Button variant="outline" onClick={() => setSelectedKustomization(null)}>
            Back to List
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Path</p>
                <p className="font-medium">{kustomization.path}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Validation Status</p>
                <div className="flex items-center space-x-2">
                  {kustomization.validated ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  )}
                  <span>{kustomization.validated ? 'Validated' : 'Not Validated'}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Applied</p>
                <p className="font-medium">{new Date(kustomization.lastApplied).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Source</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium capitalize">{kustomization.source.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">URL</p>
                <p className="font-medium">{kustomization.source.url}</p>
              </div>
              {kustomization.source.branch && (
                <div>
                  <p className="text-sm text-gray-500">Branch</p>
                  <p className="font-medium">{kustomization.source.branch}</p>
                </div>
              )}
              {kustomization.source.tag && (
                <div>
                  <p className="text-sm text-gray-500">Tag</p>
                  <p className="font-medium">{kustomization.source.tag}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-500">Deployments</p>
                <p className="text-2xl font-bold">{kustomization.resources.deployments}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-500">Services</p>
                <p className="text-2xl font-bold">{kustomization.resources.services}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-500">ConfigMaps</p>
                <p className="text-2xl font-bold">{kustomization.resources.configmaps}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-500">Secrets</p>
                <p className="text-2xl font-bold">{kustomization.resources.secrets}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Events</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kustomization.events.map((event, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(event.time).toLocaleString()}</TableCell>
                    <TableCell>{event.type}</TableCell>
                    <TableCell>{event.reason}</TableCell>
                    <TableCell>{event.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (selectedKustomization) {
    return renderKustomizationDetail(selectedKustomization);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Kustomizations</h1>
        <div className="flex space-x-2">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4"/>
            Create
          </Button>
          <Button size="sm" variant="outline" className="hover:bg-blue-50 dark:hover:bg-blue-900">
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync
          </Button>
          <Button size="sm" variant="destructive" className="hover:bg-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Kustomization List</CardTitle>
          <Input
            placeholder="Search by name, path, or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-2 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 dark:bg-gray-700">
                <TableHead className="w-[50px]">
                  <div className="w-5 h-5 border border-gray-300 rounded"></div>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Path</TableHead>
                <TableHead>Validated</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Source Type</TableHead>
                <TableHead>Environments</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKustomizations.map((kustomization) => (
                <TableRow
                  key={kustomization.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <TableCell>
                    <div className="w-5 h-5 border border-gray-300 flex items-center justify-center cursor-pointer rounded">
                      {/* Add checkbox logic here */}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="link" onClick={() => setSelectedKustomization(kustomization)}>
                      {kustomization.name}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{kustomization.path}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {kustomization.validated ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className={kustomization.validated ? 'text-green-600' : 'text-yellow-600'}>
                        {kustomization.validated ? 'Validated' : 'Not Validated'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-primary/10 text-xs">
                          {kustomization.owner.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{kustomization.owner}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize px-2 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 rounded-full text-sm">
                      {kustomization.source.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {kustomization.environments.map((env) => (
                        <span
                          key={env}
                          className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        >
                          {env}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
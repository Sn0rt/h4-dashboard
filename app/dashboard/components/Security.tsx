"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Secret } from '../interfaces';

// Mock data for Secrets
const secrets: Secret[] = [
  { id: 1, name: 'database-credentials', type: 'Opaque', createdAt: '2023-06-01', lastUpdated: '2023-06-05' },
  { id: 2, name: 'api-keys', type: 'Opaque', createdAt: '2023-06-02', lastUpdated: '2023-06-02' },
  { id: 3, name: 'tls-cert', type: 'kubernetes.io/tls', createdAt: '2023-06-03', lastUpdated: '2023-06-04' },
  { id: 4, name: 'docker-registry', type: 'kubernetes.io/dockerconfigjson', createdAt: '2023-06-04', lastUpdated: '2023-06-04' },
  { id: 5, name: 'service-account-token', type: 'kubernetes.io/service-account-token', createdAt: '2023-06-05', lastUpdated: '2023-06-05' },
];

export function Security({ activeSubMenu }: { activeSubMenu: string }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSecrets = secrets.filter(secret =>
    secret.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    secret.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderSecrets = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Secrets</CardTitle>
          <Input
            placeholder="Search by name or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-2"
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSecrets.map((secret) => (
                <TableRow key={secret.id}>
                  <TableCell>{secret.name}</TableCell>
                  <TableCell>{secret.type}</TableCell>
                  <TableCell>{secret.createdAt}</TableCell>
                  <TableCell>{secret.lastUpdated}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
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
        {activeSubMenu === 'Secret' && (
          <Button size="sm">
            Create Secret
          </Button>
        )}
      </div>
      {activeSubMenu === 'Secret' && renderSecrets()}
    </>
  );
}
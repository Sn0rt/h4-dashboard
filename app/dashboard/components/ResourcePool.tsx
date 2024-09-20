"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { ResourceQuota, Node } from '../interfaces';

// Mock data
const resourceQuota: ResourceQuota = {
  cpu: '10 cores',
  memory: '32Gi',
  storage: '500Gi'
}

const nodes: Node[] = [
  { id: 1, name: 'node-1', ip: '192.168.1.1', status: 'Ready', cpu: '4 cores', memory: '16Gi' },
  { id: 2, name: 'node-2', ip: '192.168.1.2', status: 'Ready', cpu: '4 cores', memory: '16Gi' },
  { id: 3, name: 'node-3', ip: '192.168.1.3', status: 'NotReady', cpu: '2 cores', memory: '8Gi' },
]

export function ResourcePool({ activeSubMenu }: { activeSubMenu: string }) {
  const renderResourceOverview = () => {
    const parseValue = (value: string) => {
      const numericValue = parseFloat(value);
      if (isNaN(numericValue)) return 0;
      if (value.includes('Gi')) return numericValue * 1024;
      if (value.includes('Mi')) return numericValue;
      if (value.includes('cores')) return numericValue * 1000;
      return numericValue;
    };

    const data = [
      { name: 'CPU', value: parseValue(resourceQuota.cpu), color: '#0088FE' },
      { name: 'Memory', value: parseValue(resourceQuota.memory), color: '#00C49F' },
      { name: 'Storage', value: parseValue(resourceQuota.storage), color: '#FFBB28' }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((item) => (
          <Card key={item.name}>
            <CardHeader>
              <CardTitle>{item.name} Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[item]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill={item.color}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell key={`cell-${item.name}`} fill={item.color} />
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} ${item.name === 'CPU' ? 'm' : 'Mi'}`, item.name]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center">
                <p className="font-semibold">{resourceQuota[item.name.toLowerCase() as keyof ResourceQuota]}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderNodes = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dedicated Nodes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>CPU</TableHead>
                <TableHead>Memory</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nodes.map((node) => (
                <TableRow key={node.id}>
                  <TableCell>{node.name}</TableCell>
                  <TableCell>{node.ip}</TableCell>
                  <TableCell>{node.status}</TableCell>
                  <TableCell>{node.cpu}</TableCell>
                  <TableCell>{node.memory}</TableCell>
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
      </div>
      {activeSubMenu === 'Overview' && renderResourceOverview()}
      {activeSubMenu === 'Nodes' && renderNodes()}
    </>
  );
}


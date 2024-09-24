"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { XCircle, PlusCircle, Cpu, MemoryStick, HardDrive, Network, Box, X, CheckCircle } from 'lucide-react';

type ValidationStatus = 'success' | 'error' | 'loading' | null;

interface ValidationStatuses {
  item1: ValidationStatus;
  item2: ValidationStatus;
  item3: ValidationStatus;
}

interface DeployFormProps {
  onCancel: () => void;
}

interface Ingress {
  name: string;
  service: string;
  port: string;
}

interface Repository {
  url: string;
  branch: string;
}

export function DeployForm({ onCancel }: DeployFormProps) {
  const [ingresses, setIngresses] = useState<Ingress[]>([{ name: '', service: '', port: '' }]);
  const [repositories, setRepositories] = useState<Repository[]>([{ url: '', branch: ''}]);
  const [validationStatus, setValidationStatus] = useState<'success' | 'error' | 'loading' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    onCancel();
  };

  const addIngress = () => {
    if (ingresses.length < 2) {
      setIngresses([...ingresses, { name: '', service: '', port: '' }]);
    }
  };

  const removeIngress = (index: number) => {
    setIngresses(ingresses.filter((_, i) => i !== index));
  };

  const updateIngress = (index: number, field: keyof Ingress, value: string) => {
    const newIngresses = [...ingresses];
    newIngresses[index][field] = value;
    setIngresses(newIngresses);
  };

  const addRepository = () => {
    if (repositories.length < 2) {
      setRepositories([...repositories, { url: '', branch: '' }]);
    }
  };

  const removeRepository = (index: number) => {
    setRepositories(repositories.filter((_, i) => i !== index));
  };

  const updateRepository = (index: number, field: keyof Repository, value: string) => {
    const newRepositories = [...repositories];
    newRepositories[index][field] = value;
    setRepositories(newRepositories);
  };

  const validateRepos = async () => {
    setValidationStatus('loading');
    // 这里应该是一个实际的API调用来验证仓库
    // 为了演示，我们使用一个模拟的异步操作
    setTimeout(() => {
      // 随机设置验证结果
      setValidationStatus(Math.random() > 0.5 ? 'success' : 'error');
    }, 1000);
  };

  return (
    <Card className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="tenantName" className="text-sm font-medium text-gray-700 dark:text-gray-300">Tenant Name</Label>
            <Input id="tenantName" placeholder="Enter tenant name" className="w-full" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="appCode" className="text-sm font-medium text-gray-700 dark:text-gray-300">App Code</Label>
            <Select>
              <SelectTrigger id="appCode">
                <SelectValue placeholder="Select app code" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="code1">Code 1</SelectItem>
                <SelectItem value="code2">Code 2</SelectItem>
                <SelectItem value="code3">Code 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="namespace" className="text-sm font-medium text-gray-700 dark:text-gray-300">Namespace</Label>
          <Input id="namespace" placeholder="Enter namespace" className="w-full" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</Label>
          <Textarea id="description" placeholder="Enter description" className="w-full" />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Repository Information</h3>
          {repositories.map((repo, index) => (
            <div key={index} className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`repoUrl-${index}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {index === 0 ? "Base Repository URL" : "Overlay Repository URL"}
                  </Label>
                  <Input
                    id={`repoUrl-${index}`}
                    placeholder="Enter repository URL"
                    className="w-full"
                    value={repo.url}
                    onChange={(e) => updateRepository(index, 'url', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`branch-${index}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">Branch</Label>
                  <Input
                    id={`branch-${index}`}
                    placeholder="Enter branch name"
                    className="w-full"
                    value={repo.branch}
                    onChange={(e) => updateRepository(index, 'branch', e.target.value)}
                  />
                </div>
              </div>
              {repositories.length > 1 && index === 1 && (
                <Button variant="outline" size="icon" onClick={() => removeRepository(index)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          {repositories.length < 2 && (
            <Button variant="outline" onClick={addRepository} className="mt-2">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Overlay Repository
            </Button>
          )}
          <div className="flex items-center space-x-2">
            <Button
              onClick={validateRepos}
              disabled={repositories.some(repo => !repo.url || !repo.branch)}
            >
              Validate {repositories.length > 1 ? "Repositories" : "Repository"}
            </Button>
            {validationStatus === 'loading' && <span>Validating...</span>}
            {validationStatus === 'success' && <CheckCircle className="text-green-500" />}
            {validationStatus === 'error' && <XCircle className="text-red-500" />}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Ingresses</h3>
          {ingresses.map((ingress, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Input
                placeholder="Name"
                value={ingress.name}
                onChange={(e) => updateIngress(index, 'name', e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Service"
                value={ingress.service}
                onChange={(e) => updateIngress(index, 'service', e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Port"
                value={ingress.port}
                onChange={(e) => updateIngress(index, 'port', e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => removeIngress(index)}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addIngress} className="mt-2">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Ingress
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Environment</h3>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select environment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sit">SIT</SelectItem>
              <SelectItem value="uat1">UAT1</SelectItem>
              <SelectItem value="uat2">UAT2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Resource Quotas</h3>
          <div className="grid grid-cols-3 gap-6">
            {['SIT', 'UAT', 'PRD'].map((env) => (
              <div key={env} className="space-y-4">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{env}</Label>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Cpu className="h-4 w-4 text-gray-500" />
                    <Input type="number" placeholder="vCPU" className="w-full" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <MemoryStick className="h-4 w-4 text-gray-500" />
                    <Input type="number" placeholder="RAM (GiB)" className="w-full" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <HardDrive className="h-4 w-4 text-gray-500" />
                    <Input type="number" placeholder="Storage (GiB)" className="w-full" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Network className="h-4 w-4 text-gray-500" />
                    <Input type="number" placeholder="PVCs" className="w-full" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Box className="h-4 w-4 text-gray-500" />
                    <Input type="number" placeholder="Nodeports" className="w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Work Log</h3>
          <div className="space-y-2 bg-gray-100 p-4 rounded">
            <p className="text-sm">Work log entries will appear here</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 p-6">
        <Button variant="outline" onClick={onCancel} className="w-full mr-2">Cancel</Button>
        <Button onClick={handleSubmit} className="w-full ml-2">Submit</Button>
      </CardFooter>
    </Card>
  )
}
"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { XCircle, PlusCircle, Cpu, MemoryStick, HardDrive, Network, Box, X, CheckCircle, Layout, Settings2, Check, RefreshCw, HelpCircle } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tooltip } from "@/components/ui/tooltip"
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft } from 'lucide-react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import yaml from 'react-syntax-highlighter/dist/esm/languages/hljs/yaml';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  clusterDefaults,
  type ClusterDefaults,
  tenants,
  fieldDescriptions,
  resourceDescriptions,
  mockYamlTemplate,
  type ClusterQuota,
  type TenantInfo,
  type FieldDescription,
  type FieldDescriptions,
  type ValidationStatus,
  type ValidationStatuses,
  type Ingress,
  type Repository,
  type TemplateSource,
} from './mockData';
import { kustomizations } from '@/app/dashboard/components/kustomizationMock';
import { DryRun } from './dryrun';

// 注册 YAML 语言
SyntaxHighlighter.registerLanguage('yaml', yaml);

interface DeployFormProps {
  onCancel: () => void;
}

export function DeployForm({ onCancel }: DeployFormProps) {
  const [ingresses, setIngresses] = useState<Ingress[]>([{ name: '', service: '', port: '' }]);
  const [repositories, setRepositories] = useState<Repository[]>([{ url: '', branch: ''}]);
  const [validationStatus, setValidationStatus] = useState<'success' | 'error' | 'loading' | null>(null);
  const [templateSource, setTemplateSource] = useState<TemplateSource>({
    type: 'builtin',
    value: '',
    instanceName: ''
  });

  // 添选中集群状态
  const [selectedClusters, setSelectedClusters] = useState<string[]>([]);

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
      // 随机设置验结果
      setValidationStatus(Math.random() > 0.5 ? 'success' : 'error');
    }, 1000);
  };

  const calculateProgress = () => {
    let totalFields = 0;
    let completedFields = 0;

    // Template Selection
    totalFields += 1;
    if (templateSource.value) completedFields += 1;

    // Basic Information
    totalFields += 3; // tenant name, app code, namespace
    const basicInfoInputs = document.querySelectorAll('#tenantName, #appCode, #namespace');
    basicInfoInputs.forEach(input => {
      if ((input as HTMLInputElement).value) completedFields += 1;
    });

    // Ingresses
    ingresses.forEach(ingress => {
      totalFields += 3; // name, service, port
      if (ingress.name) completedFields += 1;
      if (ingress.service) completedFields += 1;
      if (ingress.port) completedFields += 1;
    });

    // Environment
    totalFields += 1;
    const envSelect = document.querySelector('[placeholder="Select environment"]');
    if ((envSelect as HTMLSelectElement)?.value) completedFields += 1;

    // Resource Quotas (5 fields per environment * 3 environments)
    totalFields += 15;
    const quotaInputs = document.querySelectorAll('[placeholder*="vCPU"], [placeholder*="RAM"], [placeholder*="Storage"], [placeholder*="PVCs"], [placeholder*="Nodeports"]');
    quotaInputs.forEach(input => {
      if ((input as HTMLInputElement).value) completedFields += 1;
    });

    return Math.round((completedFields / totalFields) * 100);
  };

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      setProgress(calculateProgress());
    };

    updateProgress();

    const form = document.querySelector('form');
    const observer = new MutationObserver(updateProgress);

    if (form) {
      observer.observe(form, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true
      });
    }

    return () => observer.disconnect();
  }, [ingresses, calculateProgress]);

  // 原有的 Environment 部分
  const renderEnvironmentSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Target Clusters
        </h3>
        <span className="text-sm text-gray-500">
          {selectedClusters.length} cluster(s) selected
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.keys(clusterDefaults).map((cluster) => (
          <Button
            key={cluster}
            variant={selectedClusters.includes(cluster) ? "default" : "outline"}
            onClick={() => {
              setSelectedClusters(prev =>
                prev.includes(cluster)
                  ? prev.filter(c => c !== cluster)
                  : [...prev, cluster]
              );
            }}
            className="flex items-center space-x-2"
          >
            <span>{cluster}</span>
            {selectedClusters.includes(cluster) && (
              <CheckCircle className="h-4 w-4 ml-2" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );

  // 修改资源配额说明
  const resourceDescriptions = {
    cpu: {
      label: "CPU",
      tooltip: "Maximum CPU cores allocated. 1 CPU = 1000m (millicores). For example, 2000m = 2 CPU cores"
    },
    memory: {
      label: "Memory",
      tooltip: "Maximum RAM allocated. Memory in GiB. For example, 4GiB = 4096MiB"
    },
    storage: {
      label: "Storage",
      tooltip: "Maximum storage space for persistent volumes. Storage in GiB. Local and network storage combined"
    },
    pvcs: {
      label: "PVCs",
      tooltip: "Maximum number of persistent volumes that can be created"
    },
    nodeports: {
      label: "NodePorts",
      tooltip: "Maximum number of NodePort services allowed"
    }
  };

  // 修改 renderResourceQuotas 函数中的卡片内
  const renderResourceQuotas = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        Resource Quotas
      </h3>
      <div className="grid grid-cols-4 gap-6">
        {selectedClusters.map((cluster) => (
          <Card key={cluster} className="shadow-sm bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-200/50 dark:border-gray-700/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">{cluster}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <TooltipProvider>
                {Object.entries(resourceDescriptions).map(([key, desc]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {key === 'cpu' && <Cpu className="h-4 w-4 text-gray-500" />}
                        {key === 'memory' && <MemoryStick className="h-4 w-4 text-gray-500" />}
                        {key === 'storage' && <HardDrive className="h-4 w-4 text-gray-500" />}
                        {key === 'pvcs' && <Network className="h-4 w-4 text-gray-500" />}
                        {key === 'nodeports' && <Box className="h-4 w-4 text-gray-500" />}
                        <Label className="font-medium">{desc.label}</Label>
                      </div>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{desc.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      type="number"
                      placeholder={`Enter ${desc.label.toLowerCase()}`}
                      defaultValue={clusterDefaults[cluster][key as keyof ClusterQuota]}
                      className="w-full"
                    />
                  </div>
                ))}
              </TooltipProvider>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // dryrun 相关状态
  const [isDryRunOpen, setIsDryRunOpen] = useState(false);
  const [dryRunYaml, setDryRunYaml] = useState<{ cluster: string; content: string }[]>([]);
  const formRef = useRef<HTMLDivElement>(null);

  const handleDryRun = async () => {
    const namespaceElement = document.getElementById('namespace') as HTMLInputElement;
    const namespace = namespaceElement?.value;

    // 为每个选中的集群生成 YAML
    const yamls = selectedClusters.map(cluster => ({
      cluster,
      content: mockYamlTemplate(namespace, cluster, clusterDefaults)
    }));

    setDryRunYaml(yamls);
    setIsDryRunOpen(true);

    if (formRef.current) {
      formRef.current.style.transform = 'translateX(-20%)';
      formRef.current.style.transition = 'transform 0.3s ease-in-out';
    }
  };

  const closeDryRun = () => {
    setIsDryRunOpen(false);
    if (formRef.current) {
      formRef.current.style.transform = 'translateX(0)';
    }
  };

  const [enableExternalSecret, setEnableExternalSecret] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<string>('');

  // 首先添加一个新的状态来跟踪每个环境的验证结果
  interface ValidationResult {
    environment: string;
    isValid: boolean;
    message?: string;
  }

  // 在 DeployForm 组件中添加新的状态
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  // 添加验证函数
  const validateExternalTemplate = async () => {
    if (!templateSource.value || !templateSource.targetRevision) {
      return;
    }

    setIsValidating(true);
    setValidationResults([]);

    try {
      // 这里模拟API调用，实际实现时替换为真实的API调用
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 模拟验证结果
      const results: ValidationResult[] = Object.keys(clusterDefaults).map(env => ({
        environment: env,
        isValid: Math.random() > 0.3,
        message: Math.random() > 0.3
          ? 'Template structure validated successfully'
          : 'Invalid template structure or missing required files'
      }));

      setValidationResults(results);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="flex relative w-full min-h-screen p-6">
      <div
        ref={formRef}
        className="flex space-x-6 transition-transform duration-300 ease-in-out mx-auto"
        style={{ width: isDryRunOpen ? '80%' : '100%' }}
      >
        <div className="flex flex-col space-y-6 w-full max-w-[2400px] mx-auto">
          {/* Template Selection Block */}
          <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700">
              <CardTitle className="text-xl font-semibold flex items-center space-x-3">
                <Layout className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                <span className="bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 text-transparent bg-clip-text">
                  Template Selection
                </span>
                {templateSource.value && (
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                )}
              </CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 ml-9">
                Choose a template to define your application deployment configuration
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs defaultValue="builtin" onValueChange={(value) =>
                setTemplateSource({ type: value as 'builtin' | 'external', value: '' })
              }>
                <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <TabsTrigger
                    value="builtin"
                    className="flex items-center space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <span>Built-in Templates</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{fieldDescriptions.builtinTemplate.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="external" className="flex items-center space-x-2">
                    <span>External Template</span>
                    {templateSource.type === 'external' && templateSource.value && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="builtin" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">Select Template</Label>
                      {templateSource.value && (
                        <span className="text-sm text-green-500 flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4" />
                          <span>Template selected</span>
                        </span>
                      )}
                    </div>
                    <Select
                      value={templateSource.value}
                      onValueChange={(value) =>
                        setTemplateSource({ ...templateSource, value })
                      }
                    >
                      <SelectTrigger id="builtinTemplate" className="w-full">
                        <SelectValue placeholder="Choose a built-in template" />
                      </SelectTrigger>
                      <SelectContent>
                        {kustomizations.map((kustomization) => (
                          <SelectItem key={kustomization.id} value={kustomization.name}>
                            <div className="space-y-1">
                              <div className="font-medium">{kustomization.name}</div>
                              <div className="text-sm text-gray-500">
                                Path: {kustomization.path}
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {kustomization.environments.map((env) => (
                                    <span
                                      key={env}
                                      className="px-1.5 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                                    >
                                      {env}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {templateSource.value && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-medium mb-2">Template Details</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        This template provides a standardized configuration for deploying your application.
                        It includes recommended settings for resources, scaling, and monitoring.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="external" className="space-y-4">
                  <div className="space-y-4">
                    {/* Repository URL Input */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">External Template URL</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="space-y-2 max-w-xs">
                                <p>Supported URL formats:</p>
                                <ul className="list-disc pl-4 text-sm">
                                  <li>HTTPS: https://github.com/user/repo.git</li>
                                  <li>SSH: git@github.com:user/repo.git</li>
                                </ul>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="externalTemplate"
                        placeholder="Enter template URL (e.g., https://github.com/user/repo.git)"
                        value={templateSource.value}
                        onChange={(e) =>
                          setTemplateSource({ ...templateSource, value: e.target.value })
                        }
                        className="w-full"
                      />
                    </div>

                    {/* Target Revision Input */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">Target Revision</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="space-y-2 max-w-xs">
                                <p>Supported revision formats:</p>
                                <ul className="list-disc pl-4 text-sm">
                                  <li>Branch name (e.g., main, develop)</li>
                                  <li>Commit hash (e.g., 1a2b3c4)</li>
                                  <li>Tag (e.g., v1.0.0)</li>
                                </ul>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="targetRevision"
                        placeholder="Enter target revision (branch, commit hash, or tag)"
                        value={templateSource.targetRevision}
                        onChange={(e) =>
                          setTemplateSource({ ...templateSource, targetRevision: e.target.value })
                        }
                        className="w-full"
                      />
                      {templateSource.targetRevision && (
                        <p className="text-sm text-gray-500">
                          Your template will be synced from: {templateSource.targetRevision}
                        </p>
                      )}
                    </div>

                    {/* 添加验证按钮和结果显示 */}
                    {templateSource.value && templateSource.targetRevision && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <Button
                            onClick={validateExternalTemplate}
                            disabled={isValidating}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            {isValidating ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Validating...
                              </>
                            ) : (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                Validate Template
                              </>
                            )}
                          </Button>
                          {validationResults.length > 0 && (
                            <span className="text-sm text-gray-500">
                              Validation completed for {validationResults.length} environments
                            </span>
                          )}
                        </div>

                        {/* 验证结果显示 */}
                        {validationResults.length > 0 && (
                          <div className="mt-4 space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                              Validation Results
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                              {validationResults.map((result) => (
                                <div
                                  key={result.environment}
                                  className={`p-3 rounded-lg border ${
                                    result.isValid
                                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                                      : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">{result.environment}</span>
                                    {result.isValid ? (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <XCircle className="h-4 w-4 text-red-500" />
                                    )}
                                  </div>
                                  <p className={`text-sm mt-1 ${
                                    result.isValid ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {result.message}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 现有的说明文本 */}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Enter the URL and target revision of your template repository. The platform will sync the template from the specified revision.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Separator className="my-6" />

          {/* Template Configuration Block - Update to ArgoCD Application Block */}
          <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700">
              <CardTitle className="text-xl font-semibold flex items-center space-x-3">
                <Settings2 className="h-6 w-6 text-purple-500 dark:text-purple-400" />
                <span className="bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 text-transparent bg-clip-text">
                  ArgoCD Application Instantiation
                </span>
              </CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 ml-9">
                Configure the ArgoCD Application parameters to instantiate your selected template
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="instanceName" className="text-base font-medium">
                      ArgoCD Application Name
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Provide a unique name for this template instance. This name will be used to identify your deployment.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="instanceName"
                    placeholder="Enter ArgoCD application name"
                    value={templateSource.instanceName}
                    onChange={(e) =>
                      setTemplateSource({ ...templateSource, instanceName: e.target.value })
                    }
                    className="w-full"
                  />
                  {templateSource.instanceName && (
                    <p className="text-sm text-gray-500">
                      Your template will be instantiated as: {templateSource.instanceName}
                    </p>
                  )}
                </div>

                {/* Basic Information */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Tenant Name */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="tenantName" className="text-sm font-medium">
                          {fieldDescriptions.tenantName.label}
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{fieldDescriptions.tenantName.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input id="tenantName" placeholder="Enter tenant name" className="w-full" />
                    </div>

                    {/* App Code */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="appCode" className="text-sm font-medium">
                          {fieldDescriptions.appCode.label}
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{fieldDescriptions.appCode.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="namespace" className="text-sm font-medium">
                          {fieldDescriptions.namespace.label}
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{fieldDescriptions.namespace.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input id="namespace" placeholder="Enter namespace" className="w-full" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="description" className="text-sm font-medium">
                          {fieldDescriptions.description.label}
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{fieldDescriptions.description.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Textarea id="description" placeholder="Enter description" className="w-full" />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Ingresses */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {fieldDescriptions.ingress.label}
                  </h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-2">
                          <p className="max-w-xs">{fieldDescriptions.ingress.tooltip}</p>
                          <ul className="text-sm list-disc pl-4">
                            <li>Name: {fieldDescriptions.ingress.name}</li>
                            <li>Service: {fieldDescriptions.ingress.service}</li>
                            <li>Port: {fieldDescriptions.ingress.port}</li>
                          </ul>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
                  <Button
                    variant="outline"
                    onClick={addIngress}
                    className="mt-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-200"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Ingress
                  </Button>
                </div>

                <Separator />

                {/* Environment */}
                {renderEnvironmentSection()}

                <Separator />

                {/* Resource Quotas */}
                {selectedClusters.length > 0 && renderResourceQuotas()}

                <Separator />

                {/* ExternalSecret Integration Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      ExternalSecret Integration
                    </h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Enable ExternalSecret integration to manage sensitive information securely using HashiCorp Vault
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="external-secret"
                      checked={enableExternalSecret}
                      onCheckedChange={setEnableExternalSecret}
                    />
                    <Label htmlFor="external-secret">Enable ExternalSecret</Label>
                  </div>

                  {enableExternalSecret && (
                    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="space-y-2">
                        <Label htmlFor="tenant-select">Select Tenant</Label>
                        <Select
                          value={selectedTenant}
                          onValueChange={setSelectedTenant}
                        >
                          <SelectTrigger id="tenant-select">
                            <SelectValue placeholder="Select a tenant" />
                          </SelectTrigger>
                          <SelectContent>
                            {tenants.map((tenant) => (
                              <SelectItem key={tenant.id} value={tenant.id}>
                                <div className="space-y-1">
                                  <div className="font-medium">{tenant.name}</div>
                                  <div className="text-sm text-gray-500">
                                    Secret Path: {tenant.secretPath}
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedTenant && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Selected Tenant Details</span>
                            <Badge variant="outline" className="bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                              Active
                            </Badge>
                          </div>
                          <div className="p-3 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                            {(() => {
                              const tenant = tenants.find(t => t.id === selectedTenant);
                              return (
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Name:</span>
                                    <span className="font-medium">{tenant?.name}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Secret Path:</span>
                                    <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                      {tenant?.secretPath}
                                    </span>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="my-6" />

          {/* Action Buttons Block */}
          <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-lg overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
            <CardContent className="p-6">
              <div className="flex justify-between space-x-6">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="w-full bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200"
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDryRun}
                  className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-200"
                >
                  Dry Run
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                >
                  Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <DryRun
        isOpen={isDryRunOpen}
        yamls={dryRunYaml}
        onClose={closeDryRun}
      />
      {/* Progress Bar - adjust its position when dry run is open */}
      <div
        className={`fixed transition-all duration-300 ease-in-out ${
          isDryRunOpen
            ? 'right-[47%]'
            : 'right-6'
        } top-1/2 -translate-y-1/2 h-64 flex flex-col items-center space-y-2`}
      >
        <div className="relative h-full w-4 bg-gradient-to-t from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-full overflow-hidden">
          <div
            className={`absolute bottom-0 w-full rounded-full transition-all duration-500 ${
              progress === 100
                ? 'bg-gradient-to-t from-green-500 to-green-400'
                : 'bg-gradient-to-t from-blue-600 to-blue-500'
            }`}
            style={{
              height: `${progress}%`,
              transition: 'height 0.5s ease-in-out'
            }}
          />
        </div>
        <span className={`text-sm font-medium ${
          progress === 100 ? 'text-green-500' : 'text-blue-500'
        }`}>
          {progress}%
        </span>
      </div>
    </div>
  );
}

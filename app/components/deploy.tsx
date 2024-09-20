"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type ValidationStatus = 'success' | 'error' | 'loading' | null;

interface ValidationStatuses {
  item1: ValidationStatus;
  item2: ValidationStatus;
  item3: ValidationStatus;
}

export function DeployApp() {
  const [open, setOpen] = useState(false);
  const [useVault, setUseVault] = useState(false);
  const [formData, setFormData] = useState({
    repoUrl: '',
    secretId: '',
    cpu: '1000m',
    memory: '1024M',
    storage: '0G',
    target: '',
    autoSync: false
  });
  const [validationStatus, setValidationStatus] = useState<ValidationStatuses>({
    item1: null,
    item2: null,
    item3: null
  });
  const [isValidating, setIsValidating] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setOpen(false); // 关闭对话框
  };

  const validateRepo = async () => {
    setIsValidating(true);
    setValidationStatus({ item1: 'loading', item2: 'loading', item3: 'loading' });
    await new Promise(resolve => setTimeout(resolve, 1000));
    setValidationStatus({
      item1: Math.random() > 0.5 ? 'success' : 'error',
      item2: Math.random() > 0.5 ? 'success' : 'error',
      item3: Math.random() > 0.5 ? 'success' : 'error'
    });
    setIsValidating(false);
  };

  const showValidationResults = isValidating || Object.values(validationStatus).some(status => status !== null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4"/>
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] sm:max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Deploy to H4</DialogTitle>
        </DialogHeader>
        <Card className="w-full bg-transparent border-none shadow-none">
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="repoUrl">GitHub Repo URL</Label>
                  <div className="flex items-start space-x-2">
                    <div className="flex-grow">
                      <Input
                        id="repoUrl"
                        name="repoUrl"
                        value={formData.repoUrl}
                        onChange={handleInputChange}
                        placeholder="https://github.com/user/repo"
                        className="w-full"
                        style={{ wordWrap: 'break-word' }}
                      />
                    </div>
                    <div className="flex items-start space-x-2">
                      <Button
                        type="button"
                        onClick={validateRepo}
                        disabled={!formData.repoUrl || isValidating}
                      >
                        {isValidating ? 'Validating...' : 'Validate'}
                      </Button>
                      {showValidationResults && (
                        <div className="flex flex-col space-y-1">
                          {Object.entries(validationStatus).map(([key, status]) => (
                            <div key={key} className="flex items-center">
                              {status === 'success' && (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              )}
                              {status === 'error' && (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                              {status === 'loading' && (
                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                              )}
                              <span className="ml-1 text-sm">check repo status: {key.slice(-1)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="useVault"
                    checked={useVault}
                    onCheckedChange={(checked) => setUseVault(checked as boolean)}
                  />
                  <Label htmlFor="useVault">Use Vault for secrets</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enable this to use Vault for managing application secrets</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {useVault && (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="secretId">Secret ID</Label>
                    <Select name="secretId"
                            onValueChange={(value) => handleSelectChange('secretId', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Secret ID"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="secret1">Secret 1</SelectItem>
                        <SelectItem value="secret2">Secret 2</SelectItem>
                        <SelectItem value="secret3">Secret 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="target">Deployment Target</Label>
                  <Select name="target"
                          onValueChange={(value) => handleSelectChange('target', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Target"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UAT1">UAT1</SelectItem>
                      <SelectItem value="UAT2">UAT2</SelectItem>
                    </SelectContent>
                  </Select>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Choose the environment where you want to deploy your application</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <TooltipProvider>
                  <div className="flex flex-col space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="cpu">CPU</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="right" align="start" className="max-w-xs">
                          <p>Specify the CPU allocation for the application (e.g., 1000m = 1 CPU core)</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input id="cpu" name="cpu" value={formData.cpu} onChange={handleInputChange}
                           placeholder="e.g. 1000m"/>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="memory">Memory</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="right" align="start" className="max-w-xs">
                          <p>Specify the memory allocation for the application (e.g., 1024M = 1 GB)</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input id="memory" name="memory" value={formData.memory} onChange={handleInputChange}
                           placeholder="e.g. 1024M"/>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="storage">Storage</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="right" align="start" className="max-w-xs">
                          <p>Specify the storage allocation for the application (e.g., 1Gi = 1 Gigabyte)</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input id="storage" name="storage" value={formData.storage} onChange={handleInputChange}
                           placeholder="e.g. 0G"/>
                  </div>
                </TooltipProvider>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="autoSync"
                    checked={formData.autoSync}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, autoSync: checked as boolean }))}
                  />
                  <Label htmlFor="autoSync">Enable AutoSync</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Automatically sync the application with the Git repository when changes are detected</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Deploy</Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
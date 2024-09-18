"use client"

import {useState} from 'react'
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Checkbox} from "@/components/ui/checkbox"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Button} from "@/components/ui/button"
import {CheckCircle2, XCircle} from 'lucide-react'

export default function Component() {
    const [useVault, setUseVault] = useState(false)
    const [formData, setFormData] = useState({
        repoUrl: '',
        secretId: '',
        cpu: '',
        memory: '',
        storage: ''
    })
    const [validationStatus, setValidationStatus] = useState(null)

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setFormData(prev => ({...prev, [name]: value}))
        if (name === 'repoUrl') {
            setValidationStatus(null)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Form submitted:', formData)
    }

    const validateRepo = async () => {
        // Simulating an API call
        setValidationStatus('loading')
        await new Promise(resolve => setTimeout(resolve, 1000))
        setValidationStatus(Math.random() > 0.5 ? 'success' : 'error')
    }

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Deploy to Kubernetes</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="repoUrl">GitHub Repo URL</Label>
                            <div className="flex space-x-2">
                                <Input
                                    id="repoUrl"
                                    name="repoUrl"
                                    value={formData.repoUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://github.com/user/repo"
                                />
                                <Button
                                    type="button"
                                    onClick={validateRepo}
                                    disabled={!formData.repoUrl || validationStatus === 'loading'}
                                >
                                    {validationStatus === 'loading' ? 'Validating...' : 'Validate'}
                                </Button>
                            </div>
                            {validationStatus === 'success' && (
                                <div className="flex items-center text-green-500 mt-1">
                                    <CheckCircle2 className="w-4 h-4 mr-1"/>
                                    <span>Valid repository</span>
                                </div>
                            )}
                            {validationStatus === 'error' && (
                                <div className="flex items-center text-red-500 mt-1">
                                    <XCircle className="w-4 h-4 mr-1"/>
                                    <span>Invalid repository</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="useVault" checked={useVault} onCheckedChange={setUseVault}/>
                            <Label htmlFor="useVault">Use Vault for secrets</Label>
                        </div>
                        {useVault && (
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="secretId">Secret ID</Label>
                                <Select name="secretId"
                                        onValueChange={(value) => setFormData(prev => ({...prev, secretId: value}))}>
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
                            <Label htmlFor="cpu">CPU</Label>
                            <Input id="cpu" name="cpu" value={formData.cpu} onChange={handleInputChange}
                                   placeholder="e.g. 500m"/>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="memory">Memory</Label>
                            <Input id="memory" name="memory" value={formData.memory} onChange={handleInputChange}
                                   placeholder="e.g. 512Mi"/>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="storage">Storage</Label>
                            <Input id="storage" name="storage" value={formData.storage} onChange={handleInputChange}
                                   placeholder="e.g. 1Gi"/>
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSubmit}>Deploy</Button>
            </CardFooter>
        </Card>
    )
}
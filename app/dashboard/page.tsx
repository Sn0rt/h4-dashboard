"use client"

import {useState} from 'react'
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Checkbox} from "@/components/ui/checkbox"
import {
    BarChart,
    Cloud,
    CreditCard,
    FileText,
    Lock,
    Network,
    Server,
    Settings,
    Plus,
    Trash2
} from "lucide-react"
import Link from "next/link"

const menuItems = [
    {
        title: 'Compute',
        icon: Server,
        subItems: ['Application', 'Workflow']
    },
    {
        title: 'Security',
        icon: Lock,
        subItems: ['Secret', 'Cluster Policy']
    },
    {
        title: 'Network',
        icon: Network,
        subItems: ['TODO']
    },
    {
        title: 'Bill',
        icon: CreditCard,
        subItems: []
    }
]

const applications = [
    {id: 1, name: 'App 1', uri: '/apps/1'},
    {id: 2, name: 'App 2', uri: '/apps/2'},
    {id: 3, name: 'App 3', uri: '/apps/3'},
    {id: 4, name: 'App 4', uri: '/apps/4'},
    {id: 5, name: 'App 5', uri: '/apps/5'},
]

export default function Component() {
    const [activeMenu, setActiveMenu] = useState('Compute')
    const [activeSubMenu, setActiveSubMenu] = useState('Application')
    const [selectedApps, setSelectedApps] = useState<number[]>([])

    const handleAppSelect = (appId: number) => {
        setSelectedApps(prev =>
            prev.includes(appId)
                ? prev.filter(id => id !== appId)
                : [...prev, appId]
        )
    }

    return (
        <div className="flex h-screen bg-background">
            <aside className="w-64 border-r">
                <div className="p-4 font-semibold text-lg">H4 Platform</div>
                <ScrollArea className="h-[calc(100vh-60px)]">
                    {menuItems.map((item) => (
                        <div key={item.title}>
                            <Button
                                variant={activeMenu === item.title ? "secondary" : "ghost"}
                                className="w-full justify-start"
                                onClick={() => {
                                    setActiveMenu(item.title)
                                    if (item.subItems.length > 0) {
                                        setActiveSubMenu(item.subItems[0])
                                    }
                                }}
                            >
                                <item.icon className="mr-2 h-4 w-4"/>
                                {item.title}
                            </Button>
                            {item.subItems.map((subItem) => (
                                <Button
                                    key={subItem}
                                    variant={activeSubMenu === subItem ? "secondary" : "ghost"}
                                    className="w-full justify-start pl-8"
                                    onClick={() => {
                                        setActiveMenu(item.title)
                                        setActiveSubMenu(subItem)
                                    }}
                                >
                                    {subItem}
                                </Button>
                            ))}
                        </div>
                    ))}
                </ScrollArea>
            </aside>
            <main className="flex-1 p-6 overflow-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">{activeSubMenu}</h1>
                    {activeSubMenu === 'Application' && (
                        <div className="space-x-2">
                            <Link href="/deploy" passHref>
                                <Button size="sm">
                                    <Plus className="mr-2 h-4 w-4"/>
                                    Create
                                </Button>
                            </Link>
                            <Button size="sm" variant="destructive" disabled={selectedApps.length === 0}>
                                <Trash2 className="mr-2 h-4 w-4"/>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                {activeMenu === 'Compute' && activeSubMenu === 'Application' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Applications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[300px]">
                                {applications.map((app) => (
                                    <div key={app.id} className="flex items-center space-x-2 py-2">
                                        <Checkbox
                                            checked={selectedApps.includes(app.id)}
                                            onCheckedChange={() => handleAppSelect(app.id)}
                                        />
                                        <a href={app.uri} className="flex-grow hover:underline">
                                            {app.name}
                                        </a>
                                    </div>
                                ))}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                )}
                {activeMenu === 'Bill' && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Resource Usage Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <Cloud className="mr-2 h-4 w-4"/>
                                        <span>Total Usage</span>
                                    </div>
                                    <span className="font-semibold">$1,234.56</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Detailed Billing</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[
                                        {name: 'Compute', icon: Server, amount: 450.00},
                                        {name: 'Storage', icon: FileText, amount: 200.00},
                                        {name: 'Network', icon: Network, amount: 150.00},
                                        {name: 'Security', icon: Lock, amount: 100.00},
                                    ].map((resource) => (
                                        <div key={resource.name} className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <resource.icon className="mr-2 h-4 w-4"/>
                                                <span>{resource.name}</span>
                                            </div>
                                            <span className="font-semibold">${resource.amount.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Usage Trends</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[200px] flex items-center justify-center">
                                    <BarChart className="h-16 w-16 text-muted-foreground"/>
                                    <span className="ml-4 text-muted-foreground">Usage graph placeholder</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
                {activeMenu === 'Network' && (
                    <Card>
                        <CardContent className="flex items-center justify-center h-[200px]">
                            <Settings className="h-16 w-16 text-muted-foreground"/>
                            <span className="ml-4 text-xl font-semibold text-muted-foreground">Network Configuration TODO</span>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    )
}
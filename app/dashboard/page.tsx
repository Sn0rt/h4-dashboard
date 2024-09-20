"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {  ChevronUp, ChevronRight, BarChart, Cloud, CreditCard, FileText, Lock, Network, Server, Cpu, Workflow } from "lucide-react"
import { LoggedInHeader } from "@/app/components/LoggedInHeader"
import { MenuItem } from './interfaces';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Argo } from './components/Argo';
import { NetworkMenu } from './components/Network';
import { ResourcePool } from './components/ResourcePool';
import { Security } from './components/Security';

const menuItems: MenuItem[] = [
  {
    title: 'Argo*',
    icon: Workflow,
    subItems: ['Application', 'Workflow', 'WorkflowTemplate']
  },
  {
    title: 'Security',
    icon: Lock,
    subItems: ['Secret']
  },
  {
    title: 'ResourcePool',
    icon: Cpu,
    subItems: ['Overview', 'Nodes']
  },
  {
    title: 'Network',
    icon: Network,
    subItems: ['VirtualService']
  },
  {
    title: 'Bill',
    icon: CreditCard,
    subItems: []
  }
]

export default function DashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState('Argo*')
  const [activeSubMenu, setActiveSubMenu] = useState('Application')
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Argo*']);
  const [username, setUsername] = useState('');

  const toggleMenu = (title: string) => {
    setExpandedMenus(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    const username = localStorage.getItem('username');
    if (!loggedIn) {
      router.push('/login');
    } else if (userRole === 'admin') {
      router.push('/admin');
    } else {
      setIsLoggedIn(true);
      setUsername(username || '');
    }
  }, [router]);

  if (!isLoggedIn) {
    return null; // 或者返回一个加载���示器
  }

  const renderContent = () => {
    switch (activeMenu) {
      case 'Argo*':
        return <Argo activeSubMenu={activeSubMenu} />;
      case 'Security':
        return <Security activeSubMenu={activeSubMenu} />;
      case 'ResourcePool':
        return <ResourcePool activeSubMenu={activeSubMenu} />;
      case 'Network':
        return <NetworkMenu activeSubMenu={activeSubMenu} />;
      case 'Bill':
        return renderBilling();
      default:
        return null;
    }
  };

  const renderBilling = () => {
    return (
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
              <BarChart className="h-16 w-16"/>
              <span className="ml-4">Usage graph placeholder</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <LoggedInHeader username={username} onLogout={handleLogout} userRole="user" />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-border">
          <ScrollArea className="h-[calc(100vh-60px)]">
            {menuItems.map((item) => (
              <div key={item.title}>
                <Button
                  variant={activeMenu === item.title ? "secondary" : "ghost"}
                  className="w-full justify-between hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    setActiveMenu(item.title)
                    if (item.subItems.length > 0) {
                      toggleMenu(item.title)
                      setActiveSubMenu(item.subItems[0])
                    }
                  }}
                >
                  <span className="flex items-center">
                    <item.icon className="mr-2 h-4 w-4"/>
                    {item.title}
                  </span>
                  {item.subItems.length > 0 && (
                    expandedMenus.includes(item.title) ? <ChevronUp className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
                {expandedMenus.includes(item.title) && item.subItems.map((subItem) => (
                  <Button
                    key={subItem}
                    variant={activeSubMenu === subItem ? "secondary" : "ghost"}
                    className="w-full justify-start pl-8 hover:bg-accent hover:text-accent-foreground"
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
        <main className="flex-1 p-6 overflow-auto bg-background">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
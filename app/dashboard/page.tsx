"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {  ChevronUp, ChevronRight, BarChart, Cloud, CreditCard, FileText, Lock, Network, Server, Cpu, Workflow } from "lucide-react"
import { MenuItem } from './interfaces';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Argo } from './components/Argo';
import { NetworkMenu } from './components/Network';
import { ResourcePool } from './components/ResourcePool';
import { Security } from './components/Security';
import { Breadcrumb } from "@/app/components/Breadcrumb";
import Header from '@/app/components/header'; // 导入 Header 组件

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
    return null; // 或者返回一个加载示器
  }

  const getBreadcrumbItems = () => {
    const baseBreadcrumbItems = [
      { label: 'Dashboard', href: '/dashboard' },
    ];

    switch (activeMenu) {
      case 'Argo*':
        return [
          ...baseBreadcrumbItems,
          { label: 'Argo', href: '/dashboard' },
          { label: activeSubMenu, href: '/dashboard' }
        ];
      case 'Security':
        return [
          ...baseBreadcrumbItems,
          { label: 'Security', href: '/dashboard' }
        ];
      case 'ResourcePool':
        return [
          ...baseBreadcrumbItems,
          { label: 'ResourcePool', href: '/dashboard' }
        ];
      case 'Network':
        return [
          ...baseBreadcrumbItems,
          { label: 'Network', href: '/dashboard' }
        ];
      case 'Bill':
        return [
          ...baseBreadcrumbItems,
          { label: 'Bill', href: '/dashboard' }
        ];
      default:
        return baseBreadcrumbItems;
    }
  };

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
      <Header isLoggedIn={isLoggedIn} username={username} userRole={localStorage.getItem('userRole') ?? undefined} onLogout={handleLogout} /> {/* 使用 Header 组件 */}
      <div className="px-6 py-2 border-b border-border">
        <Breadcrumb items={getBreadcrumbItems()} />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 border-r border-border bg-card">
          <ScrollArea className="h-[calc(100vh-112px)]">
            <div className="p-6">
              <nav className="space-y-4">
                {menuItems.map((item) => (
                  <div key={item.title} className="space-y-1">
                    <Button
                      variant={activeMenu === item.title ? "secondary" : "ghost"}
                      className={`w-full justify-between px-4 py-3 hover:bg-accent hover:text-accent-foreground
                        ${activeMenu === item.title ? 'bg-secondary/50 shadow-sm font-medium' : 'text-muted-foreground'}
                        rounded-lg transition-all duration-200 ease-in-out group`}
                      onClick={() => {
                        setActiveMenu(item.title)
                        if (item.subItems.length > 0) {
                          toggleMenu(item.title)
                          setActiveSubMenu(item.subItems[0])
                        }
                      }}
                    >
                      <span className="flex items-center text-sm">
                        <item.icon className={`mr-3 h-4 w-4 transition-colors
                          ${activeMenu === item.title ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}
                        />
                        {item.title}
                      </span>
                      {item.subItems.length > 0 && (
                        <span className={`transition-transform duration-200
                          ${expandedMenus.includes(item.title) ? 'rotate-180' : ''}
                          ${activeMenu === item.title ? 'text-foreground' : 'text-muted-foreground'}`}>
                          <ChevronUp className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                    {expandedMenus.includes(item.title) && (
                      <div className="ml-4 pl-4 border-l border-border/50 space-y-1">
                        {item.subItems.map((subItem) => (
                          <Button
                            key={subItem}
                            variant={activeSubMenu === subItem ? "secondary" : "ghost"}
                            className={`w-full justify-start px-4 py-2 text-sm rounded-lg
                              ${activeSubMenu === subItem
                                ? 'bg-secondary/50 text-foreground font-medium'
                                : 'text-muted-foreground hover:text-foreground'
                              }
                              transition-all duration-200 group`}
                            onClick={() => {
                              setActiveMenu(item.title)
                              setActiveSubMenu(subItem)
                            }}
                          >
                            <span className="relative flex items-center">
                              <span className="absolute -left-6 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-border
                                group-hover:bg-foreground/50 transition-colors
                                ${activeSubMenu === subItem ? 'bg-foreground' : ''}"
                              />
                              {subItem}
                            </span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </ScrollArea>
        </aside>
        <main className="flex-1 p-6 overflow-auto bg-background">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
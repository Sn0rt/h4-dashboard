"use client"

import React from 'react';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

interface LoggedInHeaderProps {
  username: string;
  onLogout: () => void;
  userRole: string;
}

export function LoggedInHeader({ username, onLogout, userRole }: LoggedInHeaderProps) {
  return (
    <header className="bg-background border-b border-border">
      <div className="w-full px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-foreground">H4 Platform</h1>
          {/* 如果需要logo，可以在这里添加 */}
          {/* <img src="/logo.png" alt="H4 Platform Logo" className="h-8 w-auto ml-2" /> */}
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-foreground">Welcome, {username} ({userRole})</span>
          <Button onClick={onLogout} variant="outline" className="hover:bg-accent hover:text-accent-foreground">Logout</Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
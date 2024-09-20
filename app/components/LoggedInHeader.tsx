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
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">H4 Platform</h1>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <span className="text-foreground">Welcome, {username} ({userRole})</span>
          <Button onClick={onLogout} variant="outline" className="hover:bg-accent hover:text-accent-foreground">Logout</Button>
        </div>
      </div>
    </header>
  );
}
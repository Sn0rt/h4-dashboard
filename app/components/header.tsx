"use client"

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Github } from "lucide-react";

interface HeaderProps {
  isLoggedIn: boolean;
  username?: string;
  userRole?: string;
  onLogout?: () => void;
}

export default function Header({ isLoggedIn, username, userRole, onLogout }: HeaderProps) {
  return (
    <header className="bg-background border-b border-border">
      <div className="w-full px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-foreground mr-4">
            <span className="bg-primary text-primary-foreground px-2 py-1 rounded-md mr-1 transition-all duration-300 hover:bg-secondary hover:text-secondary-foreground">
              H4
            </span>
            &nbsp;Platform
          </h1>
        </div>
        <nav className="flex items-center space-x-4">
          {!isLoggedIn && (
            <>
              <Button variant="ghost" size="sm">
                Docs
              </Button>
              <Button variant="ghost" size="sm">
                <Github className="mr-2 h-4 w-4"/>
                GitHub
              </Button>
              <Link href="/login" passHref>
                <Button variant="default" size="sm">
                  Login
                </Button>
              </Link>
            </>
          )}
          {isLoggedIn && (
            <>
              <span className="text-foreground">Welcome, {username} ({userRole})</span>
              <Avatar>
                <AvatarFallback>{username ? username[0].toUpperCase() : 'U'}</AvatarFallback>
              </Avatar>
              <Button onClick={onLogout} variant="outline" className="hover:bg-accent hover:text-accent-foreground">Logout</Button>
            </>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

"use client"

import React from 'react';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Github } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Clock, Building, Shield } from 'lucide-react';

interface HeaderProps {
  isLoggedIn?: boolean;
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <span className="text-sm text-foreground">Welcome, {username}</span>
                    <Avatar className="h-8 w-8 hover:ring-2 hover:ring-primary transition-all">
                      <AvatarFallback className="bg-primary/10">
                        {username ? username[0].toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{username}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        user@example.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Role: {userRole}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Clock className="mr-2 h-4 w-4" />
                      <span>Timezone: UTC+8</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Building className="mr-2 h-4 w-4" />
                      <span>Tenant: Default</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    onClick={onLogout}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ThemeToggle />
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

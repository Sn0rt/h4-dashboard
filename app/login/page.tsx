"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Mail } from "lucide-react";
import Header from "@/app/components/header";
import Image from 'next/image';
import { FakeAuthentication } from '@/app/components/login';
import Footer from '../components/footer';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isLoggedIn={false}/>
      <div className="flex flex-1">
        <div className="w-1/2 bg-muted flex items-center justify-center">
          <Image src="/logos/authlog.webp" alt="Authentication Logo" width={500} height={500} className="w-2/3 h-2/3 object-contain" />
        </div>

        <div className="w-1/2 flex items-center justify-center">
          <Card className="w-[350px] shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">
                Login to{' '}
                <span className="bg-primary text-primary-foreground px-2 py-1 rounded-md mr-1 transition-all duration-300 hover:bg-secondary hover:text-secondary-foreground">
                  H4
                </span>
                &nbsp;Platform
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FakeAuthentication />
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <Button variant="outline" className="hover:bg-accent hover:text-accent-foreground transition duration-200 ease-in-out">
                    <Github className="mr-2 h-4 w-4" />
                    Github
                  </Button>
                  <Button variant="outline" className="hover:bg-accent hover:text-accent-foreground transition duration-200 ease-in-out">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      <path d="M1 1h22v22H1z" fill="none"/>
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" className="hover:bg-accent hover:text-accent-foreground transition duration-200 ease-in-out">
                    <Mail className="mr-2 h-4 w-4" />
                    SSO
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
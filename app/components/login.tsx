"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from 'next/image';

// Hardcoded users for demonstration
const users = [
  { username: 'admin', password: 'admin', role: 'admin' },
  { username: 'user1', password: 'user1', role: 'user' },
];

export function FakeAuthentication() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('username', user.username);

      // 根据角色重定向
      if (user.role === 'admin') {
        router.push('/admin'); // 重定向到 admin 页面
      } else {
        router.push('/dashboard'); // 重定向到 dashboard 页面
      }
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium text-foreground">Username</label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="bg-background text-foreground border-border focus:border-primary focus:ring-primary"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-background text-foreground border-border focus:border-primary focus:ring-primary"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition duration-200 ease-in-out">Login</Button>
    </form>
  );
}
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Header() {
    return (
        <header className="p-4 flex justify-between items-center border-b bg-background">
            <h1 className="text-2xl font-bold text-foreground">H4 Platform</h1>
            <nav className="flex items-center space-x-4">
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
                <ThemeToggle />
            </nav>
        </header>
    )
}

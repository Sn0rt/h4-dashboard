import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Github, ArrowRight, Zap, Shield, Package} from "lucide-react"
import Link from "next/link"

export default function Component() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <header className="p-4 flex justify-between items-center border-b bg-white">
                <h1 className="text-2xl font-bold">H4 Platform</h1>
                <nav className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm">
                        Docs
                    </Button>
                    <Button variant="ghost" size="sm">
                        <Github className="mr-2 h-4 w-4"/>
                        GitHub
                    </Button>
                    <Link href="/dashboard" passHref>
                        <Button variant="default" size="sm">
                            Dashboard Login
                        </Button>
                    </Link>
                </nav>
            </header>

            <main className="flex-grow relative">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{backgroundImage: "url('/placeholder.svg?height=1080&width=1920')"}}
                ></div>
                <div className="relative z-10 container mx-auto px-4 py-12">
                    <section className="mb-12 bg-white/80 backdrop-blur-sm rounded-lg p-8">
                        <h2 className="text-3xl font-bold mb-6 text-center">Easy Deploy Your Application To H3</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {Icon: Zap, title: "Fast", description: "Quick deployment process"},
                                {Icon: Shield, title: "Secure", description: "Enhanced security measures"},
                                {Icon: Package, title: "Lightweight", description: "Minimal resource footprint"}
                            ].map((feature, index) => (
                                <Card key={index} className="bg-white/50 backdrop-blur-sm">
                                    <CardHeader>
                                        <feature.Icon className="h-8 w-8 mb-2"/>
                                        <CardTitle>{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>{feature.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    <section className="bg-white/80 backdrop-blur-sm rounded-lg p-8">
                        <h2 className="text-3xl font-bold mb-6 text-center">Platform Advantages</h2>
                        <Card className="bg-white/50 backdrop-blur-sm">
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                                {[
                                    {
                                        title: "ArgoCD & ArgoWorkflow Integration",
                                        description: "Seamless CI/CD and workflow automation"
                                    },
                                    {title: "Vault Integration", description: "Secure secret management"},
                                    {
                                        title: "Multi-tenancy Support",
                                        description: "Efficient management of multiple tenants"
                                    },
                                    {title: "One-click Helm Deployment", description: "Easy deployment of Helm charts"}
                                ].map((advantage, index) => (
                                    <div key={index} className="flex items-start space-x-3">
                                        <ArrowRight className="h-6 w-6 mt-1 flex-shrink-0"/>
                                        <div>
                                            <h3 className="font-semibold">{advantage.title}</h3>
                                            <p className="text-sm text-muted-foreground">{advantage.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </main>

            <footer className="p-4 text-center text-sm text-muted-foreground border-t bg-white">
                Built by <a href="https://twitter.com/shadcn" className="underline hover:text-foreground">shadcn</a>.
                The source code is available on <a href="https://github.com/shadcn-ui/ui"
                                                   className="underline hover:text-foreground">GitHub</a>.
            </footer>
        </div>
    )
}
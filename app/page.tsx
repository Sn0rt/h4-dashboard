import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import ParticleCube from './components/ParticleCube'
import Header from './components/header'
import Footer from './components/footer'
import { Zap, Shield, Package } from 'lucide-react'
import Image from 'next/image'

const features = [
    { Icon: Zap, title: "Fast", description: "Quick deployment process" },
    { Icon: Shield, title: "Secure", description: "Enhanced security measures" },
    { Icon: Package, title: "Lightweight", description: "Minimal resource footprint" }
];

const technologies = [
    { name: 'ArgoCD', logo: '/logos/ArgoCD.svg' },
    { name: 'Kubernetes', logo: '/logos/Kubernetes.svg' },
    { name: 'ExternalSecret', logo: '/logos/eso-logo-large.png' },
    { name: 'Vault', logo: '/logos/HashiCorpVault.svg' },
    { name: 'Argo Workflow', logo: '/logos/argo-horizontal-color.png' },
];

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex flex-col items-center justify-between p-24 relative overflow-hidden">
                <div className="w-full max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-center mb-12 text-foreground">
                        H4 Platform: A simple solution for Argo Workflows + ExternalSecret
                    </h1>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                        {/* Left side - ParticleCube */}
                        <div className="w-full md:w-1/2 aspect-square">
                            <ParticleCube />
                        </div>

                        {/* Right side - Features */}
                        <div className="w-full md:w-1/2 space-y-6">
                            {features.map((feature, index) => (
                                <Card key={index} className="bg-background/80 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="text-foreground flex items-center">
                                            <feature.Icon className="mr-2 h-6 w-6" />
                                            {feature.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-muted-foreground">
                                        {feature.description}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="w-full overflow-hidden bg-background/80 backdrop-blur-sm py-10 mt-16">
                    <div className="flex animate-scroll">
                        {[...technologies, ...technologies].map((tech, index) => (
                            <div key={index} className="flex-shrink-0 w-32 mx-8">
                                <Image
                                    src={tech.logo}
                                    alt={tech.name}
                                    width={100}
                                    height={100}
                                    priority
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
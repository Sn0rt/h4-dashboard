import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ParticleCube from './components/ParticleCube'
import Header from './components/header'
import Footer from './components/footer'
import { Zap, Shield, Package, Workflow, Database, Cloud, Lock } from 'lucide-react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"

const features = [
  {
    Icon: Workflow,
    title: "Workflow Automation",
    description: "Streamline your deployment process with automated workflows and CI/CD pipelines"
  },
  {
    Icon: Shield,
    title: "Enterprise Security",
    description: "Built-in security features with HashiCorp Vault integration and role-based access control"
  },
  {
    Icon: Database,
    title: "Configuration Management",
    description: "Centralized configuration management with GitOps practices"
  }
];

const technologies = [
  { name: 'ArgoCD', logo: '/logos/ArgoCD.svg' },
  { name: 'Kubernetes', logo: '/logos/Kubernetes.svg' },
  { name: 'ExternalSecret', logo: '/logos/eso-logo-large.png' },
  { name: 'Vault', logo: '/logos/HashiCorpVault.svg' },
  { name: 'Argo Workflow', logo: '/logos/argo-horizontal-color.png' },
];

const sections = [
  {
    title: "Secure by Default",
    description: "Built with security in mind, integrating HashiCorp Vault for secrets management and providing fine-grained access control.",
    image: "/logos/security-gopher.svg",  // 更新为 SVG 路径
    features: [
      "Vault Integration",
      "RBAC Support",
      "Audit Logging",
      "Secret Rotation"
    ]
  },
  {
    title: "GitOps Ready",
    description: "Embrace GitOps practices with our integrated ArgoCD support, making deployment and configuration management a breeze.",
    image: "/logos/gitops-gopher.svg",  // 更新为 SVG 路径
    features: [
      "ArgoCD Integration",
      "Git-based Workflows",
      "Automated Sync",
      "Drift Detection"
    ]
  },
  {
    title: "Enterprise Scale",
    description: "Built to scale with your organization, supporting multiple teams, projects, and environments.",
    image: "/logos/scale-gopher.svg",  // 更新为 SVG 路径
    features: [
      "Multi-tenant Support",
      "Resource Quotas",
      "Team Management",
      "Environment Isolation"
    ]
  }
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoggedIn={false} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-background/80 pt-24 pb-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="w-full md:w-1/2 space-y-6">
              <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                Modern Platform for Cloud Native Apps
              </h1>
              <p className="text-xl text-muted-foreground">
                H4 Platform combines ArgoCD and External Secrets to provide a seamless, secure, and scalable deployment experience.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Get Started
                </Button>
                <Button size="lg" variant="outline">
                  Documentation
                </Button>
              </div>
            </div>
            <div className="w-full md:w-1/2 aspect-square">
              <ParticleCube />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gradient-to-b from-background/80 to-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Everything you need for modern deployments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-background/80 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all duration-300">
                <CardHeader>
                  <feature.Icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  {feature.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Sections */}
      {sections.map((section, index) => (
        <section key={index} className={`py-24 ${index % 2 === 0 ? 'bg-background' : 'bg-background/80'}`}>
          <div className="container mx-auto px-4">
            <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}>
              <div className="w-full md:w-1/2 space-y-6">
                <h2 className="text-4xl font-bold">{section.title}</h2>
                <p className="text-xl text-muted-foreground">{section.description}</p>
                <ul className="space-y-4">
                  {section.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full md:w-1/2">
                <div className="relative aspect-square">
                  <Image
                    src={section.image}
                    alt={section.title}
                    width={500}
                    height={500}
                    className="object-contain"
                    priority={index === 0}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Technologies Carousel */}
      <section className="py-16 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            Powered by Industry Leading Technologies
          </h2>
          <div className="w-full overflow-hidden">
            <div className="flex animate-scroll">
              {[...technologies, ...technologies].map((tech, index) => (
                <div key={index} className="flex-shrink-0 w-32 mx-8">
                  <Image
                    src={tech.logo}
                    alt={tech.name}
                    width={100}
                    height={100}
                    className="object-contain"
                    priority={index < technologies.length}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
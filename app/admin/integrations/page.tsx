"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Database, Mail, BarChart3, Globe, Settings } from "lucide-react"

const integrations = [
  {
    name: "GitHub Repository",
    description: "Manage your code repository and deployments",
    url: "https://github.com/na8thegre8/LSS",
    icon: Github,
    status: "Connected",
  },
  {
    name: "Supabase Database",
    description: "Database and authentication management",
    url: "https://supabase.com/dashboard/project/supabase-fuchsia-door",
    icon: Database,
    status: "Connected",
  },
  {
    name: "Resend Email",
    description: "Transactional email service",
    url: "https://resend.com/dashboard",
    icon: Mail,
    status: "Connected",
  },
  {
    name: "Google Tag Manager",
    description: "Analytics and tag management",
    url: "https://tagmanager.google.com",
    icon: BarChart3,
    status: "Connected",
  },
  {
    name: "GoDaddy DNS",
    description: "Domain and DNS management",
    url: "https://dcc.godaddy.com/manage",
    icon: Globe,
    status: "Connected",
  },
  {
    name: "Vercel Deployment",
    description: "Application hosting and deployment",
    url: "https://vercel.com/dashboard",
    icon: Settings,
    status: "Connected",
  },
]

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
        <p className="text-gray-600">Manage your external service integrations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.name} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <integration.icon className="h-8 w-8 text-blue-600" />
                <span className="text-sm text-green-600 font-medium">{integration.status}</span>
              </div>
              <CardTitle className="text-lg">{integration.name}</CardTitle>
              <CardDescription>{integration.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => window.open(integration.url, "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Dashboard
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
          <CardDescription>Overview of all connected services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-800">All Systems Operational</p>
                <p className="text-sm text-green-600">All integrations are working properly</p>
              </div>
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

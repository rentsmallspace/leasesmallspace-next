"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, Settings, TestTube } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      title: "View All Leads",
      description: "Manage and export leads",
      href: "/admin/leads",
      icon: Users,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Add Admin User",
      description: "Create new admin account",
      href: "/admin/users/new",
      icon: UserPlus,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Test Emails",
      description: "Test email integration",
      href: "/admin/email-test",
      icon: TestTube,
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Settings",
      description: "Configure admin settings",
      href: "/admin/settings",
      icon: Settings,
      color: "bg-gray-500 hover:bg-gray-600",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-shadow bg-transparent"
              >
                <div className={`p-2 rounded-full text-white ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-gray-500">{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Mail, TrendingUp, Clock } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Metrics {
  totalLeads: number
  totalUsers: number
  recentLeads: number
  conversionRate: string
}

export function DashboardMetrics() {
  const [metrics, setMetrics] = useState<Metrics>({
    totalLeads: 0,
    totalUsers: 0,
    recentLeads: 0,
    conversionRate: "0%",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMetrics() {
      try {
        // Get total leads from inquiries table
        const { count: totalLeads } = await supabase.from("inquiries").select("*", { count: "exact", head: true })

        // Get total users
        const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true })

        // Get recent leads (last 24 hours)
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)

        const { count: recentLeads } = await supabase
          .from("inquiries")
          .select("*", { count: "exact", head: true })
          .gte("created_at", yesterday.toISOString())

        // Calculate conversion rate (mock calculation)
        const conversionRate = totalLeads && totalUsers ? ((totalUsers / totalLeads) * 100).toFixed(1) + "%" : "0%"

        setMetrics({
          totalLeads: totalLeads || 0,
          totalUsers: totalUsers || 0,
          recentLeads: recentLeads || 0,
          conversionRate,
        })
      } catch (error) {
        console.error("Error fetching metrics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  const metricCards = [
    {
      title: "Total Leads",
      value: metrics.totalLeads,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Users",
      value: metrics.totalUsers,
      icon: Mail,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Recent Leads (24h)",
      value: metrics.recentLeads,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Conversion Rate",
      value: metrics.conversionRate,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
            <div className={`p-2 rounded-full ${metric.bgColor}`}>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

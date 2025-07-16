"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Mail, TrendingUp, Clock, Eye } from "lucide-react"

interface DashboardStats {
  totalLeads: number
  totalUsers: number
  recentLeads: number
  totalInquiries: number
}

interface RecentLead {
  id: string
  name: string
  email: string
  created_at: string
  source: string
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    totalUsers: 0,
    recentLeads: 0,
    totalInquiries: 0,
  })
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch leads count
      const { count: leadsCount } = await supabase.from("leads").select("*", { count: "exact", head: true })

      // Fetch users count
      const { count: usersCount } = await supabase.from("users").select("*", { count: "exact", head: true })

      // Fetch inquiries count
      const { count: inquiriesCount } = await supabase.from("inquiries").select("*", { count: "exact", head: true })

      // Fetch recent leads (last 24 hours)
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      const { data: recentLeadsData, count: recentCount } = await supabase
        .from("leads")
        .select("*", { count: "exact" })
        .gte("created_at", yesterday.toISOString())
        .order("created_at", { ascending: false })
        .limit(5)

      setStats({
        totalLeads: leadsCount || 0,
        totalUsers: usersCount || 0,
        recentLeads: recentCount || 0,
        totalInquiries: inquiriesCount || 0,
      })

      setRecentLeads(
        recentLeadsData?.map((lead) => ({
          id: lead.id,
          name: lead.name,
          email: lead.email,
          created_at: lead.created_at,
          source: lead.source || "Direct",
        })) || [],
      )
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your LeaseSmallSpace admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <p className="text-xs text-muted-foreground">All time leads captured</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Leads</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentLeads}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInquiries}</div>
            <p className="text-xs text-muted-foreground">Property inquiries</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
            <CardDescription>Latest lead submissions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentLeads.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent leads</p>
            ) : (
              <div className="space-y-4">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-sm text-gray-600">{lead.email}</p>
                      <p className="text-xs text-gray-500">{lead.source}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{new Date(lead.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
              <a href="/admin/leads">
                <Eye className="mr-2 h-4 w-4" />
                View All Leads
              </a>
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
              <a href="/admin/email-test">
                <Mail className="mr-2 h-4 w-4" />
                Test Email System
              </a>
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
              <a href="/admin/users/new">
                <Users className="mr-2 h-4 w-4" />
                Add Admin User
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

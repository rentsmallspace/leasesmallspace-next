"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Eye } from "lucide-react"
import { format } from "date-fns"

interface Lead {
  id: string
  contact_info: {
    name: string
    email: string
    phone?: string
  }
  space_type: string
  location: string
  budget: string
  created_at: string
}

export function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      // Pull raw rows from the correct table
      const { data, error } = await supabase
        .from("questionnaire_responses") // ✅ correct table name
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      // Normalise shape so the rest of the component works unchanged
      const normalised = (data || []).map((row: any) => {
        const responses = row.responses || {} // JSON column with answers
        return {
          id: row.id,
          contact_info: responses.contact_info ?? {
            name: responses.name ?? "Anonymous",
            email: responses.email ?? "N/A",
            phone: responses.phone ?? "",
          },
          space_type: responses.space_type ?? "N/A",
          location: responses.location ?? "N/A",
          budget: responses.budget ?? "N/A",
          created_at: row.created_at,
        } as Lead
      })

      setLeads(normalised)
    } catch (err) {
      console.error("Error fetching leads:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredLeads = leads.filter(
    (lead) =>
      lead.contact_info?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contact_info?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.space_type?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const exportToCSV = () => {
    const csvContent = [
      ["Name", "Email", "Phone", "Space Type", "Location", "Budget", "Date"],
      ...filteredLeads.map((lead) => [
        lead.contact_info?.name || "",
        lead.contact_info?.email || "",
        lead.contact_info?.phone || "",
        lead.space_type || "",
        lead.location || "",
        lead.budget || "",
        format(new Date(lead.created_at), "yyyy-MM-dd HH:mm"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `leads-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return <div>Loading leads...</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>All Leads ({filteredLeads.length})</CardTitle>
          <Button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">Email</th>
                <th className="text-left p-4 font-medium">Space Type</th>
                <th className="text-left p-4 font-medium">Location</th>
                <th className="text-left p-4 font-medium">Budget</th>
                <th className="text-left p-4 font-medium">Date</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{lead.contact_info?.name || "N/A"}</div>
                      {lead.contact_info?.phone && (
                        <div className="text-sm text-gray-500">{lead.contact_info.phone}</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">{lead.contact_info?.email || "N/A"}</td>
                  <td className="p-4">
                    <Badge variant="secondary">{lead.space_type || "N/A"}</Badge>
                  </td>
                  <td className="p-4">{lead.location || "N/A"}</td>
                  <td className="p-4">{lead.budget || "N/A"}</td>
                  <td className="p-4">{format(new Date(lead.created_at), "MMM dd, yyyy")}</td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLeads.length === 0 && (
            <div className="text-center py-8 text-gray-500">No leads found matching your search.</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

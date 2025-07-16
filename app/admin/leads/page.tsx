"use client"

import { Suspense } from "react"
import { LeadsTable } from "@/components/admin/leads-table"

export default function AdminLeadsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Leads Management</h1>
        <p className="text-gray-600">View and manage all leads and questionnaire submissions</p>
      </div>

      <Suspense fallback={<div>Loading leads...</div>}>
        <LeadsTable />
      </Suspense>
    </div>
  )
}

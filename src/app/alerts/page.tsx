"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertList } from '~/components/alert-list'
import { AlertDetails } from '~/components/alert-details'
import { GrafanaPanel } from '~/components/grafana-panel'
import { Sidebar } from '~/components/sidebar'
import { Alert } from '~/types'

export default function AlertsPage() {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900">
        <div className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-semibold text-gray-100 mb-6">Alerts</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Active Alerts</h2>
                <AlertList onSelectAlert={setSelectedAlert} />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Alert Details</h2>
                {selectedAlert ? (
                  <AlertDetails alert={selectedAlert} />
                ) : (
                  <p className="text-gray-400">Select an alert to view details</p>
                )}
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Alert Timeline</h2>
              <GrafanaPanel />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

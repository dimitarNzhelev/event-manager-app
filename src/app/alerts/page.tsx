"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertList } from '~/components/alert-list'
import { AlertDetails } from '~/components/alert-details'
import { Sidebar } from '~/components/sidebar'
import { Alert } from '~/types'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

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
            <motion.div 
              className="mt-12 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Link 
                href="http://grafana.dzhelev.itgix.eu/d/fe4lbp0qww6bke?kiosk&refresh=5s"
                target='_blank'
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200 group"
              >
                <span className="mr-2">Alert Timeline Dashboard</span>
                <ExternalLink className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}


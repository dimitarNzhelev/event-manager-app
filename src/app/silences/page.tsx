"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sidebar } from '~/components/sidebar'
import type { Silence } from '~/types'
import { SilenceDetails } from '~/components/silnce-details'
import { SilenceList } from '~/components/silence-list'

export default function SilencePage() {
  const [selectedSilence, setSelectedSilence] = useState<Silence | null>(null)
  const [refresh, setRefresh] = useState<boolean>(false)

  useEffect(() => {
    setSelectedSilence(null)
  }, [refresh])

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
            <h1 className="text-3xl font-semibold text-gray-100 mb-6">Silences</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <SilenceList onSelectSilence={setSelectedSilence} refresh={refresh} />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Silence Details</h2>
                {selectedSilence ? (
                  <SilenceDetails silence={selectedSilence} setRefresh={setRefresh} refresh={refresh} />
                ) : (
                  <p className="text-gray-400">Select a silence to view details</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}


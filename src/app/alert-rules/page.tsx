"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sidebar } from '~/components/sidebar'
import { AlertRulesList } from '~/components/alert-rules-list'
import { AlertRuleDetails } from '~/components/alert-rule-details'
import { AlertRule, AlertRuleGroup } from '~/types'

export default function AlertRulesPage() {
  const [selectedRule, setSelectedRule] = useState<AlertRule | null>(null)
  const [alertRuleGroups, setAlertRuleGroups] = useState<AlertRuleGroup[]>([])

  useEffect(() => {
    async function fetchAlertRuleGroups() {
      const response = await fetch('/api/alerts/rules')
      const data = await response.json()
      setAlertRuleGroups(data)
    }
    fetchAlertRuleGroups()
  }, [])

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
            <h1 className="text-3xl font-semibold text-gray-100 mb-6">Alert Rules</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Rules List</h2>
                <AlertRulesList ruleGroups={alertRuleGroups} onSelectRule={setSelectedRule} />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Rule Details</h2>
                {selectedRule ? (
                  <AlertRuleDetails rule={selectedRule} />
                ) : (
                  <p className="text-gray-400">Select a rule to view details</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}


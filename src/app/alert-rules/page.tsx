"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sidebar } from '~/components/sidebar'
import { AlertRulesList } from '~/components/alert-rules-list'
import { AlertRuleDetails } from '~/components/alert-rule-details'
import { CreateAlertRuleForm } from '~/components/create-alert-rule-form'
import { NamespaceSelector } from '~/components/namespace-selector'
import { AlertRule } from '~/types'
import { getAlertRules } from '../actions'

export default function AlertRulesPage() {
  const [selectedRule, setSelectedRule] = useState<AlertRule | null>(null)
  const [rules, setRules] = useState<AlertRule[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedNamespace, setSelectedNamespace] = useState<string>("monitoring")


  const fetchRules = async () => {
    const data = await getAlertRules(selectedNamespace)
    setRules(data)
  }
  useEffect(() => {
    fetchRules()
  }, [selectedNamespace])

  const handleNamespaceChange = (namespace: string) => {
    setSelectedNamespace(namespace)
    setSelectedRule(null)
  }

  const handleRuleDelete = () => {
    setSelectedRule(null)
    fetchRules()
  }


  const handleRuleUpdate = (updatedRule: AlertRule) => {
    setSelectedRule(updatedRule)
    fetchRules()
    location.reload()
  }

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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold text-gray-100">Alert Rules</h1>
              <NamespaceSelector onNamespaceChange={handleNamespaceChange} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Rules List</h2>
                <AlertRulesList rules={rules} onSelectRule={setSelectedRule} />
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  {showCreateForm ? 'Hide Create Form' : 'Create New Alert Rule'}
                </button>
              </div>
              <div>
                {showCreateForm ? (
                  <CreateAlertRuleForm />
                ) : selectedRule ? (
                  <AlertRuleDetails rule={selectedRule} onDelete={handleRuleDelete} onUpdate={handleRuleUpdate} namespace={selectedNamespace} />
                ) : (
                  <p className="text-gray-400">Select a rule to view details or create a new one</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}


"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from "~/components/ui/input"
import { AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { AlertRule, AlertRulesListProps } from '~/types'
import { formatRuleName } from '~/lib/utils'


const severityIcons = {
  critical: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const severityColors = {
  critical: "bg-red-700",
  warning: "bg-yellow-600",
  info: "bg-blue-600",
}



export function AlertRulesList({ rules, onSelectRule }: AlertRulesListProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredRules = rules.filter((rule: AlertRule) => {
    return rule.alert?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.labels?.severity?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Search rules..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-gray-800 text-gray-100 border-gray-700"
      />
      <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto pr-4">
        {filteredRules.map((rule, index) => {
          const Icon = severityIcons[rule.labels?.severity as keyof typeof severityIcons] || Info
          return (
            <motion.div
            key={`${rule.alert}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`${severityColors[rule.labels?.severity as keyof typeof severityColors] || 'bg-blue-600'} rounded-lg shadow-xl p-4 cursor-pointer`}
            onClick={() => onSelectRule(rule)}
          >
            <div className="flex items-center">
              <Icon className="w-6 h-6 text-white mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-white break-words">{formatRuleName(rule.alert ?? "Unknown")}</h3>
                <p className="text-white text-opacity-90">{rule.labels?.severity}</p>
              </div>
            </div>
          </motion.div>
          )
        })}
      </div>
    </div>
  )
}


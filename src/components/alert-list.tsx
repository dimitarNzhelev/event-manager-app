"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { Alert } from '~/types'
import { getAlerts } from '~/app/actions'
interface AlertListProps {
  onSelectAlert: (alert: Alert) => void
}

const severityIcons = {
  critical: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const severityColors = {
  critical: "bg-red-900",
  warning: "bg-yellow-500",
  info: "bg-blue-700",
}

export function AlertList({ onSelectAlert }: AlertListProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    const fetchAlerts = async () => {
      const data = await getAlerts();
      setAlerts(data)
    }

    fetchAlerts()
  }, [])

  return (
    <div className="space-y-4">
      {alerts.map((alert, index) => {
        const Icon = severityIcons[alert.labels.severity as keyof typeof severityIcons] || Info
        return (
          <motion.div
            key={alert.fingerprint}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${severityColors[alert.labels.severity as keyof typeof severityColors] || 'bg-blue-500'} rounded-lg shadow-xl p-4 cursor-pointer`}
            onClick={() => onSelectAlert(alert)}
          >
            <div className="flex items-center">
              <Icon className="w-6 h-6 text-white mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-white">{alert.labels.alertname}</h3>
                <p className="text-white text-opacity-90">{typeof alert.annotations == 'string' ? alert.annotations : alert.annotations.summary}</p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}


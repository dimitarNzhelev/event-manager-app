"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, AlertTriangle, Info } from 'lucide-react'
import type { AlertPrometheus } from '~/types'
import { getAlerts, getSilencedAlerts } from '~/app/actions'
import { useToast } from '~/hooks/use-toast'
interface AlertListProps {
  onSelectAlert: (alert: AlertPrometheus) => void
  forSilence: boolean
  refresh: boolean
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

export function AlertListPrometheus({ onSelectAlert, forSilence, refresh }: AlertListProps) {
  const [alerts, setAlerts] = useState<AlertPrometheus[]>([])
  const { toast } = useToast()
  useEffect(() => {
    const fetchAlerts = async () => {
    try {
      if (forSilence === false) {
        const data = await getAlerts()
        setAlerts(data)
      } else {
        const data = await getSilencedAlerts()
        setAlerts(data)
      }
    } catch (error) {
      toast({ title: error instanceof Error ? error.message : 'Failed to fetch alerts' })
    }
  }

    fetchAlerts()

    const intervalId = setInterval(() => {
      fetchAlerts().catch(error => console.error('Error fetching alerts:', error))
    }, 60000)

    return () => clearInterval(intervalId)
  }, [refresh])

  return (
    <div className="space-y-4">
      {alerts?.map((alert, index) => {
        const Icon = severityIcons[alert.labels.severity as keyof typeof severityIcons] || Info
        return (
          <motion.div
            key={alert.labels.alertname}
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
      {!alerts && <div className="text-white">No alerts found</div>}
    </div>
  )
}


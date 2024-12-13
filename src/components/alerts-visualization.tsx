"use client"

import { useState, useEffect } from "react"
import { AlertComp, AlertDescription, AlertTitle } from "~/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { Alert } from "~/types"
import { getAlerts } from "~/app/actions"


export function AlertsVisualization() {
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    // In a real application, you would fetch this data from your alerting system
    const fetchAlerts = async () => {
      const data = await getAlerts();
      console.log(data);
      setAlerts(data)
    }

    fetchAlerts()
  }, [])

  return (
    <div className="space-y-4">
      {alerts.map((alert, index) => (
        <motion.div
          key={alert.fingerprint}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <AlertComp variant="destructive" className="border-gray-700 bg-black">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-gray-100">{alert.alert_name}</AlertTitle>
            <AlertDescription className="text-gray-300">
              {typeof alert.annotations === 'string' ? alert.annotations : alert.annotations.summary ?? 'No summary available'}
            </AlertDescription>
          </AlertComp>
        </motion.div>
      ))}
    </div>
  )
}


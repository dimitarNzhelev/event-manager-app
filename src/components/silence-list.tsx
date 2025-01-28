"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, AlertTriangle, Info } from 'lucide-react'
import type { Alert, Silence } from '~/types'
import { getAllAlerts, getSilences } from '~/app/actions'
interface SilenceListProps {
  onSelectSilence: (silence: Silence) => void
  refresh: boolean
}

const severityIcons = {
   firing: AlertCircle,
   pending: AlertTriangle,
   expired: Info,
}

const severityColors = {
  firing: "bg-red-900",
  pending: "bg-yellow-500",
  expired: "bg-blue-700",
}

export function SilenceList({ onSelectSilence, refresh }: SilenceListProps) {
  const [silences, setSilences] = useState<Silence[]>([])

  useEffect(() => {
    const fetchSilences = async () => {
      try {
        const data = await getSilences(); // Replace with your API call
        setSilences(data);
      } catch (error) {
        console.error("Error fetching silences:", error);
      }
    };

    fetchSilences();

    const intervalId = setInterval(fetchSilences, 60000); // 60000ms = 1 minute

    return () => clearInterval(intervalId);
  }, [refresh]);

  return (
    <div className="space-y-4">
      {silences && silences.map((silence, index) => {
        const Icon = severityIcons[silence.status.state as keyof typeof severityIcons] || Info
        return (
          <motion.div
            key={silence.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${severityColors[silence.status.state as keyof typeof severityColors] || 'bg-blue-500'} rounded-lg shadow-xl p-4 cursor-pointer`}
            onClick={() => onSelectSilence(silence)}
          >
            <div className="flex items-center">
              <Icon className="w-6 h-6 text-white mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-white">{silence.id}</h3>
                <p className="text-white text-opacity-90">{silence.comment}</p>
              </div>
            </div>
          </motion.div>
        )
      })}
        {!silences && <div className="text-white">No silences found</div>}
    </div>
  )
}


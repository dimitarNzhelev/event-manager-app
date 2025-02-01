import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "~/components/ui/button"
import { BellOff } from "lucide-react"
import { SilenceModal } from "./silence-modal"
import type { AlertPrometheus } from "~/types"
import { processAlertForSilence, unSilenceAlert } from "~/app/actions"

interface AlertDetailsProps {
  alert: AlertPrometheus
  silenced: boolean
  setRefresh: (refresh: boolean) => void
  refresh: boolean
}

export function AlertDetailsPrometheus({ alert, silenced, refresh, setRefresh}: AlertDetailsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSilenceSubmit = (startDate: string, endDate: string) => {
    processAlertForSilence(alert, startDate, endDate);
    setIsModalOpen(false)
    setRefresh(!refresh)
  }

  const handleUnsilence = async () => {
    await unSilenceAlert(alert);
    setRefresh(!refresh)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 rounded-lg shadow-xl p-6"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-semibold text-white">{alert.labels.alertname}</h3>
        {silenced == false && (
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="outline"
          className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600 hover:border-gray-500"
        >
          <BellOff className="mr-2 h-4 w-4" />
          Silence Alert
        </Button>
        )}
         {silenced == true && (
        <Button
          onClick={handleUnsilence}
          variant="outline"
          className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600 hover:border-gray-500"
        >
          <BellOff className="mr-2 h-4 w-4" />
          Unsilence Alert
        </Button>
        )}
      </div>
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-300">Labels</h4>
          <ul className="list-disc list-inside text-gray-400">
            {Object.entries(alert.labels).map(([key, value]) => (
              <li key={key}>
                <span className="font-semibold">{key}:</span> {value}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-300">Annotations</h4>
          {typeof alert.annotations === "string" ? (
            <p className="text-gray-400">{alert.annotations}</p>
          ) : (
            <ul className="list-disc list-inside text-gray-400">
              {Object.entries(alert.annotations).map(([key, value]) => (
                <li key={key}>
                  <span className="font-semibold">{key}:</span> {value}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-300">Timing</h4>
          <p className="text-gray-400">
            <span className="font-semibold">Active at:</span> {new Date(alert.activeAt).toLocaleString()}
          </p>
        </div>
      </div>
      <SilenceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSilenceSubmit} />
    </motion.div>
  )
}


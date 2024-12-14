import { motion } from 'framer-motion'
import type { Alert } from '~/types'

interface AlertDetailsProps {
  alert: Alert
}

export function AlertDetails({ alert }: AlertDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 rounded-lg shadow-xl p-6"
    >
      <h3 className="text-2xl font-semibold text-white mb-4">{alert.labels.alertname}</h3>
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
          {typeof alert.annotations === 'string' ? (
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
            <span className="font-semibold">Start:</span> {new Date(alert.start_time).toLocaleString()}
          </p>
          {alert.end_time && (
            <p className="text-gray-400">
              <span className="font-semibold">End:</span> {new Date(alert.end_time).toLocaleString()}
            </p>
          )}
        </div>
        {alert.generatorURL && (
          <div>
            <h4 className="text-lg font-semibold text-gray-300">Generator URL</h4>
            <a
              href={alert.generatorURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              {alert.generatorURL}
            </a>
          </div>
        )}
      </div>
    </motion.div>
  )
}


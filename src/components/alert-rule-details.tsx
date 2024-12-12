import { motion } from 'framer-motion'
import { AlertRule } from '~/types'
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { formatRuleName } from '~/lib/utils'

interface AlertRuleDetailsProps {
  rule: AlertRule
}

export function AlertRuleDetails({ rule }: AlertRuleDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-white">{formatRuleName(rule.name)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-gray-300">Query</h4>
            <pre className="bg-gray-900 p-2 rounded-md text-sm text-gray-300 overflow-x-auto">
              {rule.query}
            </pre>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-300">Labels</h4>
            <ul className="list-disc list-inside text-gray-400">
              {Object.entries(rule.labels).map(([key, value]) => (
                <li key={key}>
                  <span className="font-semibold">{key}:</span> {value}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-300">Duration</h4>
            <p className="text-gray-400">{rule.duration} seconds</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-300">State</h4>
            <p className="text-gray-400">{rule.state}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}


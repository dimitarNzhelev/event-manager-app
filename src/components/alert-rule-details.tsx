import { motion } from 'framer-motion'
import { AlertRule } from '~/types'
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { formatRuleName } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { Trash2, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { deleteRule } from '~/app/actions'

interface AlertRuleDetailsProps {
  rule: AlertRule
  onDelete: () => void
  namespace: string
}

export function AlertRuleDetails({ rule, onDelete, namespace }: AlertRuleDetailsProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)
    try {
      await deleteRule(rule.id, namespace)
      onDelete()
    } catch (err) {
      console.error('Failed to delete rule:', err)
      setError('Failed to delete rule. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-semibold text-white">{formatRuleName(rule.alert ?? "Unknown")}</CardTitle>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Deleting...' : <Trash2 className="h-4 w-4" />}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-gray-300">Query</h4>
            <pre className="bg-gray-900 p-2 rounded-md text-sm text-gray-300 overflow-x-auto">
              {rule.expr}
            </pre>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-300">Labels</h4>
            <ul className="list-disc list-inside text-gray-400">
              {rule.labels && Object.entries(rule.labels).map(([key, value]) => (
                <li key={key}>
                  <span className="font-semibold">{key}:</span> {value}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-300">For</h4>
            <p className="text-gray-400">{rule.for}</p>
          </div>
          <div>
            {rule.annotations && <h4 className="text-lg font-semibold text-gray-300">Annotations</h4>}
            {rule.annotations && Object.entries(rule.annotations).map(([key, value]) => (
              <div key={key}>
                <h4 className="text-md font-semibold text-gray-300">{key}</h4>
                <p className="text-sm text-gray-400">{value}</p>
              </div>
            ))}
          </div>
          {error && (
            <div className="flex items-center space-x-2 text-red-500">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}


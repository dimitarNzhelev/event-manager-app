"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { createAlertRule } from '../app/actions'

export function CreateAlertRuleForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const namespace = formData.get('namespace') as string
    const alertName = formData.get('alertName') as string
    const expression = formData.get('expression') as string
    const duration = formData.get('duration') as string
    const severity = formData.get('severity') as string
    const summary = formData.get('summary') as string
    const description = formData.get('description') as string

    try {
      await createAlertRule({
        alertName,
        namespace,
        expression,
        duration,
        severity,
        summary,
        description
      })
      location.reload()
    } catch (error) {
      console.error('Failed to create alert rule:', error)
      setError('Failed to create alert rule. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-white">Create New Alert Rule</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="alertName" className="text-sm font-medium text-gray-300">Alert Name</Label>
              <Input id="alertName" name="alertName" required className="mt-1 bg-gray-700 text-white border-gray-600" />
            </div>
            <div>
              <Label htmlFor="namespace" className="text-sm font-medium text-gray-300">Namespace</Label>
              <Input id="namespace" name="namespace" required className="mt-1 bg-gray-700 text-white border-gray-600" />
            </div>
            <div>
              <Label htmlFor="expression" className="text-sm font-medium text-gray-300">Expression</Label>
              <Input id="expression" name="expression" required className="mt-1 bg-gray-700 text-white border-gray-600" />
            </div>
            <div>
              <Label htmlFor="duration" className="text-sm font-medium text-gray-300">Duration (e.g., 5m)</Label>
              <Input id="duration" name="duration" required className="mt-1 bg-gray-700 text-white border-gray-600" />
            </div>
            <div>
              <Label htmlFor="severity" className="text-sm font-medium text-gray-300">Severity</Label>
              <Input id="severity" name="severity" required className="mt-1 bg-gray-700 text-white border-gray-600" />
            </div>
            <div>
              <Label htmlFor="summary" className="text-sm font-medium text-gray-300">Summary</Label>
              <Input id="summary" name="summary" required className="mt-1 bg-gray-700 text-white border-gray-600" />
            </div>
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-300">Description</Label>
              <Textarea id="description" name="description" required className="mt-1 bg-gray-700 text-white border-gray-600" />
            </div>
            {error && (
              <div className="flex items-center space-x-2 text-red-500">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              {isLoading ? 'Creating...' : 'Create Alert Rule'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}


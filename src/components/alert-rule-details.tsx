import { motion } from 'framer-motion'
import type { AlertRule } from '~/types'
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { formatRuleName } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { Trash2, AlertCircle, Save, Edit2, X, Plus } from 'lucide-react'
import { useState } from 'react'
import { deleteRule, updateRule } from '~/app/actions'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

interface AlertRuleDetailsProps {
  rule: AlertRule
  onDelete: () => void
  onUpdate: (rule: AlertRule) => void
  namespace: string
}

export function AlertRuleDetails({ rule, onDelete, onUpdate, namespace }: AlertRuleDetailsProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedRule, setEditedRule] = useState<AlertRule>(rule)
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

  const handleEdit = () => {
    setIsEditing(true)
    setEditedRule(rule)
  }

  const handleSave = async () => {
    setError(null)
    try {
      await updateRule({
        id: rule.id,
        namespace,
        updatedRule: { ...editedRule, resourceVersion: rule.resourceVersion } // Update this line
      })
      onUpdate(editedRule)
      setIsEditing(false)
    } catch (err) {
      console.error('Failed to update rule:', err)
      setError('Failed to update rule. Please try again.')
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedRule(rule)
  }

  const handleInputChange = (field: keyof AlertRule, value: string) => {
    setEditedRule(prev => ({ ...prev, [field]: value }))
  }

  const handleLabelChange = (index: number, key: string, value: string) => {
    setEditedRule(prev => {
      const newLabels = { ...prev.labels }
      const oldKey = Object.keys(newLabels)[index]
      
      if (oldKey !== undefined) {
        delete newLabels[oldKey]
      }
      newLabels[key] = value
      return { ...prev, labels: { ...newLabels, severity: newLabels.severity ??'' } }
    })
  }

  const handleAnnotationChange = (index: number, key: string, value: string) => {
    setEditedRule(prev => {
      const newAnnotations = { ...prev.annotations }
      const oldKey = Object.keys(newAnnotations)[index]
      if (oldKey !== undefined) {
        delete newAnnotations[oldKey]
      }
      newAnnotations[key] = value
      return { ...prev, annotations: newAnnotations }
    })
  }

  const addNewLabel = () => {
    setEditedRule(prev => ({
      ...prev,
      labels: { ...prev.labels, '': '', severity: prev.labels?.severity ?? '' }
    }))
  }

  const addNewAnnotation = () => {
    setEditedRule(prev => ({
      ...prev,
      annotations: { ...prev.annotations, '': '' }
    }))
  }

  return (
    <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-semibold text-white">
          {isEditing ? (
            <Input
              value={editedRule.alert}
              onChange={(e) => handleInputChange('alert', e.target.value)}
              className="bg-gray-700 text-white border-gray-600"
            />
          ) : (
            formatRuleName(rule.alert ?? "Unknown")
          )}
        </CardTitle>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="text-green-500 hover:text-green-400"
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-red-500 hover:text-red-400"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="text-blue-500 hover:text-blue-400"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? 'Deleting...' : <Trash2 className="h-4 w-4" />}
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-300">Query</h4>
          {isEditing ? (
            <Textarea
              value={editedRule.expr}
              onChange={(e) => handleInputChange('expr', e.target.value)}
              className="bg-gray-700 text-white border-gray-600"
            />
          ) : (
            <pre className="bg-gray-900 p-2 rounded-md text-sm text-gray-300 overflow-x-auto">
              {rule.expr}
            </pre>
          )}
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-300">Labels</h4>
          {isEditing ? (
            <div className="space-y-2">
              {Object.entries(editedRule.labels ?? {}).map(([key, value], index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    value={key}
                    onChange={(e) => handleLabelChange(index, e.target.value, value)}
                    className="bg-gray-700 text-white border-gray-600 w-1/3"
                  />
                  <Input
                    value={value}
                    onChange={(e) => handleLabelChange(index, key, e.target.value)}
                    className="bg-gray-700 text-white border-gray-600 w-2/3"
                  />
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addNewLabel}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Label
              </Button>
            </div>
          ) : (
            <ul className="list-disc list-inside text-gray-400">
              {rule.labels && Object.entries(rule.labels).map(([key, value]) => (
                <li key={key}>
                  <span className="font-semibold">{key}:</span> {value}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-300">For</h4>
          {isEditing ? (
            <Input
              value={editedRule.for}
              onChange={(e) => handleInputChange('for', e.target.value)}
              className="bg-gray-700 text-white border-gray-600"
            />
          ) : (
            <p className="text-gray-400">{rule.for}</p>
          )}
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-300">Annotations</h4>
          {isEditing ? (
            <div className="space-y-2">
              {Object.entries(editedRule.annotations ?? {}).map(([key, value], index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    value={key}
                    onChange={(e) => handleAnnotationChange(index, e.target.value, value)}
                    className="bg-gray-700 text-white border-gray-600 w-1/3"
                  />
                  <Input
                    value={value}
                    onChange={(e) => handleAnnotationChange(index, key, e.target.value)}
                    className="bg-gray-700 text-white border-gray-600 w-2/3"
                  />
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addNewAnnotation}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Annotation
              </Button>
            </div>
          ) : (
            rule.annotations && Object.entries(rule.annotations).map(([key, value]) => (
              <div key={key}>
                <h4 className="text-md font-semibold text-gray-300">{key}</h4>
                <p className="text-sm text-gray-400">{value}</p>
              </div>
            ))
          )}
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

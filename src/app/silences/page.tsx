"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "~/components/sidebar"
import type { Silence } from "~/types"
import { SilenceDetails } from "~/components/silnce-details"
import { SilenceList } from "~/components/silence-list"
import { Button } from "~/components/ui/button"
import { Plus } from "lucide-react"
import { SilenceModal } from "~/components/silence-modal"
import { SilenceMatcherForm } from "~/components/silence-matcher-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { createSilence } from "../actions"

interface Matcher {
  name: string
  value: string
  isRegex: boolean
  isEqual: boolean
}

export default function SilencePage() {
  const [selectedSilence, setSelectedSilence] = useState<Silence | null>(null)
  const [refresh, setRefresh] = useState<boolean>(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createStep, setCreateStep] = useState(1)
  const [newSilenceData, setNewSilenceData] = useState<{ matchers: Matcher[]; comment: string, createdby: string } | null>(null)

  useEffect(() => {
    setSelectedSilence(null)
  }, [])

  const handleCreateSilence = async (startDate: string, endDate: string) => {
    if (newSilenceData) {
      // Implement the logic to create a new silence
      console.log("Creating silence:", { ...newSilenceData, startDate, endDate })
      await createSilence({
        ...newSilenceData, startsAt: startDate, endsAt: endDate,
        id: "",
        updatedAt: startDate,
        createdBy: newSilenceData.createdby,
        status: {
          state: ""
        }
      });
      
      setIsCreateModalOpen(false)
      setCreateStep(1)
      setNewSilenceData(null)
      setRefresh(!refresh)
    }
  }

  const handleMatcherFormNext = (matchers: Matcher[], comment: string, createdby: string) => {
    setNewSilenceData({ matchers, comment, createdby })
    setCreateStep(2)
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900">
        <div className="container mx-auto px-6 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold text-gray-100">Silences</h1>
              <Button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Create Silence
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <SilenceList onSelectSilence={setSelectedSilence} refresh={refresh} />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Silence Details</h2>
                {selectedSilence ? (
                  <SilenceDetails silence={selectedSilence} setRefresh={setRefresh} refresh={refresh} />
                ) : (
                  <p className="text-gray-400">Select a silence to view details</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Dialog
        open={isCreateModalOpen && createStep === 1}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateModalOpen(false)
            setCreateStep(1)
          }
        }}
      >
        <DialogContent className="bg-gray-800 text-gray-200">
          <DialogHeader>
            <DialogTitle>Create Silence - Step 1</DialogTitle>
          </DialogHeader>
          <SilenceMatcherForm onNext={handleMatcherFormNext} />
        </DialogContent>
      </Dialog>

      <SilenceModal
        isOpen={isCreateModalOpen && createStep === 2}
        onClose={() => {
          setIsCreateModalOpen(false)
          setCreateStep(1)
        }}
        onSubmit={handleCreateSilence}
      />
    </div>
  )
}


import { useState } from "react"
import { motion } from "framer-motion"
import type { Silence } from "~/types"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { SilenceModal } from "./silence-modal"
import { deleteSilence, updateSilence } from "~/app/actions"

interface SilenceDetailsProps {
  silence: Silence
  setRefresh: (refresh: boolean) => void
  refresh: boolean
}

export function SilenceDetails({ silence, setRefresh, refresh }: SilenceDetailsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  async function onDelete() {
    await deleteSilence(silence.id)
    setRefresh(!refresh)
  }

  async function handleRecreateSubmit(newStartDate: string, newEndDate: string) {
    await updateSilence({ ...silence, startsAt: newStartDate, endsAt: newEndDate })
    setIsModalOpen(false)
    setRefresh(!refresh)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 rounded-lg shadow-xl p-6 text-gray-200"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-white">{silence.id}</h3>
        </div>

        <div className="flex space-x-4 my-2">
          {silence.status.state === "expired" && (
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
            >
              Recreate
            </Button>
          )}
          {silence.status.state != "expired" && (
            <Button variant="destructive" onClick={onDelete} className="bg-red-600 hover:bg-red-700 text-white flex-1">
              Delete
            </Button>
          )}
        </div>
        <div className="space-y-6">
          <Card className="w-full bg-gray-700 border-gray-600">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-200">Matchers</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {Object.entries(silence.matchers).map(([key, matcher]) => (
                  <li key={key} className="bg-gray-600/50 rounded-lg p-4">
                    <h5 className="text-lg font-semibold text-gray-200 mb-2">{matcher.name}</h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-400">Value:</span>{" "}
                        <span className="text-gray-200">{matcher.value}</span>
                      </div>
                      <div>
                        <Badge
                          variant={matcher.isRegex ? "outline" : "secondary"}
                          className="mr-2 bg-gray-500 text-gray-200"
                        >
                          {matcher.isRegex ? "Regex" : "Not Regex"}
                        </Badge>
                        <Badge
                          variant={matcher.isEqual ? "outline" : "secondary"}
                          className="bg-gray-500 text-gray-200"
                        >
                          {matcher.isEqual ? "Equal" : "Not Equal"}
                        </Badge>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="w-full bg-gray-700 border-gray-600">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-200">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-gray-300">
                <span className="font-semibold">Status:</span> {silence.status.state}
              </p>
              <p className="text-gray-300">
                <span className="font-semibold">Created By:</span> {silence.createdBy}
              </p>
              <p className="text-gray-300">
                <span className="font-semibold">Comment:</span> {silence.comment}
              </p>
            </CardContent>
          </Card>

          <Card className="w-full bg-gray-700 border-gray-600">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-200">Timing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-gray-300">
                <span className="font-semibold">Start:</span> {new Date(silence.startsAt).toLocaleString()}
              </p>
              <p className="text-gray-300">
                <span className="font-semibold">End:</span> {new Date(silence.endsAt).toLocaleString()}
              </p>
              <p className="text-gray-300">
                <span className="font-semibold">Updated:</span> {new Date(silence.updatedAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <SilenceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRecreateSubmit}
        initialStartDate={silence.startsAt}
        initialEndDate={silence.endsAt}
      />
    </>
  )
}


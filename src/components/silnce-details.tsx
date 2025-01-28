import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import type { Alert, Silence } from "~/types"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { deleteSilence, updateSilence } from "~/app/actions"

interface SilenceDetailsProps {
  silence: Silence
  setRefresh: (refresh: boolean) => void
  refresh: boolean
}

export function SilenceDetails({ silence, setRefresh, refresh }: SilenceDetailsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newStartDate, setNewStartDate] = useState(formatDateForInput(silence.startsAt))
  const [newStartTime, setNewStartTime] = useState(formatTimeForInput(silence.startsAt))
  const [newEndDate, setNewEndDate] = useState(formatDateForInput(silence.endsAt))
  const [newEndTime, setNewEndTime] = useState(formatTimeForInput(silence.endsAt))
  const [startError, setStartError] = useState("")
  const [endError, setEndError] = useState("")

  useEffect(() => {
    validateStartTime()
    validateEndTime()
  }, [newStartDate, newStartTime, newEndDate, newEndTime])

  function formatDateForInput(dateString: string) {
    return new Date(dateString).toISOString().split("T")[0]
  }

  function formatTimeForInput(dateString: string) {
    return new Date(dateString).toTimeString().split(" ")[0]?.slice(0, 5)
  }

  function validateStartTime() {
    const startDateTime = new Date(`${newStartDate}T${newStartTime}:00`)
    const now = new Date()
    if (startDateTime < now) {
      setStartError("Start time must be now or in the future")
    } else {
      setStartError("")
    }
  }

  function validateEndTime() {
    const startDateTime = new Date(`${newStartDate}T${newStartTime}:00`)
    const endDateTime = new Date(`${newEndDate}T${newEndTime}:00`)
    const minEndTime = new Date(startDateTime.getTime() + 5 * 60000) // 5 minutes later
    if (endDateTime <= startDateTime) {
      setEndError("End time must be after start time")
    } else if (endDateTime < minEndTime) {
      setEndError("End time must be at least 5 minutes after start time")
    } else {
      setEndError("")
    }
  }

  function onRecreate() {
    setIsModalOpen(true)
    const now = new Date()
    const end = new Date(now.getTime() + 60 * 60000)
    setNewStartDate(formatDateForInput(now.toISOString()))
    setNewStartTime(formatTimeForInput(now.toISOString()))
    setNewEndDate(formatDateForInput(end.toISOString()))
    setNewEndTime(formatTimeForInput(end.toISOString()))
  }

  async function onDelete() {
    await deleteSilence(silence.id)
    setRefresh(!refresh)
  }

  async function handleRecreateSubmit() {
    validateStartTime()
    validateEndTime()
    if (startError || endError) {
      return
    }
    const newStartDateTime = new Date(`${newStartDate}T${newStartTime}:00`)
    const newEndDateTime = new Date(`${newEndDate}T${newEndTime}:00`)
    await updateSilence({ ...silence, startsAt: newStartDateTime.toISOString(), endsAt: newEndDateTime.toISOString() })
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
          <Button variant="outline" onClick={onRecreate} className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-gray-800 text-gray-200">
          <DialogHeader>
            <DialogTitle>Recreate Silence</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
                className="bg-gray-700 text-gray-200"
              />
            </div>
            <div>
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)}
                className="bg-gray-700 text-gray-200"
              />
            </div>
            {startError && <p className="text-red-500 text-sm">{startError}</p>}
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
                className="bg-gray-700 text-gray-200"
              />
            </div>
            <div>
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={newEndTime}
                onChange={(e) => setNewEndTime(e.target.value)}
                className="bg-gray-700 text-gray-200"
              />
            </div>
            {endError && <p className="text-red-500 text-sm">{endError}</p>}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="text-gray-400 hover:text-gray-200"
            >
              Cancel
            </Button>
            <Button onClick={handleRecreateSubmit} disabled={!!startError || !!endError}>
              Recreate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}


import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"

interface SilenceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (startDate: string, endDate: string) => void
  initialStartDate?: string
  initialEndDate?: string
}

export function SilenceModal({ isOpen, onClose, onSubmit, initialStartDate, initialEndDate }: SilenceModalProps) {
    // default value for start date is today, default value for end date is tomorrow, default value for start time is now, default value for end time is now
    const [newStartDate, setNewStartDate] = useState(formatDateForInput(initialStartDate ?? new Date().toISOString()))
    const [newStartTime, setNewStartTime] = useState(formatTimeForInput(initialStartDate ?? new Date().toISOString()))
    const [newEndDate, setNewEndDate] = useState(formatDateForInput(initialEndDate ?? new Date().toISOString()))
    const [newEndTime, setNewEndTime] = useState(formatTimeForInput(initialEndDate ?? new Date().toISOString()))
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
      if ((endDateTime <= startDateTime && endDateTime < minEndTime) || endDateTime < minEndTime ) {
        setEndError("End time must be after start time")
      } else {
        setEndError("")
      }
    }
  
  useEffect(() => {
    validateStartTime()
    validateEndTime()
  }, [validateStartTime, validateEndTime])

  function handleSubmit() {
    validateStartTime()
    validateEndTime()
    if (startError || endError) {
      return
    }
    const newStartDateTime = new Date(`${newStartDate}T${newStartTime}:00`)
    const newEndDateTime = new Date(`${newEndDate}T${newEndTime}:00`)
    onSubmit(newStartDateTime.toISOString(), newEndDateTime.toISOString())
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-gray-200">
        <DialogHeader>
          <DialogTitle>Set Silence Duration</DialogTitle>
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
          <Button variant="outline" onClick={onClose} className="text-gray-600 hover:text-gray-800">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!!startError || !!endError}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

